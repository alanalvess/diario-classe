package com.projetointegrador.diarioclasse.dto.request;

public record AlunoAnaliseRequest(
        Long id,
        String nome,
        double mediaGeral,
        double frequenciaGeral
) {}
