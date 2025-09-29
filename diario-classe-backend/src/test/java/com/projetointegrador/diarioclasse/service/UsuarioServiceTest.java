//package com.projetointegrador.diarioclasse.service;
//
//import com.projetointegrador.diarioclasse.dto.request.UsuarioLoginRequest;
//import com.projetointegrador.diarioclasse.dto.request.UsuarioRequest;
//import com.projetointegrador.diarioclasse.dto.response.UsuarioResponse;
//import com.projetointegrador.diarioclasse.enums.Role;
//import com.projetointegrador.diarioclasse.exeption.AcessoNegadoException;
//import com.projetointegrador.diarioclasse.entity.*;
//import com.projetointegrador.diarioclasse.repository.*;
//import com.projetointegrador.diarioclasse.security.JwtService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.test.util.ReflectionTestUtils;
//
//import java.util.*;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
//
//@ExtendWith(MockitoExtension.class)
//class UsuarioServiceTest {
//
//    @InjectMocks
//    private UsuarioService usuarioService;
//
//    @InjectMocks
//    private AuthService auth;
//
//    @Mock
//    private AdminProperties adminProperties;
//
//    @Mock
//    private UsuarioRepository usuarioRepository;
//
//    @Mock
//    private JwtService jwtService;
//
//    @Mock
//    private AdminSetupService adminSetupService;
//
//    @Mock
//    private PasswordEncoder passwordEncoder;
//
//    @BeforeEach
//    void setup() {
//        ReflectionTestUtils.setField(usuarioService, "adminEmail", adminProperties.getAdminEmail());
//        ReflectionTestUtils.setField(usuarioService, "adminPassword", adminProperties.getAdminPassword());
//        ReflectionTestUtils.setField(usuarioService, "adminName", adminProperties.getAdminName());
//    }
//
//    @Test
//    void criarAdminPadrao_DeveSalvarQuandoNaoExiste() {
//        when(usuarioRepository.findByEmail(adminProperties.getAdminEmail())).thenReturn(Optional.empty());
//        when(passwordEncoder.encode(any())).thenReturn("senhaCriptografada");
//
//        adminSetupService.criarAdminPadrao();
//
//        verify(usuarioRepository, times(1)).save(any(Usuario.class));
//    }
//
//    @Test
//    void listarTodos_DeveRetornarUsuarios_SeAdminAutenticado() {
//        when(usuarioRepository.findAll()).thenReturn(List.of(new Usuario(1L, "João", "joao@email.com", "123", Set.of(Role.USER))));
//
//        ReflectionTestUtils.setField(usuarioService, "adminEmail", "admin@email.com");
//
//        List<UsuarioResponse> usuarios = usuarioService.listarTodos("admin@email.com");
//
//        assertEquals(1, usuarios.size());
//        assertEquals("João", usuarios.getFirst().nome());
//    }
//
//    @Test
//    void listarTodos_DeveLancarExcecao_SeNaoForAdmin() {
//        String email = "usuario@email.com";
//
//        AcessoNegadoException ex = assertThrows(AcessoNegadoException.class,
//                () -> usuarioService.listarTodos(email));
//
//        assertEquals("Acesso Negado: Apenas o ADMIN pode visualizar todos os usuários.", ex.getMessage());
//    }
//
//    @Test
//    void cadastrar_DeveSalvarUsuarioComSenhaCriptografadaERoleUser() {
//        UsuarioRequest usuarioRequest = new UsuarioRequest(null, "Novo Usuário", "novo@email.com", "123456", new HashSet<>());
//
//        when(usuarioRepository.findByEmail("novo@email.com")).thenReturn(Optional.empty());
//        when(passwordEncoder.encode("123456")).thenReturn("senhaSegura");
//        when(usuarioRepository.save(any())).thenAnswer(inv -> {
//            Usuario u = inv.getArgument(0);
//            u.setId(1L);
//            return u;
//        });
//
//        UsuarioResponse dto = usuarioService.cadastrar(usuarioRequest, null);
//
//        assertEquals("Novo Usuário", dto.nome());
//        assertEquals("novo@email.com", dto.email());
//        assertTrue(dto.roles().contains(Role.USER));
//    }
//
//    @Test
//    void autenticarUsuario_DeveRetornarUsuarioDTOComToken_SeCredenciaisValidas() {
//        Usuario usuario = new Usuario(1L, "Maria", "maria@email.com", "123", Set.of(Role.USER));
//        UsuarioLoginRequest login = new UsuarioLoginRequest("maria@email.com", "123");
//
//        when(usuarioRepository.findByEmail("maria@email.com")).thenReturn(Optional.of(usuario));
//        when(jwtService.generateToken(anyString(), anySet())).thenReturn("token123");
//
//        UsuarioResponse resultado = auth.autenticarUsuario(login);
//
//        assertNotNull(resultado);
//        assertEquals("Maria", resultado.nome());
//        assertEquals("Bearer token123", resultado.token());
//    }
//}
