package com.diario.alunoservice.exeption;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class AlunoDuplicadoException extends RuntimeException {
    public AlunoDuplicadoException(String nome) {
        super("Já existe um aluno com este nome '" + nome + "'.");
    }
}
