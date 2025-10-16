package com.projetointegrador.diarioclasse.dto.response;

import com.projetointegrador.diarioclasse.entity.Alerta;
import com.projetointegrador.diarioclasse.enums.StatusAlerta;

import java.time.LocalDateTime;

public record AlertaResponse(
        Long id,
        Boolean riscoReprovacao,
        Boolean riscoEvasao,
        Double scoreRisco,
        LocalDateTime dataGeracao,
        StatusAlerta status,
        Long alunoId,
        String alunoNome,
        String mensagemResumo
) {
    public static AlertaResponse fromEntity(Alerta alerta) {
        return new AlertaResponse(
                alerta.getId(),
                alerta.isRiscoReprovacao(),
                alerta.isRiscoEvasao(),
                alerta.getScoreRisco(),
                alerta.getDataGeracao(),
                alerta.getStatus(),
                alerta.getAluno().getId(),
                alerta.getAluno().getNome(),
                alerta.getMensagemResumo()
        );
    }


}
