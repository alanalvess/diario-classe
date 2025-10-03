package com.projetointegrador.diarioclasse.dto.response;

public record AlunoDisciplinaResponse(
        Long id,
        Long alunoId,
        String alunoNome,
        Long disciplinaId,
        String disciplinaNome,
        Long turmaId,
        String turmaNome,
        Double notaFinal,
        Double frequencia,
        String observacoes
) {}

