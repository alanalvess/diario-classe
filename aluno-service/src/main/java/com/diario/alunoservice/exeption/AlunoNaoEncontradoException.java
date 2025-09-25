package com.diario.alunoservice.exeption;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class AlunoNaoEncontradoException extends RuntimeException {
    public AlunoNaoEncontradoException(Long id) {
        super("Aluno com ID " + id + " não encontrado.");
    }

    public AlunoNaoEncontradoException(String nome) {
        super("Aluno com nome " + nome + " não encontrado.");
    }
}
