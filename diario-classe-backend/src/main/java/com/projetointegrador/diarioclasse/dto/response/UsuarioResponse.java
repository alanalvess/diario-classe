package com.projetointegrador.diarioclasse.dto.response;

import com.projetointegrador.diarioclasse.enums.Role;

import java.util.List;

public record UsuarioResponse(
        Long id,
        String nome,
        String email,
        String token,
        List<Role> roles
) {
}
