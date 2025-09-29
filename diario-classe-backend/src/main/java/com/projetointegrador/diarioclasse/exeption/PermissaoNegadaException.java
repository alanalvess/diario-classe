package com.projetointegrador.diarioclasse.exeption;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class PermissaoNegadaException extends RuntimeException {
    public PermissaoNegadaException() {
        super("Você não tem permissão para realizar esta ação.");
    }

    public PermissaoNegadaException(String message) {
        super("Permissão negada: " + message);
    }
}

