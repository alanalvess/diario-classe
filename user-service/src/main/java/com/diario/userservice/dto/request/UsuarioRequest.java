package com.diario.userservice.dto.request;

import com.diario.userservice.enums.Role;

import java.util.Set;

public record UsuarioRequest(
        Long id,
        String nome,
        String email,
        String senha,
        Set<Role> roles
) {
}
