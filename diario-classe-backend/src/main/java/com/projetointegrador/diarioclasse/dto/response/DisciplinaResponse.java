package com.projetointegrador.diarioclasse.dto.response;

import com.projetointegrador.diarioclasse.entity.Avaliacao;
import com.projetointegrador.diarioclasse.entity.Professor;
import com.projetointegrador.diarioclasse.entity.Turma;

import java.util.List;
import java.util.Set;

public record DisciplinaResponse(
        Long id,
        String nome,
        String codigo,

        Double mediaTurma,
        Double frequenciaMedia,

        Set<Professor> professores,

        Set<Turma> turmas,

        List<Avaliacao> avaliacoes
) {
}
