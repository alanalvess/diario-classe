package com.projetointegrador.diarioclasse.entity;

import com.projetointegrador.diarioclasse.dto.request.UsuarioRequest;
import com.projetointegrador.diarioclasse.enums.Role;
import com.projetointegrador.diarioclasse.exeption.PermissaoNegadaException;
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

import java.util.*;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
    private List<Role> roles = new ArrayList<>();

    public Boolean isAdminPadrao(String adminEmail) {
        return roles.contains(Role.ADMIN) && this.email.equals(adminEmail);
    }

    public boolean podeSerExcluido(Usuario usuarioAutenticado, String adminEmail) {
        if (this.getEmail().equals(adminEmail)) {return false;}
        if (this.getId().equals(usuarioAutenticado.getId())) {return true;}
        if (usuarioAutenticado.getEmail().equals(adminEmail)) {return true;}

        boolean ehAdminOuCoordenador = usuarioAutenticado.getRoles().contains(Role.ADMIN)
                || usuarioAutenticado.getRoles().contains(Role.COORDENADOR);

        if (ehAdminOuCoordenador) {return true;}
        return false;
    }


    public void atualizarCampo(UsuarioRequest request, PasswordEncoder passwordEncoder, Usuario usuarioLogado) {
        this.nome = request.nome();
        this.email = request.email();

        if (request.senha() != null && !request.senha().isBlank()) {
            this.senha = passwordEncoder.encode(request.senha());
        }

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
                case "senha" -> {
                    if (valor != null && !((String) valor).isBlank()) {
                        this.senha = passwordEncoder.encode((String) valor);
                    }
                }
                case "roles" -> {
                    if (valor instanceof List<?> lista) {
                        List<Role> novasRoles = lista.stream()
                                .map(String::valueOf)
                                .map(Role::valueOf)
                                .toList(); // ⚠ toList() cria lista imutável

                        if (!novasRoles.isEmpty()) {
                            validarAtualizacaoRoles(novasRoles, usuarioLogado);
                            this.roles = new ArrayList<>(novasRoles); // ✅ lista mutável para JPA
                        }
                    }
                }

                default -> throw new IllegalArgumentException("Campo não suportado: " + campo);
            }
        });
    }

    private void validarAtualizacaoRoles(List<Role> novasRoles, Usuario usuarioLogado) {
        boolean temAdminAtual = this.roles.contains(Role.ADMIN);
        boolean vaiAdicionarAdmin = novasRoles.contains(Role.ADMIN);
        boolean vaiRemoverAdmin = !vaiAdicionarAdmin && temAdminAtual;

        boolean logadoEhAdmin = usuarioLogado != null && usuarioLogado.getRoles().contains(Role.ADMIN);

        if (vaiAdicionarAdmin && !temAdminAtual && !logadoEhAdmin) {
            throw new PermissaoNegadaException("Somente ADMIN pode adicionar a role ADMIN");
        }

        if (vaiRemoverAdmin && !logadoEhAdmin) {
            throw new PermissaoNegadaException("Somente ADMIN pode remover a role ADMIN");
        }
    }
}
