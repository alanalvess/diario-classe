package com.projetointegrador.diarioclasse.dto.request;

import com.projetointegrador.diarioclasse.entity.Aluno;

import java.util.Set;

public record TurmaRequest(
        Long id,
        String nome,
        String email,
        String telefone,
        Set<Aluno> alunos
) {
}
