package com.diario.userservice.service;

import com.diario.userservice.dto.request.UsuarioRequest;
import com.diario.userservice.dto.response.UsuarioResponse;
import com.diario.userservice.entity.Usuario;
import com.diario.userservice.enums.Role;
import com.diario.userservice.exeption.ExclusaoProibidaException;
import com.diario.userservice.exeption.PermissaoNegadaException;
import com.diario.userservice.exeption.UsuarioNaoEncontradoException;
import com.diario.userservice.mapper.UsuarioMapper;
import com.diario.userservice.repository.UsuarioRepository;
import com.diario.userservice.validation.EmailValidator;
import com.diario.userservice.validation.UsuarioValidator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class UsuarioService {

    @Value("${admin.email}")
    private String adminEmail;

    private final UsuarioRepository usuarioRepository;
    private final UsuarioValidator usuarioValidator;
    private final EmailValidator emailValidator;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioMapper usuarioMapper;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            UsuarioValidator usuarioValidator,
            EmailValidator emailValidator,
            PasswordEncoder passwordEncoder,
            UsuarioMapper usuarioMapper
    ) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioValidator = usuarioValidator;
        this.emailValidator = emailValidator;
        this.passwordEncoder = passwordEncoder;
        this.usuarioMapper = usuarioMapper;
    }

    public List<UsuarioResponse> listarTodos() {
        return usuarioRepository.findAll()
                .stream()
                .map(usuarioMapper::toResponseSemToken)
                .toList();
    }

    public UsuarioResponse buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .map(usuarioMapper::toResponseSemToken)
                .orElseThrow(() -> new UsuarioNaoEncontradoException(id));
    }

    public UsuarioResponse buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .map(usuarioMapper::toResponseSemToken)
                .orElseThrow(() -> new UsuarioNaoEncontradoException(email));
    }

    public Usuario buscarEntidadePorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNaoEncontradoException(email));
    }


    public UsuarioResponse cadastrar(UsuarioRequest request, Authentication authentication) {
        emailValidator.validarEmailUnico(request.email());

        Usuario usuario = usuarioMapper.toEntity(request);

        if (usuarioValidator.usuarioDesejaSerAdmin(usuario)) {
            usuarioValidator.validarCriacaoDeAdmin(usuario, authentication);
        }

        usuarioValidator.atribuirRolePadraoSeNecessario(usuario);
        usuario.setSenha(passwordEncoder.encode(request.senha()));

        Usuario salvo = usuarioRepository.save(usuario);
        return usuarioMapper.toResponseSemToken(salvo);
    }

    public UsuarioResponse atualizar(UsuarioRequest request, Usuario usuarioLogado) {
        Usuario usuario = usuarioRepository.findById(request.id())
                .orElseThrow(() -> new UsuarioNaoEncontradoException(request.id()));

        emailValidator.validarEmailUnicoNoUpdate(request.email(), request.id());

        usuario.atualizarCampo(request, passwordEncoder, usuarioLogado);

        Usuario salvo = usuarioRepository.save(usuario);
        return usuarioMapper.toResponseSemToken(salvo);
    }

    public UsuarioResponse atualizarAtributo(Long id, Map<String, Object> atributos, Usuario usuarioLogado) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNaoEncontradoException(id));

        usuario.atualizarAtributos(atributos, passwordEncoder, usuarioLogado);

        Usuario salvo = usuarioRepository.save(usuario);
        return usuarioMapper.toResponseSemToken(salvo);
    }

    public void deletar(Long id, String email) {
        Usuario usuarioAutenticado = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNaoEncontradoException(email));

        Usuario usuarioParaExcluir = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNaoEncontradoException(id));

        if (usuarioParaExcluir.getEmail().equals(adminEmail)) {
            throw new ExclusaoProibidaException("O usuário ADMIN padrão não pode ser excluído.");
        }

        boolean isAdmin = usuarioAutenticado.getRoles().contains(Role.ADMIN);
        boolean isProprioUsuario = usuarioAutenticado.getId().equals(usuarioParaExcluir.getId());

        if (isAdmin || isProprioUsuario) {
            usuarioRepository.delete(usuarioParaExcluir);
        } else {
            throw new PermissaoNegadaException("Você não tem permissão para excluir este usuário.");
        }
    }

}
