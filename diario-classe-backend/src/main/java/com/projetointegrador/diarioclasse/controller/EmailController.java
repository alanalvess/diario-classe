package com.projetointegrador.diarioclasse.controller;

import com.projetointegrador.diarioclasse.notification.EmailService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/emails")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/simple")
    public String sendSimpleEmail(@RequestParam String to,
                                  @RequestParam String subject,
                                  @RequestParam String text) throws MessagingException {
        emailService.sendSimpleMail(to, subject, text);
        return "✅ E-mail simples enviado!";
    }

    @PostMapping("/html")
    public String sendHtmlEmail(@RequestParam String to,
                                @RequestParam String subject) throws MessagingException {
        String html = """
                <h1 style='color:blue'>Relatório Diário</h1>
                <p>Notas: <b>8.7</b><br>
                Presença: <b>95%</b></p>
                """;

        emailService.sendHtmlMail(to, subject, html);
        return "✅ E-mail HTML enviado!";
    }

    @PostMapping("/with-attachment")
    public String sendEmailWithAttachment(@RequestParam String to,
                                          @RequestParam String subject,
                                          @RequestParam String filePath) throws MessagingException {
        String html = "<p>Segue em anexo o relatório solicitado.</p>";

        emailService.sendMailWithAttachment(to, subject, html, filePath);
        return "✅ E-mail com anexo enviado!";
    }
}
