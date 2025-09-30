package com.projetointegrador.diarioclasse.notification;

import com.projetointegrador.diarioclasse.entity.Responsavel;
import com.projetointegrador.diarioclasse.ml.Predicao;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final JavaMailSender mailSender;

    @Value("${coordenacao.email}")
    private String emailCoordenacao;

    public NotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void enviarAlertas(List<Predicao> predicoes) {
        // ---------- Coordenação: lista agregada ----------
        List<Predicao> reprovacao = predicoes.stream()
                .filter(Predicao::isRiscoReprovacao)
                .toList();
        List<Predicao> evasao = predicoes.stream()
                .filter(Predicao::isRiscoEvasao)
                .toList();

        String listaReprovacaoHtml = gerarListaHtml(reprovacao);
        String listaEvasaoHtml = gerarListaHtml(evasao);

        try {
            // E-mail único para coordenação com lista completa
            MimeMessage coordMessage = mailSender.createMimeMessage();
            MimeMessageHelper coordHelper = new MimeMessageHelper(coordMessage, true, "UTF-8");

            String assuntoCoord = "⚠️ ALERTA: Alunos em risco - Coordenação";
            String corpoCoord = String.format("""
                    <html>
                    <body>
                        <h2 style="color: red;">⚠️ Alerta de Risco Acadêmico - Coordenação</h2>
                        <h3>Risco de Reprovação:</h3>
                        <ul>%s</ul>
                        <h3>Risco de Evasão:</h3>
                        <ul>%s</ul>
                    </body>
                    </html>
                    """, listaReprovacaoHtml, listaEvasaoHtml);

            coordHelper.setTo(emailCoordenacao);
            coordHelper.setSubject(assuntoCoord);
            coordHelper.setText(corpoCoord, true);

            mailSender.send(coordMessage);
            System.out.println("📧 E-mail enviado para coordenação com lista completa.");

        } catch (MessagingException e) {
            System.err.println("❌ Erro ao enviar e-mail para coordenação: " + e.getMessage());
        }

        // ---------- Responsáveis: alertas individuais ----------
        for (Predicao p : predicoes) {
            if (p.isRiscoReprovacao() || p.isRiscoEvasao()) {
                if (p.getAluno().getResponsaveis() == null) continue;

                for (Responsavel r : p.getAluno().getResponsaveis()) {
                    if (r.getEmail() == null || r.getEmail().isBlank()) continue;

                    try {
                        MimeMessage mimeMessage = mailSender.createMimeMessage();
                        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

                        String assuntoResp = "⚠️ ALERTA: Risco identificado para " + p.getAluno().getNome();
                        String corpoResp = String.format("""
                                        <html>
                                        <body>
                                            <h2 style="color: red;">⚠️ Alerta de Risco Acadêmico</h2>
                                            <p><strong>Aluno:</strong> %s</p>
                                            <p><strong>Risco Reprovação:</strong> %s</p>
                                            <p><strong>Risco Evasão:</strong> %s</p>
                                            <p><strong>Score de Risco:</strong> %.2f</p>
                                        </body>
                                        </html>
                                        """,
                                p.getAluno().getNome(),
                                p.isRiscoReprovacao() ? "Sim" : "Não",
                                p.isRiscoEvasao() ? "Sim" : "Não",
                                p.getScoreRisco());

                        helper.setTo(r.getEmail());
                        // Coordenação em cópia oculta
                        helper.setBcc(emailCoordenacao);

                        helper.setSubject(assuntoResp);
                        helper.setText(corpoResp, true);

                        mailSender.send(mimeMessage);
                        System.out.println("📧 E-mail enviado para responsável: " + r.getEmail() + " (cópia para coordenação)");

                    } catch (MessagingException e) {
                        System.err.println("❌ Erro ao enviar e-mail para responsável: " + r.getEmail() + " | " + e.getMessage());
                    }
                }
            }
        }
    }

    /**
     * Gera lista em HTML (<ul><li>- Aluno</li></ul>)
     */
    private String gerarListaHtml(List<Predicao> predicoes) {
        return predicoes.stream()
                .map(p -> "<li>- " + p.getAluno().getNome() + "</li>")
                .reduce("", (acc, item) -> acc + item);
    }

}
