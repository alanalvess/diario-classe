package com.projetointegrador.diarioclasse.dto;

import com.projetointegrador.diarioclasse.enums.Role;

public record PessoaInfo(
        String nome,
        String role,
        String turma
) { }
