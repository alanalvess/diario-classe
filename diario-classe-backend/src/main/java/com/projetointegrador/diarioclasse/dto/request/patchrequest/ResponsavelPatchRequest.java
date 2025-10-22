package com.projetointegrador.diarioclasse.dto.request.patchrequest;

import com.projetointegrador.diarioclasse.enums.Filiacao;

public record ResponsavelPatchRequest(
        String nome,
        String email,
        String telefone,
        Filiacao filiacao
) {}

