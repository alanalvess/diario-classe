package com.diario.userservice.exeption;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class AlunoJaCadastradoException extends RuntimeException {
    public AlunoJaCadastradoException(String nome) {
        super("Já existe um aluno com este nome '" + nome + "'.");
    }
}
