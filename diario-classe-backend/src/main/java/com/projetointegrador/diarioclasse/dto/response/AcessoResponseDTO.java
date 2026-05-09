package com.projetointegrador.diarioclasse.dto.response;

import com.projetointegrador.diarioclasse.enums.Role;
import com.projetointegrador.diarioclasse.enums.TipoAcesso;

import java.time.LocalDateTime;

public record AcessoResponseDTO(
        Long id,
        Long pessoaId,
        String nome,
        String role,
        String turma, // 👈 NOVO
        TipoAcesso tipo,
        LocalDateTime dataHora
) {}
