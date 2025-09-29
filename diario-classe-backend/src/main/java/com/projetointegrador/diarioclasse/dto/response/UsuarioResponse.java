package com.projetointegrador.diarioclasse.dto.response;

import com.projetointegrador.diarioclasse.enums.Role;

import java.util.Set;

public record UsuarioResponse(
        Long id,
        String nome,
        String email,
        String token,
        Set<Role> roles
) {
}
