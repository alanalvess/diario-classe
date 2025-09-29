package com.projetointegrador.diarioclasse.dto.request.patchrequest;

import java.time.LocalDate;

public record AlunoPatchRequest(
        String nome,
        String matricula,
        LocalDate dataNascimento,
        Long turmaId
) {}

