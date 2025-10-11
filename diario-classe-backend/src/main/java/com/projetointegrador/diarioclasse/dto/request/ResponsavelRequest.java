package com.projetointegrador.diarioclasse.dto.request;

import java.util.List;

public record ResponsavelRequest(
        String nome,
        String email,
        String telefone,
        List<Long> alunoIds
) {
}
