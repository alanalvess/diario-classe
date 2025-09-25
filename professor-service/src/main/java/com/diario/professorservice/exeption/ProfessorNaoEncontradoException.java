package com.diario.professorservice.exeption;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ProfessorNaoEncontradoException extends RuntimeException {
    public ProfessorNaoEncontradoException(Long id) {
        super("Professor com ID " + id + " não encontrado.");
    }

    public ProfessorNaoEncontradoException(String nome) {
        super("Professor com nome " + nome + " não encontrado.");
    }
}
