package com.diario.professorservice.exeption;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ProfessorDuplicadoException extends RuntimeException {
    public ProfessorDuplicadoException(String nome) {
        super("Já existe um professor com este nome '" + nome + "'.");
    }
}
