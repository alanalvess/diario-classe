package com.diario.userservice.exeption;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class AdminNaoExcluivelException extends RuntimeException {
    public AdminNaoExcluivelException() {
        super("O usuário ADMIN padrão não pode ser excluído.");
    }
}


