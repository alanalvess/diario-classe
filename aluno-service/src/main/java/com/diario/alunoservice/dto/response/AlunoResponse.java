package com.diario.alunoservice.dto.response;

import com.diario.alunoservice.enums.Turno;

public record AlunoResponse(
        Long id,
        String nome,
        String matricula,
        String Turma,
        Turno turno,
        String perfilDeRisco
) {
}
