package com.projetointegrador.diarioclasse.dto.request.patchrequest;

import java.time.LocalDate;

public record ObservacaoPatchRequest(
        LocalDate data,
        String descricao,
        String categoria,
        Long alunoId,
        Long turmaId,
        Long disciplinaId,
        Long professorId
) {
}
