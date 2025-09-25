package com.diario.userservice.service;

import com.diario.userservice.dto.request.UsuarioLoginRequest;
import com.diario.userservice.dto.response.UsuarioResponse;
import com.diario.userservice.entity.Usuario;
import com.diario.userservice.exeption.UsuarioNaoEncontradoException;
import com.diario.userservice.mapper.UsuarioMapper;
import com.diario.userservice.repository.UsuarioRepository;
import com.diario.userservice.security.JwtService;
import com.diario.userservice.security.UserDetailsImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;

    public AuthService(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UsuarioRepository usuarioRepository,
            UsuarioMapper usuarioMapper
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
        this.usuarioMapper = usuarioMapper;
    }

    public Optional<UsuarioResponse> autenticar(UsuarioLoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.senha()));

        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> new UsuarioNaoEncontradoException(request.email()));

        String token = jwtService.generateToken(new UserDetailsImpl(usuario));

        return Optional.of(usuarioMapper.toResponse(usuario, token));
    }
}
