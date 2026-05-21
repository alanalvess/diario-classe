package com.projetointegrador.diarioclasse.dto.request.patchrequest;

import java.time.LocalDate;

public record AlunoPatchRequest(
        String nome,
        String matricula,
        String email,
        LocalDate dataNascimento,
        Long turmaId
) {}

