package com.projetointegrador.diarioclasse.dto.request.patchrequest;

import java.util.List;

public record ProfessorPatchRequest(
        String nome,
        String email,
        List<Long> disciplinaIds,
        List<Long> turmaIds
) {
}
