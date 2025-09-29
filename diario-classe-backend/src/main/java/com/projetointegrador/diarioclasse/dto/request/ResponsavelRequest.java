package com.projetointegrador.diarioclasse.dto.request;

import com.projetointegrador.diarioclasse.entity.Aluno;

import java.util.Set;

public record ResponsavelRequest(
        String nome,
        String email,
        String telefone,
        Set<Long> alunoIds
) {
}
