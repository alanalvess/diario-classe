package com.projetointegrador.diarioclasse.dto.response;

import com.projetointegrador.diarioclasse.entity.Disciplina;
import com.projetointegrador.diarioclasse.entity.Nota;
import com.projetointegrador.diarioclasse.entity.Turma;

import java.time.LocalDate;
import java.util.List;

public record AvaliacaoResponse(
        Long id,
        String titulo,
        LocalDate data,
        Double peso,
        Turma turma,
        Disciplina disciplina,
        List<Nota> notas
) {
}
