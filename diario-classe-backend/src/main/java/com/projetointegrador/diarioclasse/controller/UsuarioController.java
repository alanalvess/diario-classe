package com.projetointegrador.diarioclasse.controller;

import com.projetointegrador.diarioclasse.dto.request.UsuarioLoginRequest;
import com.projetointegrador.diarioclasse.dto.request.UsuarioRequest;
import com.projetointegrador.diarioclasse.dto.response.UsuarioResponse;
import com.projetointegrador.diarioclasse.entity.Usuario;
import com.projetointegrador.diarioclasse.service.AuthService;
import com.projetointegrador.diarioclasse.service.UsuarioService;
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
    public ResponseEntity<List<UsuarioResponse>> listarTodos(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        return ResponseEntity.ok(service.listarTodos(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> buscarPorId(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        return ResponseEntity.status(HttpStatus.OK).body(service.buscarPorId(id, email));
    }

    @GetMapping("/buscar/{nome}")
    public ResponseEntity<List<UsuarioResponse>> buscarPorNome(@PathVariable String nome) {
        return ResponseEntity.status(HttpStatus.OK).body(service.buscarPorNome(nome));
    }

    @GetMapping("/email")
    public ResponseEntity<UsuarioResponse> buscarPorEmail(@RequestParam String email, @AuthenticationPrincipal UserDetails userDetails) {
        String emailAutenticado = userDetails.getUsername();
        return ResponseEntity.ok(service.buscarPorEmail(email, emailAutenticado));
    }

    @PostMapping("/logar")
    public ResponseEntity<UsuarioResponse> autenticarUsuario(@RequestBody UsuarioLoginRequest usuarioLoginRequest) {
        return ResponseEntity.ok(auth.autenticarUsuario(usuarioLoginRequest));
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<UsuarioResponse> cadastrarUsuario(@RequestBody @Valid UsuarioRequest usuarioRequest, Authentication authentication) {
        UsuarioResponse resposta = service.cadastrar(usuarioRequest, authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponse> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid UsuarioRequest request,
            Authentication authentication
    ) {
        request = new UsuarioRequest(id, request.nome(), request.email(), request.senha(), request.roles());
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