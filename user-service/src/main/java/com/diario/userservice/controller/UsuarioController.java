package com.diario.userservice.controller;

import com.diario.userservice.dto.request.UsuarioLoginRequest;
import com.diario.userservice.dto.request.UsuarioRequest;
import com.diario.userservice.dto.response.UsuarioResponse;
import com.diario.userservice.entity.Usuario;
import com.diario.userservice.exeption.UsuarioNaoAutorizadoException;
import com.diario.userservice.service.AuthService;
import com.diario.userservice.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UsuarioController {

    private final UsuarioService service;
    private final AuthService auth;

    public UsuarioController(
            UsuarioService service,
            AuthService auth
    ) {
        this.service = service;
        this.auth = auth;
    }

    @GetMapping("/all")
    public ResponseEntity<List<UsuarioResponse>> listarTodos() {
        return ResponseEntity.status(HttpStatus.OK).body(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(service.buscarPorId(id));
    }

    @GetMapping("/buscar/{email}")
    public ResponseEntity<UsuarioResponse> buscarPorEmail(@PathVariable String email) {
        return ResponseEntity.status(HttpStatus.OK).body(service.buscarPorEmail(email));
    }

    @PostMapping("/logar")
    public ResponseEntity<UsuarioResponse> autenticarUsuario(@RequestBody UsuarioLoginRequest request) {
        return auth.autenticar(request)
                .map(resposta -> ResponseEntity.status(HttpStatus.OK).body(resposta))
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

//    public Optional<UsuarioResponse> autenticarUsuario(UsuarioLoginRequest request) {
//        // Autentica
//        authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(request.email(), request.senha()));
//
//        Usuario usuario = usuarioRepository.findByEmail(request.email())
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
//
//        // Gera token JWT puro (sem "Bearer ")
//        String token = jwtService.generateToken(new UserDetailsImpl(usuario));
//
//        return Optional.of(usuarioMapper.toResponse(usuario, token));
//    }


    @PostMapping("/cadastrar")
    public ResponseEntity<UsuarioResponse> cadastrarUsuario(@RequestBody @Valid UsuarioRequest request, Authentication authentication) {
        UsuarioResponse response = service.cadastrar(request, authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponse> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid UsuarioRequest request,
            Authentication authentication
    ) {
        // Garante que o request tem o ID correto
        request = new UsuarioRequest(id, request.nome(), request.email(), request.senha(), request.roles());

        // Busca usuário logado do banco
        Usuario usuarioLogado = service.buscarEntidadePorEmail(authentication.getName());
        if (usuarioLogado == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado");
        }

        UsuarioResponse resposta = service.atualizar(request, usuarioLogado);
        return ResponseEntity.ok(resposta);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UsuarioResponse> atualizarAtributo(
            @PathVariable Long id,
            @RequestBody Map<String, Object> atributos,
            Authentication authentication
    ) {
        Usuario usuarioLogado = service.buscarEntidadePorEmail(authentication.getName());
        if (usuarioLogado == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado");
        }

        UsuarioResponse resposta = service.atualizarAtributo(id, atributos, usuarioLogado);
        return ResponseEntity.ok(resposta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        service.deletar(id, email);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}