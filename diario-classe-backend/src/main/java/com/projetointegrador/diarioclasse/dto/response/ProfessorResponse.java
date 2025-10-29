package com.projetointegrador.diarioclasse.dto.response;

import java.util.List;

public record ProfessorResponse(
        Long id,
        String nome,
        String email,
//        List<Long> disciplinaIds,
//        List<String> disciplinaNomes,
        List<Long> turmaIds,
        List<String> turmaNomes
) {
}
