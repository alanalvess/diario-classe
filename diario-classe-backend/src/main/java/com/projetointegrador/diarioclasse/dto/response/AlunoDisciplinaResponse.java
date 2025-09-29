package com.projetointegrador.diarioclasse.dto.response;

public record AlunoDisciplinaResponse(
        Long id,
        Long alunoId,
        Long disciplinaId,
        Long turmaId,
        Double notaFinal,
        Double frequencia,
        String observacoes
) {
}
