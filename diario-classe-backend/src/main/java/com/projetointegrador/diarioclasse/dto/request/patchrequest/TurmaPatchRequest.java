package com.projetointegrador.diarioclasse.dto.request.patchrequest;

import java.util.List;

public record TurmaPatchRequest(
        String nome,
        String anoLetivo,
        List<Long> professorIds,
        List<Long> disciplinaIds
) {
}
