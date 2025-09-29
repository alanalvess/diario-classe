package com.projetointegrador.diarioclasse.exeption;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class RecursoEmUsoException extends RuntimeException {
    public RecursoEmUsoException(String recurso, String detalhe) {
        super(recurso + " em uso. Detalhes: " + detalhe);
    }
}
