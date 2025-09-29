package com.projetointegrador.diarioclasse.dto.request.patchrequest;

public record AlunoDisciplinaPatchRequest(
        Long alunoId,
        Long disciplinaId,
        Long turmaId,
        Double notaFinal,
        Double frequencia,
        String observacoes
) {
}
