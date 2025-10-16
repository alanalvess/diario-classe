package com.projetointegrador.diarioclasse.notification;

import com.projetointegrador.diarioclasse.entity.Responsavel;
import com.projetointegrador.diarioclasse.ml.Predicao;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;

//@Service
//public class NotificationService {
//
//    private final JavaMailSender mailSender;
//
//    @Value("${coordenacao.email}")
//    private String emailCoordenacao;
//
//    public NotificationService(JavaMailSender mailSender) {
//        this.mailSender = mailSender;
//    }
//
//    public void enviarAlertas(List<Predicao> predicoes) {
//        // ---------- Coordenação: lista agregada ----------
//        List<Predicao> reprovacao = predicoes.stream()
//                .filter(Predicao::isRiscoReprovacao)
//                .toList();
//        List<Predicao> evasao = predicoes.stream()
//                .filter(Predicao::isRiscoEvasao)
//                .toList();
//
//        String listaReprovacaoHtml = gerarListaHtml(reprovacao);
//        String listaEvasaoHtml = gerarListaHtml(evasao);
//
//        try {
//            // E-mail único para coordenação com lista completa
//            MimeMessage coordMessage = mailSender.createMimeMessage();
//            MimeMessageHelper coordHelper = new MimeMessageHelper(coordMessage, true, "UTF-8");
//
//            String assuntoCoord = "⚠️ ALERTA: Alunos em risco - Coordenação";
//            String corpoCoord = String.format("""
//                    <html>
//                    <body>
//                        <h2 style="color: red;">⚠️ Alerta de Risco Acadêmico - Coordenação</h2>
//                        <h3>Risco de Reprovação:</h3>
//                        <ul>%s</ul>
//                        <h3>Risco de Evasão:</h3>
//                        <ul>%s</ul>
//                    </body>
//                    </html>
//                    """, listaReprovacaoHtml, listaEvasaoHtml);
//
//            coordHelper.setTo(emailCoordenacao);
//            coordHelper.setSubject(assuntoCoord);
//            coordHelper.setText(corpoCoord, true);
//
//            mailSender.send(coordMessage);
//            System.out.println("📧 E-mail enviado para coordenação com lista completa.");
//
//        } catch (MessagingException e) {
//            System.err.println("❌ Erro ao enviar e-mail para coordenação: " + e.getMessage());
//        }
//
//        // ---------- Responsáveis: alertas individuais ----------
//        for (Predicao p : predicoes) {
//            if (p.isRiscoReprovacao() || p.isRiscoEvasao()) {
//                if (p.getAluno().getResponsaveis() == null) continue;
//
//                for (Responsavel r : p.getAluno().getResponsaveis()) {
//                    if (r.getEmail() == null || r.getEmail().isBlank()) continue;
//
//                    try {
//                        MimeMessage mimeMessage = mailSender.createMimeMessage();
//                        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
//
//                        String assuntoResp = "⚠️ ALERTA: Risco identificado para " + p.getAluno().getNome();
//                        String corpoResp = String.format("""
//                                        <html>
//                                        <body>
//                                            <h2 style="color: red;">⚠️ Alerta de Risco Acadêmico</h2>
//                                            <p><strong>Aluno:</strong> %s</p>
//                                            <p><strong>Risco Reprovação:</strong> %s</p>
//                                            <p><strong>Risco Evasão:</strong> %s</p>
//                                            <p><strong>Score de Risco:</strong> %.2f</p>
//                                        </body>
//                                        </html>
//                                        """,
//                                p.getAluno().getNome(),
//                                p.isRiscoReprovacao() ? "Sim" : "Não",
//                                p.isRiscoEvasao() ? "Sim" : "Não",
//                                p.getScoreRisco());
//
//                        helper.setTo(r.getEmail());
//                        // Coordenação em cópia oculta
//                        helper.setBcc(emailCoordenacao);
//
//                        helper.setSubject(assuntoResp);
//                        helper.setText(corpoResp, true);
//
//                        mailSender.send(mimeMessage);
//                        System.out.println("📧 E-mail enviado para responsável: " + r.getEmail() + " (cópia para coordenação)");
//
//                    } catch (MessagingException e) {
//                        System.err.println("❌ Erro ao enviar e-mail para responsável: " + r.getEmail() + " | " + e.getMessage());
//                    }
//                }
//            }
//        }
//    }
//
//    /**
//     * Gera lista em HTML (<ul><li>- Aluno</li></ul>)
//     */
//    private String gerarListaHtml(List<Predicao> predicoes) {
//        return predicoes.stream()
//                .map(p -> "<li>- " + p.getAluno().getNome() + "</li>")
//                .reduce("", (acc, item) -> acc + item);
//    }
//
//}

@Service
public class NotificationService {

    private final JavaMailSender mailSender;

    @Value("${coordenacao.email}")
    private String emailCoordenacao;

    @Value("${escola.nome}")
    private String nomeEscola;

    @Value("${portal.url}")
    private String urlPortal;

    public NotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void enviarAlertas(List<Predicao> predicoes) {
        enviarEmailCoordenacao(predicoes);
        enviarEmailResponsaveis(predicoes);
    }

    // ---------------- E-mail para coordenação ----------------
    private void enviarEmailCoordenacao(List<Predicao> predicoes) {
        if (predicoes.isEmpty()) return;

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String assunto = "⚠️ ALERTA: Alunos em risco - Coordenação";
            String corpo = gerarCorpoCoordenacaoPremium(predicoes);

            helper.setTo(emailCoordenacao);
            helper.setSubject(assunto);
            helper.setText(corpo, true);

            mailSender.send(message);
            System.out.println("📧 E-mail premium enviado para coordenação.");
        } catch (MessagingException e) {
            System.err.println("❌ Erro ao enviar e-mail para coordenação: " + e.getMessage());
        }
    }

    private String gerarCorpoCoordenacaoPremium(List<Predicao> predicoes) {
        StringBuilder linhas = new StringBuilder();
        for (Predicao p : predicoes) {
            String cor;
            if (p.getScoreRisco() < 0.3) cor = "#28a745";
            else if (p.getScoreRisco() < 0.7) cor = "#ffc107";
            else cor = "#d9534f";

            linhas.append(String.format("""
                <tr>
                    <td>%s</td>
                    <td>%s</td>
                    <td>%s</td>
                    <td style="color:%s;font-weight:bold;">%.2f</td>
                    <td><a href="%s" style="text-decoration:none;color:#2c3e50;">Ver no portal</a></td>
                </tr>
            """, p.getAluno().getNome(),
                    p.isRiscoReprovacao() ? "Sim" : "Não",
                    p.isRiscoEvasao() ? "Sim" : "Não",
                    cor,
                    p.getScoreRisco(),
                    urlPortal));
        }

        return """
        <html>
        <head>
            <style>
                body { font-family: 'Arial', sans-serif; background-color: #f4f6f8; margin: 0; padding: 0; }
                .container { max-width: 800px; margin: auto; background-color: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #e0e0e0; }
                .header h1 { margin: 0; color: #2c3e50; }
                .intro { font-size: 14px; color: #555; line-height: 1.5; margin-top: 15px; }
                table { width: 100%%; border-collapse: collapse; margin-top: 15px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
                th { background-color: #2c3e50; color: white; }
                tr:nth-child(even) { background-color: #f9f9f9; }
                .footer { font-size: 12px; color: #888; text-align: center; margin-top: 25px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                
                    <h1>%s</h1>
                    <p>⚠️ Alerta de Risco Acadêmico - Coordenação</p>
                </div>
                <p class="intro">
                    Prezada coordenação,<br/>
                    Segue abaixo a lista de alunos com risco acadêmico. Acompanhar e providenciar suporte quando necessário.
                </p>
                <table>
                    <tr>
                        <th>Aluno</th>
                        <th>Risco Reprovação</th>
                        <th>Risco Evasão</th>
                        <th>Score</th>
                        <th>Ação</th>
                    </tr>
                    %s
                </table>
                <p class="footer">
                    E-mail automático do sistema acadêmico.<br/>
                    Para dúvidas, entre em contato com a secretaria da escola.
                </p>
            </div>
        </body>
        </html>
        """.formatted(nomeEscola, linhas.toString());
    }

    // ---------------- E-mail para responsáveis ----------------
    private void enviarEmailResponsaveis(List<Predicao> predicoes) {
        for (Predicao p : predicoes) {
            if (p.isRiscoReprovacao() || p.isRiscoEvasao()) {
                if (p.getAluno().getResponsaveis() == null) continue;

                for (Responsavel r : p.getAluno().getResponsaveis()) {
                    if (r.getEmail() == null || r.getEmail().isBlank()) continue;

                    try {
                        MimeMessage mimeMessage = mailSender.createMimeMessage();
                        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

                        String assunto = "⚠️ Alerta Acadêmico: " + p.getAluno().getNome();
                        String corpo = gerarCorpoResponsavelPremium(p, r);

                        helper.setTo(r.getEmail());
                        helper.setBcc(emailCoordenacao);
                        helper.setSubject(assunto);
                        helper.setText(corpo, true);

                        mailSender.send(mimeMessage);
                        System.out.println("📧 E-mail premium enviado para responsável: " + r.getEmail());

                    } catch (MessagingException e) {
                        System.err.println("❌ Erro ao enviar e-mail para responsável: " + r.getEmail() + " | " + e.getMessage());
                    }
                }
            }
        }
    }

    private String gerarCorpoResponsavelPremium(Predicao p, Responsavel r) {
        String saudacao;
        LocalTime agora = LocalTime.now();
        if (agora.isBefore(LocalTime.NOON)) saudacao = "Bom dia";
        else if (agora.isBefore(LocalTime.of(18, 0))) saudacao = "Boa tarde";
        else saudacao = "Boa noite";

        String cor;
        String nivel;
        if (p.getScoreRisco() < 0.3) { cor = "#28a745"; nivel = "Baixo risco ✅"; }
        else if (p.getScoreRisco() < 0.7) { cor = "#ffc107"; nivel = "Risco médio ⚠️"; }
        else { cor = "#d9534f"; nivel = "Alto risco ⚠️"; }

        return String.format("""
        <html>
        <head>
            <style>
                body { font-family: 'Arial', sans-serif; background-color: #f4f6f8; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: auto; background-color: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                .header { text-align: center; padding-bottom: 15px; border-bottom: 1px solid #e0e0e0; }
                .header h1 { margin: 0; color: #2c3e50; }
                .intro { font-size: 14px; color: #555; line-height: 1.5; margin-top: 15px; }
                .card { padding: 15px; border-radius: 5px; margin-top: 15px; background-color: #f9f9f9; border-left: 5px solid %s; }
                .label { font-weight: bold; }
                .btn { display: inline-block; padding: 10px 20px; margin-top: 10px; background-color: #2c3e50; color: #fff; text-decoration: none; border-radius: 5px; font-size: 14px; }
                .footer { font-size: 12px; color: #888; text-align: center; margin-top: 25px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>%s</h1>
                </div>
                <p class="intro">%s %s,</p>
                <p class="intro">
                    Identificamos que o(a) aluno(a) <strong>%s</strong> apresenta um nível de risco acadêmico: <strong>%s</strong>. 
                    Solicitamos acompanhamento próximo e apoio quando necessário.
                </p>
                <div class="card">
                    <p><span class="label">Risco de Reprovação:</span> %s</p>
                    <p><span class="label">Risco de Evasão:</span> %s</p>
                    <p><span class="label">Score de Risco:</span> <strong style="color:%s">%.2f</strong></p>
                    <a class="btn" href="%s">Ver no Portal do Aluno</a>
                </div>
                <p class="footer">
                    Atenciosamente,<br/>Equipe %s
                </p>
            </div>
        </body>
        </html>
        """,
                cor,
                nomeEscola,
                saudacao, r.getNome(),
                p.getAluno().getNome(),
                nivel,
                p.isRiscoReprovacao() ? "Sim" : "Não",
                p.isRiscoEvasao() ? "Sim" : "Não",
                cor,
                p.getScoreRisco(),
                urlPortal,
                nomeEscola
        );
    }
}
