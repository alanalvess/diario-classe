package com.projetointegrador.diarioclasse.service;

import com.projetointegrador.diarioclasse.dto.request.UsuarioLoginRequest;
import com.projetointegrador.diarioclasse.dto.response.UsuarioResponse;
import com.projetointegrador.diarioclasse.exeption.UsuarioNaoAutorizadoException;
import com.projetointegrador.diarioclasse.exeption.UsuarioNaoEncontradoException;
import com.projetointegrador.diarioclasse.mapper.UsuarioMapper;
import com.projetointegrador.diarioclasse.entity.Usuario;
import com.projetointegrador.diarioclasse.repository.UsuarioRepository;
import com.projetointegrador.diarioclasse.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager manager;
    private final UsuarioRepository repository;
    private final JwtService jwtService;
    private final UsuarioMapper mapper;

    public AuthService(
            AuthenticationManager manager,
            UsuarioRepository repository,
            JwtService jwtService,
            UsuarioMapper mapper
    ) {
        this.manager = manager;
        this.repository = repository;
        this.jwtService = jwtService;
        this.mapper = mapper;
    }

    public UsuarioResponse autenticarUsuario(UsuarioLoginRequest usuarioLoginRequest) {
        try {
            manager.authenticate(
                    new UsernamePasswordAuthenticationToken(usuarioLoginRequest.email(), usuarioLoginRequest.senha())
            );

            Usuario usuario = repository.findByEmail(usuarioLoginRequest.email())
                    .orElseThrow(() -> new UsuarioNaoEncontradoException("Usuário não encontrado"));

            String token = "Bearer " + jwtService.generateToken(usuario.getEmail(), usuario.getRoles());

            return mapper.toResponse(usuario, token);

        } catch (AuthenticationException ex) {
            throw new UsuarioNaoAutorizadoException("Falha na autenticação");
        }
    }
}
