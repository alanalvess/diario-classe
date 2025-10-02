package com.projetointegrador.diarioclasse.dto.request;

import java.util.List;
import java.util.Set;

public record ProfessorRequest(
        String nome,
        String email,
        List<Long> disciplinaIds
) {
}
