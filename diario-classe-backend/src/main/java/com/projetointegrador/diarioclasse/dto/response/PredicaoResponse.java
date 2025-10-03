package com.projetointegrador.diarioclasse.dto.response;

import com.projetointegrador.diarioclasse.ml.Predicao;

public record PredicaoResponse(
        Long alunoId,
        String nomeAluno,
        boolean riscoReprovacao,
        boolean riscoEvasao,
        double scoreRisco
) {}


