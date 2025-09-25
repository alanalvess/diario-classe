package com.diario.userservice.dto.response;

import com.diario.userservice.enums.Role;

import java.util.Set;

public record UsuarioResponse(
        Long id,
        String nome,
        String email,
        String token,
        Set<Role> roles
) {
}
