//package com.projetointegrador.diarioclasse.controller;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.projetointegrador.diarioclasse.dto.response.UsuarioResponse;
//import com.projetointegrador.diarioclasse.dto.request.UsuarioLoginRequest;
//import com.projetointegrador.diarioclasse.enums.Role;
//import com.projetointegrador.diarioclasse.entity.Usuario;
//import com.projetointegrador.diarioclasse.repository.UsuarioRepository;
//import jakarta.transaction.Transactional;
//import org.junit.jupiter.api.BeforeAll;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.TestInstance;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.http.MediaType;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.MvcResult;
//
//import java.util.Set;
//
//import static org.junit.jupiter.api.Assertions.assertNotNull;
//import static org.junit.jupiter.api.Assertions.assertTrue;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@SpringBootTest
//@AutoConfigureMockMvc
//@TestInstance(TestInstance.Lifecycle.PER_CLASS)
//@Transactional
//public class UsuarioControllerIntegrationTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Autowired
//    private UsuarioRepository usuarioRepository;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    @Value("${admin.name}")
//    private String adminName;
//
//    @Value("${admin.email}")
//    private String adminEmail;
//
//    @Value("${admin.password}")
//    private String adminPassword;
//
//
//    private Usuario usuarioTeste;
//    private Usuario usuarioTesteComum;
//    private String tokenTeste;
//
//    @BeforeAll
//    void setup() throws Exception {
//        usuarioRepository.deleteAll();
//
//        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
//
//        usuarioTeste = new Usuario();
//        usuarioTeste.setNome(adminName);
//        usuarioTeste.setEmail(adminEmail); // Usar o email admin configurado
//        usuarioTeste.setSenha(encoder.encode(adminPassword)); // Senha do admin configurada
//        usuarioTeste.setRoles(Set.of(Role.ADMIN));  // Setar role ADMIN explicitamente
//        usuarioRepository.save(usuarioTeste);
//
//        usuarioTesteComum = new Usuario();
//        usuarioTesteComum.setNome("Novo Usuário");
//        usuarioTesteComum.setEmail("novo@exemplo.com"); // Usar o email admin configurado
//        usuarioTesteComum.setSenha(encoder.encode("senha123")); // Senha do admin configurada
//        usuarioTesteComum.setRoles(Set.of(Role.USER));  // Setar role ADMIN explicitamente
//        usuarioRepository.save(usuarioTesteComum);
//
//        // Login para obter token JWT para usuário ADMIN
//        String loginJson = objectMapper.writeValueAsString(
//                new UsuarioLoginRequest(adminEmail, adminPassword)
//        );
//
//        MvcResult result = mockMvc.perform(post("/usuarios/logar")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(loginJson))
//                .andExpect(status().isOk())
//                .andReturn();
//
//        String responseJson = result.getResponse().getContentAsString();
//        UsuarioResponse usuarioResponse = objectMapper.readValue(responseJson, UsuarioResponse.class);
//
//        tokenTeste = usuarioResponse.token().trim();
//
//        assertNotNull(tokenTeste);
//        System.out.println("Token recebido: [" + tokenTeste + "]");
//    }
//
//
//    @Test
//    void deveListarTodosUsuariosComTokenValido() throws Exception {
//        mockMvc.perform(get("/usuarios/all")
//                        .header("Authorization", tokenTeste))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$").isArray())
//                .andExpect(jsonPath("$[0].email").value(adminEmail));
//    }
//
//    @Test
//    void deveBuscarUsuarioPorId() throws Exception {
//        mockMvc.perform(get("/usuarios/{id}", usuarioTeste.getId())
//                        .header("Authorization", tokenTeste)) // não adiciona "Bearer " novamente
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.email").value(adminEmail));
//
//    }
//
//    @Test
//    void deveCadastrarNovoUsuario() throws Exception {
//        Usuario novoUsuario = new Usuario();
//        novoUsuario.setEmail("novoteste@exemplo.com");
//        novoUsuario.setSenha("senha123");
//        novoUsuario.setNome("Novo Usuário");
//
//        String json = objectMapper.writeValueAsString(novoUsuario);
//
//        mockMvc.perform(post("/usuarios/cadastrar")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(json)
//                        .header("Authorization", tokenTeste)) // se necessário
//                .andExpect(status().isCreated())
//                .andExpect(jsonPath("$.email").value("novoteste@exemplo.com"));
//    }
//
//    @Test
//    void deveDeletarUsuario() throws Exception {
//        mockMvc.perform(delete("/usuarios/{id}", usuarioTesteComum.getId())
//                        .header("Authorization", tokenTeste))
//                .andExpect(status().isNoContent());
//    }
//
//
//    @Test
//    void naoDeveDeletarUsuarioAdmin() throws Exception {
//        mockMvc.perform(delete("/usuarios/{id}", usuarioTeste.getId()) // id do admin
//                        .header("Authorization", tokenTeste))
//                .andExpect(status().isForbidden()); // ou is4xx dependendo do seu tratamento
//    }
//
//}
//
