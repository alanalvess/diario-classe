package com.projetointegrador.diarioclasse.dto.response;

public record DisciplinaResponse(
        Long id,
        String nome,
        String codigo,
        Double mediaTurma,
        Double frequenciaMedia
) {
}
