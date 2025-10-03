package com.projetointegrador.diarioclasse.dto.response;

import java.time.LocalDate;

public record AlunoResponse(
        Long id,
        String nome,
        String matricula,
        LocalDate dataNascimento,
        Long turmaId
) {
}
