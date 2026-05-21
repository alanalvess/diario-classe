package com.projetointegrador.diarioclasse.dto.response;

import java.time.LocalDate;

public record AlunoResponse(
        Long id,
        String nome,
        String matricula,
        String email,
        LocalDate dataNascimento,
        Long turmaId,
        String turmaNome
) {
}
