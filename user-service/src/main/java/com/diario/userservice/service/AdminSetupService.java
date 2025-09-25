package com.diario.userservice.service;

import com.diario.userservice.entity.Usuario;
import com.diario.userservice.enums.Role;
import com.diario.userservice.repository.UsuarioRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class AdminSetupService {

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Value("${admin.name}")
    private String adminName;

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminSetupService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void criarAdminPadrao() {
        if (usuarioRepository.findByEmail(adminEmail).isEmpty()) {
            Usuario admin = Usuario.builder()
                    .nome(adminName)
                    .email(adminEmail)
                    .senha(passwordEncoder.encode(adminPassword))
                    .roles(Set.of(Role.ADMIN))
                    .build();
            usuarioRepository.save(admin);
            System.out.println("✅ Usuário ADMIN criado com sucesso!");
        }
    }
}
