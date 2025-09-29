package com.projetointegrador.diarioclasse.dto.request;

import lombok.Builder;

@Builder
public record AlunoDisciplinaRequest(
        Long alunoId,
        Long disciplinaId,
        Long turmaId,
        Double notaFinal,
        Double frequencia,
        String observacoes
) {
}
