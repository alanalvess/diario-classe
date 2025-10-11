package com.projetointegrador.diarioclasse.dto.response;

import java.util.List;

public record ResponsavelResponse(
        Long id,
        String nome,
        String email,
        String telefone,
        List<Long> alunoIds
) {
}
