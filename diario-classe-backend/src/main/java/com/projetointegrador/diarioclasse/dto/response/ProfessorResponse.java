package com.projetointegrador.diarioclasse.dto.response;

import java.util.List;

public record ProfessorResponse(
        Long id,
        String nome,
        String email,
        List<Long> disciplinaIds,
        List<Long> turmaIds
) {
}
