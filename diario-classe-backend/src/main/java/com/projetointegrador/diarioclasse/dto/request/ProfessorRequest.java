package com.projetointegrador.diarioclasse.dto.request;

import java.util.Set;

public record ProfessorRequest(
        String nome,
        String email,
        Set<Long> disciplinaIds
) {
}
