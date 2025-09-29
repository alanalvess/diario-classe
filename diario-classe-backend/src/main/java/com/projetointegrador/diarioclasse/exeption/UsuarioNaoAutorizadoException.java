package com.projetointegrador.diarioclasse.exeption;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class UsuarioNaoAutorizadoException extends RuntimeException {
    public UsuarioNaoAutorizadoException() {
        super("Usuário não autorizado. Email ou senha inválidos.");
    }

    public UsuarioNaoAutorizadoException(String detalhes) {
        super("Usuário não autorizado: " + detalhes);
    }
}
