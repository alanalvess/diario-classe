package com.diario.alunoservice.exeption;

public class DatasInvalidasException extends RuntimeException {
    public DatasInvalidasException(String message) {
        super(message);
    }
}
