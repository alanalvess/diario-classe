package com.projetointegrador.diarioclasse.dto.response;

import com.projetointegrador.diarioclasse.entity.Aluno;

import java.util.Set;

public record ResponsavelResponse(
        Long id,
        String nome,
        String email,
        String telefone,
        Set<Aluno> alunos
) {
}
