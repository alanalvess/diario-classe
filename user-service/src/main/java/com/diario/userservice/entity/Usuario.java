package com.diario.userservice.entity;

import com.diario.userservice.dto.request.UsuarioRequest;
import com.diario.userservice.enums.Role;
import com.diario.userservice.exeption.PermissaoNegadaException;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "tb_usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "O atributo Nome é obrigatório!")
    private String nome;

    @NotNull(message = "O atributo Usuário é obrigatório!")
    @Email(message = "O atributo Usuário deve ser um email válido!")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "O atributo Senha é obrigatório!")
    @Size(min = 8, message = "A Senha deve ter no mínimo 8 caracteres")
    private String senha;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "usuario_roles", joinColumns = @JoinColumn(name = "usuario_id"))
    @Enumerated(EnumType.STRING)
    private Set<Role> roles = new HashSet<>();

    public boolean isAdminPadrao(String adminEmail) {
        return roles.contains(Role.ADMIN) && this.email.equals(adminEmail);
    }

    public boolean podeSerExcluido(Usuario outroUsuario, String adminEmail) {
        if (isAdminPadrao(adminEmail)) return false; // admin padrão nunca pode ser excluído
        return outroUsuario.getRoles().contains(Role.ADMIN) || this.id.equals(outroUsuario.getId());
    }

    public void atualizarCampo(UsuarioRequest request, PasswordEncoder passwordEncoder, Usuario usuarioLogado) {
        this.nome = request.nome();
        this.email = request.email();

        if (request.senha() != null && !request.senha().isBlank()) {
            this.senha = passwordEncoder.encode(request.senha());
        }

        // Só valida se roles vierem no request
        if (request.roles() != null && !request.roles().isEmpty()) {
            validarAtualizacaoRoles(request.roles(), usuarioLogado);
            this.roles = request.roles();
        }
    }

    public void atualizarAtributos(Map<String, Object> atributos, PasswordEncoder passwordEncoder, Usuario usuarioLogado) {
        atributos.forEach((campo, valor) -> {
            switch (campo) {
                case "nome" -> this.nome = (String) valor;
                case "email" -> this.email = (String) valor;
                case "senha" -> this.senha = passwordEncoder.encode((String) valor);
                case "roles" -> {
                    Set<Role> novasRoles = (Set<Role>) valor;
                    if (novasRoles != null && !novasRoles.isEmpty()) {
                        validarAtualizacaoRoles(novasRoles, usuarioLogado);
                        this.roles = novasRoles;
                    }
                }
                default -> throw new IllegalArgumentException("Campo não suportado: " + campo);
            }
        });
    }


    private void validarAtualizacaoRoles(Set<Role> novasRoles, Usuario usuarioLogado) {
        boolean temAdminAtual = this.roles.contains(Role.ADMIN);
        boolean vaiAdicionarAdmin = novasRoles.contains(Role.ADMIN);
        boolean vaiRemoverAdmin = !vaiAdicionarAdmin && temAdminAtual;

        boolean logadoEhAdmin = usuarioLogado != null && usuarioLogado.getRoles().contains(Role.ADMIN);

        // Não pode adicionar admin se não for admin logado
        if (vaiAdicionarAdmin && !temAdminAtual && !logadoEhAdmin) {
            throw new PermissaoNegadaException("Somente ADMIN pode adicionar a role ADMIN");
        }

        // Não pode remover admin se não for admin logado
        if (vaiRemoverAdmin && !logadoEhAdmin) {
            throw new PermissaoNegadaException("Somente ADMIN pode remover a role ADMIN");
        }
    }

}
