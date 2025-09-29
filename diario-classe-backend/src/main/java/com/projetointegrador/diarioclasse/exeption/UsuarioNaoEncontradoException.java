package com.projetointegrador.diarioclasse.exeption;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class UsuarioNaoEncontradoException extends RuntimeException {
    public UsuarioNaoEncontradoException(Long id) {
        super("Usuário com ID " + id + " não encontrado.");
    }

    public UsuarioNaoEncontradoException(String email) {
        super("Usuário com e-mail " + email + " não encontrado.");
    }
}
