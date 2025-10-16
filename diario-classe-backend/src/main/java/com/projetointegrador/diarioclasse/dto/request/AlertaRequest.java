package com.projetointegrador.diarioclasse.dto.request;

import com.projetointegrador.diarioclasse.enums.StatusAlerta;

import java.time.LocalDateTime;

public record AlertaRequest(
        Boolean riscoReprovacao,
        Boolean riscoEvasao,
        Double scoreRisco,
        LocalDateTime dataGeracao,
        StatusAlerta status,
        Long alunoId,
        String alunoNome
) {}

