package com.projetointegrador.diarioclasse.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@SpringBootTest
public class EmailServiceTest {

    @Autowired
    private JavaMailSender mailSender;

    @Test
    void testEnviarEmailSimples() {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("destinatario@email.com");
        message.setSubject("📩 Teste de e-mail");
        message.setText("Olá! Este é um teste simples de envio de e-mail via Spring Boot.");

        mailSender.send(message);
        System.out.println("✅ E-mail simples enviado com sucesso!");
    }
}
