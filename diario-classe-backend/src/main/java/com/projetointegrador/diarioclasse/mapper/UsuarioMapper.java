package com.projetointegrador.diarioclasse.mapper;

import com.projetointegrador.diarioclasse.dto.request.UsuarioRequest;
import com.projetointegrador.diarioclasse.dto.response.UsuarioResponse;
import com.projetointegrador.diarioclasse.entity.Usuario;
import org.springframework.stereotype.Component;

import java.util.HashSet;

@Component
public class UsuarioMapper {

    public Usuario toEntity(UsuarioRequest request) {
        Usuario entity = new Usuario();

        entity.setNome(request.nome());
        entity.setEmail(request.email());
        entity.setSenha(request.senha());
        entity.setRoles(request.roles() != null ? request.roles() : new HashSet<>());

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
