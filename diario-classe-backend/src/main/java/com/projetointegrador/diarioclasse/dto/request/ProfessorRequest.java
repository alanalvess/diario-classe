package com.projetointegrador.diarioclasse.dto.request;

import java.util.List;

public record ProfessorRequest(
        String nome,
        String email,
        List<Long> disciplinaIds
) {
}
