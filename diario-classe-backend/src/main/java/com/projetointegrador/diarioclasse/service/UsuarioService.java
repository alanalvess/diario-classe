package com.projetointegrador.diarioclasse.service;

import com.projetointegrador.diarioclasse.dto.request.UsuarioRequest;
import com.projetointegrador.diarioclasse.dto.response.UsuarioResponse;
import com.projetointegrador.diarioclasse.entity.Usuario;
import com.projetointegrador.diarioclasse.enums.Role;
import com.projetointegrador.diarioclasse.exeption.PermissaoNegadaException;
import com.projetointegrador.diarioclasse.exeption.UsuarioNaoEncontradoException;
import com.projetointegrador.diarioclasse.mapper.UsuarioMapper;
import com.projetointegrador.diarioclasse.repository.UsuarioRepository;
import com.projetointegrador.diarioclasse.validation.EmailValidator;
import com.projetointegrador.diarioclasse.validation.UsuarioValidator;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final AdminProperties adminProperties;
    private final UsuarioRepository repository;
    private final PasswordEncoder encoder;
    private final UsuarioMapper mapper;
    private final EmailValidator emailValidator;
    private final UsuarioValidator usuarioValidator;

    public UsuarioService(
            AdminProperties adminProperties,
            UsuarioRepository repository,
            PasswordEncoder encoder,
            UsuarioMapper mapper,
            EmailValidator emailValidator,
            UsuarioValidator usuarioValidator
    ) {
        this.adminProperties = adminProperties;
        this.repository = repository;
        this.encoder = encoder;
        this.mapper = mapper;
        this.emailValidator = emailValidator;
        this.usuarioValidator = usuarioValidator;
    }

    //    public List<UsuarioResponse> listarTodos(String emailAutenticado) {
//        if (!emailAutenticado.equals(adminProperties.getAdminEmail())) {
//            throw new PermissaoNegadaException("Apenas o ADMIN pode visualizar todos os usuários.");
//        }
//
//        return repository.findAll()
//                .stream()
//                .map(mapper::toResponseSemToken)
//                .toList();
//    }
    public List<UsuarioResponse> listarTodos(String emailAutenticado) {
        Usuario usuarioLogado = repository.findByEmail(emailAutenticado)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        boolean isAdminOuCoord = usuarioLogado.getRoles().contains(Role.ADMIN)
                || usuarioLogado.getRoles().contains(Role.COORDENADOR);

        if (!isAdminOuCoord) {
            throw new PermissaoNegadaException("Apenas ADMIN ou COORDENADOR podem visualizar todos os usuários.");
        }

        return repository.findAll()
                .stream()
                .map(mapper::toResponseSemToken)
                .toList();
    }

    public UsuarioResponse buscarPorId(Long id, String emailAutenticado) {
        Usuario usuarioAutenticado = repository.findByEmail(emailAutenticado)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário autenticado não encontrado"));

        boolean isAdmin = emailAutenticado.equals(adminProperties.getAdminEmail());
        boolean isProprioUsuario = usuarioAutenticado.getId().equals(id);

        if (!isAdmin && !isProprioUsuario) {
            throw new PermissaoNegadaException("Você não tem permissão para visualizar este usuário.");
        }

        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário com ID " + id + " não localizado!"));
        return mapper.toResponseSemToken(usuario);
    }

    public UsuarioResponse buscarPorEmail(String emailSolicitado, String emailAutenticado) {
        boolean isAdmin = emailAutenticado.equals(adminProperties.getAdminEmail());
        boolean isProprioUsuario = emailAutenticado.equals(emailSolicitado);

        if (!isAdmin && !isProprioUsuario) {
            throw new PermissaoNegadaException("Você não tem permissão para visualizar este usuário.");
        }

        Usuario usuario = repository.findByEmail(emailSolicitado)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com o email informado."));

        return mapper.toResponseSemToken(usuario);
    }

    public Usuario buscarEntidadePorEmail(String email) {
        return repository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNaoEncontradoException(email));
    }

    public List<UsuarioResponse> buscarPorNome(String nome) {

        List<Usuario> usuarios = repository.findAllByNomeContainingIgnoreCase(nome);

        return usuarios.stream()
                .map(mapper::toResponseSemToken)
                .toList();
    }


    public UsuarioResponse cadastrar(UsuarioRequest usuarioRequest, Authentication authentication) {
        emailValidator.validarEmailUnico(usuarioRequest.email());

        Usuario usuario = mapper.toEntity(usuarioRequest);

        if (usuarioValidator.usuarioDesejaSerAdmin(usuario)) {
            if (authentication == null) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "É necessário estar autenticado como ADMIN para criar outro ADMIN");
            }

            usuarioValidator.validarCriacaoDeAdmin(authentication);
        }

        usuarioValidator.atribuirRolePadraoSeNecessario(usuario);
        usuario.setSenha(encoder.encode(usuarioRequest.senha()));

        Usuario salvo = repository.save(usuario);

        return mapper.toResponseSemToken(salvo);
    }

    public UsuarioResponse atualizar(UsuarioRequest request, Usuario usuarioLogado) {
        Usuario usuario = repository.findById(request.id())
                .orElseThrow(() -> new UsuarioNaoEncontradoException(request.id()));

        emailValidator.validarEmailUnicoNoUpdate(request.email(), request.id());

        usuario.atualizarCampo(request, encoder, usuarioLogado);

        Usuario salvo = repository.save(usuario);
        return mapper.toResponseSemToken(salvo);
    }

    public UsuarioResponse atualizarAtributo(Long id, Map<String, Object> atributos, Usuario usuarioLogado) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new UsuarioNaoEncontradoException(id));

        usuario.atualizarAtributos(atributos, encoder, usuarioLogado);

        Usuario salvo = repository.save(usuario);
        return mapper.toResponseSemToken(salvo);
    }

    public void deletar(Long id, String email) {
        Usuario usuarioAutenticado = repository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário autenticado não encontrado"));

        Usuario usuarioParaExcluir = repository.findById(id)
                .orElseThrow(() -> new UsuarioNaoEncontradoException("ID: " + id));

        if (!usuarioParaExcluir.podeSerExcluido(usuarioAutenticado, adminProperties.getAdminEmail())) {
            throw new PermissaoNegadaException("Você não tem permissão para excluir este usuário.");
        }

        Boolean isAdminPadrao = email.equals(adminProperties.getAdminEmail());
        Boolean isProprioUsuario = usuarioAutenticado.getId().equals(usuarioParaExcluir.getId());

        if (isAdminPadrao || isProprioUsuario) {
            repository.delete(usuarioParaExcluir);
        } else {
            throw new PermissaoNegadaException("Você não tem permissão para excluir este usuário.");
        }
    }
}
