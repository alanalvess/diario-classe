package com.projetointegrador.diarioclasse.dto;

import com.projetointegrador.diarioclasse.enums.Role;

import java.util.Map;

public record DashboardDTO(
        long total,
        long entradas,
        long saidas,
        Map<Role, Long> porTipo
) {}
