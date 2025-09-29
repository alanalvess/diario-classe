package com.projetointegrador.diarioclasse.exeption;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class ExclusaoProibidaException extends RuntimeException {
    public ExclusaoProibidaException(String message) {
        super(message);
    }
}
