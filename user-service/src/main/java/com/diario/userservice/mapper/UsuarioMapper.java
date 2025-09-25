package com.diario.userservice.mapper;

import com.diario.userservice.dto.request.UsuarioRequest;
import com.diario.userservice.dto.response.UsuarioResponse;
import com.diario.userservice.entity.Usuario;
import com.diario.userservice.enums.Role;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class UsuarioMapper {

    public Usuario toEntity(UsuarioRequest request) {
        Usuario entity = new Usuario();

        entity.setNome(request.nome());
        entity.setEmail(request.email());
        entity.setSenha(request.senha());
        Set<Role> roles = request.roles() != null ? request.roles() : new HashSet<>();
        if (roles.isEmpty()) {
            roles.add(Role.USER);
        }
        entity.setRoles(roles);

        return entity;
    }

    public UsuarioRequest toRequest(Usuario usuario) {
        return new UsuarioRequest(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getSenha(),
                usuario.getRoles()
        );
    }

    public UsuarioResponse toResponse(Usuario usuario, String token) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                token,
                usuario.getRoles()
        );
    }

    public UsuarioResponse toResponseSemToken(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                null,
                usuario.getRoles()
        );
    }
}

