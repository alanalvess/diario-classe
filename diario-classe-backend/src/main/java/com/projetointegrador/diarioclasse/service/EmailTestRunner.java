package com.projetointegrador.diarioclasse.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;
//
//@Component
//public class EmailTestRunner implements CommandLineRunner {
//    @Autowired
//    private JavaMailSender mailSender;
//
//    @Override
//    public void run(String... args) {
//        try {
//            SimpleMailMessage message = new SimpleMailMessage();
//            message.setFrom("emailfrom@email.com");
//            message.setTo("emailto@email.com");
//            message.setSubject("Teste de envio de e-mail 📧");
//            message.setText("Se você recebeu esta mensagem, o Spring Boot está enviando e-mails corretamente!");
//            mailSender.send(message); System.out.println("✅ E-mail enviado com sucesso!");
//        } catch (Exception e) {
//            System.err.println("❌ Erro ao enviar e-mail: " + e.getMessage()); e.printStackTrace();
//        }
//    }
//}
