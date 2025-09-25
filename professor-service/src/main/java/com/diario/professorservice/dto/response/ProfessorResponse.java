package com.diario.professorservice.dto.response;

public record ProfessorResponse(
        Long id,
        String nome,
        String disciplinas,
        String turmas
) {
}
