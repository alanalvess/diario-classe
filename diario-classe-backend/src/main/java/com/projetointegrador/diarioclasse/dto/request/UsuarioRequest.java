package com.projetointegrador.diarioclasse.dto.request;

import com.projetointegrador.diarioclasse.enums.Role;
import jakarta.validation.constraints.Email;

import java.util.Set;

public record UsuarioRequest(
        Long id,
        String nome,
        @Email(message = "O email deve ser válido") String email,
        String senha,
        Set<Role> roles
) {
}
