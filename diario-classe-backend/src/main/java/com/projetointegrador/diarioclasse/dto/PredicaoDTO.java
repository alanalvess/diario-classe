package com.projetointegrador.diarioclasse.dto;

import java.util.List;

public record PredicaoDTO(
        Long alunoId,
        String alunoNome,
        boolean riscoReprovacao,
        boolean riscoEvasao,
        double scoreRisco,
        List<ResponsavelDTO> responsaveis
) {}

