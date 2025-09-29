package com.projetointegrador.diarioclasse.validation;

import com.projetointegrador.diarioclasse.exeption.EmailJaCadastradoException;
import com.projetointegrador.diarioclasse.repository.UsuarioRepository;
import org.springframework.stereotype.Component;

@Component
public class EmailValidator {

    private final UsuarioRepository usuarioRepository;

    public EmailValidator(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public void validarEmailUnico(String email) {
        if (usuarioRepository.findByEmail(email).isPresent()) {
            throw new EmailJaCadastradoException(email);
        }
    }

    public void validarEmailUnicoNoUpdate(String email, Long id) {
        usuarioRepository.findByEmail(email)
                .filter(user -> !user.getId().equals(id))
                .ifPresent(user -> {
                    throw new EmailJaCadastradoException(email);
                });
    }
}
