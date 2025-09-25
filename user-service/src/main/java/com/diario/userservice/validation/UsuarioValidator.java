package com.diario.userservice.validation;

import com.diario.userservice.entity.Usuario;
import com.diario.userservice.enums.Role;
import com.diario.userservice.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;

@Component
public class UsuarioValidator {

    private final UsuarioRepository usuarioRepository;

    public UsuarioValidator(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public void validarCriacaoDeAdmin(Usuario usuario, Authentication auth) {
        if (usuario.getRoles().contains(Role.ADMIN)) {
            if (auth == null) {
                throw new IllegalArgumentException("É necessário estar autenticado para criar ADMIN");
            }

            Usuario usuarioLogado = usuarioRepository.findByEmail(auth.getName())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Usuário autenticado não encontrado"));

            if (!usuarioLogado.getRoles().contains(Role.ADMIN)) {
                throw new IllegalArgumentException("Apenas ADMIN pode criar outro ADMIN!");
            }
        }
    }

    public boolean usuarioDesejaSerAdmin(Usuario usuario) {
        return usuario.getRoles().contains(Role.ADMIN);
    }

    public void atribuirRolePadraoSeNecessario(Usuario usuario) {
        if (usuario.getRoles() == null) {
            usuario.setRoles(new HashSet<>());
        }
        if (usuario.getRoles().isEmpty()) {
            usuario.getRoles().add(Role.USER);
        }
    }
}
