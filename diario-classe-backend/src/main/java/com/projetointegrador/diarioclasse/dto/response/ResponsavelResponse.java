package com.projetointegrador.diarioclasse.dto.response;

import com.projetointegrador.diarioclasse.enums.Filiacao;

import java.util.List;

public record ResponsavelResponse(
        Long id,
        String nome,
        String email,
        String telefone,
        Filiacao filiacao,
        List<Long> alunoIds
) {
}
