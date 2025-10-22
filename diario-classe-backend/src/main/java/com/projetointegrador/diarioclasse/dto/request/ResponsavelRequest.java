package com.projetointegrador.diarioclasse.dto.request;

import com.projetointegrador.diarioclasse.enums.Filiacao;

import java.util.List;

public record ResponsavelRequest(
        String nome,
        String email,
        String telefone,
        Filiacao filiacao,
        List<Long> alunoIds
) {
}
