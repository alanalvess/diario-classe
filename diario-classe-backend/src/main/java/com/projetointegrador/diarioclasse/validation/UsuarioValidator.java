package com.projetointegrador.diarioclasse.validation;

import com.projetointegrador.diarioclasse.entity.Usuario;
import com.projetointegrador.diarioclasse.enums.Role;
import com.projetointegrador.diarioclasse.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class UsuarioValidator {

    private final UsuarioRepository repository;

    public UsuarioValidator(UsuarioRepository repository) {
        this.repository = repository;
    }

    public Boolean usuarioDesejaSerAdmin(Usuario usuario) {
        return usuario.getRoles().contains(Role.ADMIN);
    }

    public void validarCriacaoDeAdmin(Authentication authentication) {
        Usuario usuarioLogado = repository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Usuário autenticado não encontrado"));

        if (!usuarioLogado.getRoles().contains(Role.ADMIN)) {
            throw new IllegalArgumentException("Apenas ADMIN pode criar outro ADMIN!");
        }
    }

    public void atribuirRolePadraoSeNecessario(Usuario usuario) {
        if (usuario.getRoles().isEmpty()) {
            usuario.getRoles().add(Role.USER);
        }
    }
}
