package com.projetointegrador.diarioclasse.service;

import com.projetointegrador.diarioclasse.entity.*;
import com.projetointegrador.diarioclasse.enums.StatusAlerta;
import com.projetointegrador.diarioclasse.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Comparator;
import java.util.List;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.IOException;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class RelatoriosService {

    private final AlunoRepository alunoRepository;
    private final AlertaRepository alertaRepository;
    private final ProfessorRepository professorRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final TurmaRepository turmaRepository;
    private final PresencaRepository presencaRepository;
    private final NotaRepository notaRepository;

    public byte[] gerarPdf(Long turmaId) {
        try {
            List<Aluno> lista =
                    alunoRepository.findByTurmaId(turmaId);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, outputStream);

            document.open();
            document.add(new Paragraph("Relatório de Alunos"));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);

            table.addCell(new PdfPCell(new Paragraph("Aluno")));
            table.addCell(new PdfPCell(new Paragraph("Turma")));

            for (Aluno ad : lista) {
                table.addCell(ad.getNome());
                table.addCell(ad.getTurma().getNome());
            }

            document.add(table);
            document.close();

            return outputStream.toByteArray();

        } catch (DocumentException e) {
            throw new RuntimeException("Erro ao gerar PDF", e);
        }
    }

    public byte[] gerarExcel(Long turmaId) throws IOException {
        List<Aluno> lista = alunoRepository.findByTurmaId(turmaId);

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Relatório");

        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Aluno");
        header.createCell(1).setCellValue("Turma");

        int rowNum = 1;
        for (Aluno ad : lista) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(ad.getNome());
            row.createCell(1).setCellValue(ad.getTurma().getNome());
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();

        return outputStream.toByteArray();
    }


    // ---------------- RISCO ACADÊMICO ----------------
    public byte[] gerarRelatorioRiscoPdf(Long turmaId) {
        try {
            List<Aluno> alunos = (turmaId != null) ? alunoRepository.findByTurmaId(turmaId) : alunoRepository.findAll();

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, outputStream);

            document.open();
            document.add(new Paragraph("Relatório de Risco Acadêmico"));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.addCell("Aluno");
            table.addCell("Turma");
            table.addCell("Risco Reprovação");
            table.addCell("Score");

            for (Aluno aluno : alunos) {
                // Busca alertas ativos do aluno
                List<Alerta> alertas = alertaRepository.findByAlunoIdAndStatus(aluno.getId(), StatusAlerta.ATIVO);

                // Pega o alerta mais recente pela data de geração
                Alerta alertaMaisRecente = alertas.stream()
                        .max(Comparator.comparing(Alerta::getDataGeracao))
                        .orElse(null);

                boolean riscoReprovacao = alertaMaisRecente != null && alertaMaisRecente.isRiscoReprovacao();
                double scoreRisco = alertaMaisRecente != null ? alertaMaisRecente.getScoreRisco() : 0.0;

                table.addCell(aluno.getNome());
                table.addCell(aluno.getTurma().getNome());
                table.addCell(riscoReprovacao ? "Sim" : "Não");
                table.addCell(String.format("%.2f", scoreRisco));
            }

            document.add(table);
            document.close();
            return outputStream.toByteArray();
        } catch (DocumentException e) {
            throw new RuntimeException("Erro ao gerar PDF de risco", e);
        }
    }

    public byte[] gerarRelatorioRiscoExcel(Long turmaId) throws IOException {
        List<Aluno> alunos = (turmaId != null) ? alunoRepository.findByTurmaId(turmaId) : alunoRepository.findAll();

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Risco Acadêmico");

        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Aluno");
        header.createCell(1).setCellValue("Turma");
        header.createCell(2).setCellValue("Risco Reprovação");
        header.createCell(3).setCellValue("Score");

        int rowNum = 1;
        for (Aluno aluno : alunos) {
            List<Alerta> alertas = alertaRepository.findByAlunoIdAndStatus(aluno.getId(), StatusAlerta.ATIVO);
            Alerta alertaMaisRecente = alertas.stream()
                    .max(Comparator.comparing(Alerta::getDataGeracao))
                    .orElse(null);

            boolean riscoReprovacao = alertaMaisRecente != null && alertaMaisRecente.isRiscoReprovacao();
            double scoreRisco = alertaMaisRecente != null ? alertaMaisRecente.getScoreRisco() : 0.0;

            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(aluno.getNome());
            row.createCell(1).setCellValue(aluno.getTurma() != null ? aluno.getTurma().getNome() : "-");
            row.createCell(2).setCellValue(riscoReprovacao ? "Sim" : "Não");
            row.createCell(3).setCellValue(scoreRisco);
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        return outputStream.toByteArray();
    }

    // ---------------- FREQUÊNCIA ----------------
    public byte[] gerarRelatorioFrequenciaExcel(Long turmaId) throws IOException {
        List<Aluno> alunos = (turmaId != null) ? alunoRepository.findByTurmaId(turmaId) : alunoRepository.findAll();

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Frequência");

        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Aluno");
        header.createCell(1).setCellValue("Turma");
        header.createCell(2).setCellValue("Presenças");
        header.createCell(3).setCellValue("Faltas");
        header.createCell(4).setCellValue("Percentual");

        int rowNum = 1;
        for (Aluno aluno : alunos) {
            long presencas = presencaRepository.countByAlunoIdAndPresenteTrue(aluno.getId());
            long faltas = presencaRepository.countByAlunoIdAndPresenteFalse(aluno.getId());
            double percentual = (presencas + faltas) > 0 ? ((double) presencas / (presencas + faltas)) * 100 : 0;

            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(aluno.getNome());
            row.createCell(1).setCellValue(aluno.getTurma() != null ? aluno.getTurma().getNome() : "-");
            row.createCell(2).setCellValue(presencas);
            row.createCell(3).setCellValue(faltas);
            row.createCell(4).setCellValue(percentual);
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        return outputStream.toByteArray();
    }

    public byte[] gerarRelatorioFrequenciaPdf(Long turmaId) {
        try {
            // Buscar alunos da turma ou todos
            List<Aluno> alunos = (turmaId != null)
                    ? alunoRepository.findByTurmaId(turmaId)
                    : alunoRepository.findAll();

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, outputStream);

            document.open();
            document.add(new Paragraph("Relatório de Frequência"));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(5); // 5 colunas
            table.setWidthPercentage(100);
            table.addCell("Aluno");
            table.addCell("Turma");
            table.addCell("Presenças");
            table.addCell("Faltas");
            table.addCell("Percentual");

            for (Aluno aluno : alunos) {
                table.addCell(aluno.getNome());
                table.addCell(aluno.getTurma().getNome());

                long presencas = presencaRepository.countByAlunoIdAndPresenteTrue(aluno.getId());
                long faltas = presencaRepository.countByAlunoIdAndPresenteFalse(aluno.getId());
                double percentual = (presencas + faltas) > 0 ? ((double) presencas / (presencas + faltas)) * 100 : 0;

                table.addCell(String.valueOf(presencas));
                table.addCell(String.valueOf(faltas));
                table.addCell(String.format("%.2f%%", percentual));
            }

            document.add(table);
            document.close();
            return outputStream.toByteArray();
        } catch (DocumentException e) {
            throw new RuntimeException("Erro ao gerar PDF de frequência", e);
        }
    }

    // ---------------- DESEMPENHO ----------------
    public byte[] gerarRelatorioDesempenhoExcel(Long turmaId) throws IOException {
        List<Turma> turmas = (turmaId != null) ? turmaRepository.findById(turmaId).map(List::of).orElse(List.of()) : turmaRepository.findAll();

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Desempenho");

        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Turma");
        header.createCell(1).setCellValue("Média Geral");
        header.createCell(2).setCellValue("Aprovados");
        header.createCell(3).setCellValue("Reprovados");

        int rowNum = 1;
        for (Turma turma : turmas) {
            List<Aluno> alunos = alunoRepository.findByTurmaId(turma.getId());

            List<Double> medias = alunos.stream()
                    .map(a -> notaRepository.mediaAluno(a.getId()))
                    .filter(Objects::nonNull) // ignora alunos sem média
                    .toList();

            double mediaGeral = medias.stream()
                    .mapToDouble(Double::doubleValue)
                    .average()
                    .orElse(0);

            long aprovados = medias.stream()
                    .filter(m -> m >= 7)
                    .count();

            long reprovados = alunos.size() - aprovados;

            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(turma.getNome());
            row.createCell(1).setCellValue(mediaGeral);
            row.createCell(2).setCellValue(aprovados);
            row.createCell(3).setCellValue(reprovados);
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        return outputStream.toByteArray();
    }

    public byte[] gerarRelatorioDesempenhoPdf(Long turmaId) {
        try {
            List<Turma> turmas = (turmaId != null)
                    ? turmaRepository.findById(turmaId).map(List::of).orElse(List.of())
                    : turmaRepository.findAll();

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, outputStream);

            document.open();
            document.add(new Paragraph("Relatório de Desempenho por Turma"));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.addCell("Turma");
            table.addCell("Média Geral");
            table.addCell("Aprovados");
            table.addCell("Reprovados");

            for (Turma turma : turmas) {
                List<Aluno> alunos = alunoRepository.findByTurmaId(turma.getId());

                List<Double> medias = alunos.stream()
                        .map(a -> notaRepository.mediaAluno(a.getId()))
                        .filter(Objects::nonNull)
                        .toList();

                double mediaGeral = medias.stream()
                        .mapToDouble(Double::doubleValue)
                        .average()
                        .orElse(0);

                long aprovados = medias.stream()
                        .filter(m -> m >= 7)
                        .count();

                long reprovados = alunos.size() - aprovados;

                table.addCell(turma.getNome());
                table.addCell(String.format("%.2f", mediaGeral));
                table.addCell(String.valueOf(aprovados));
                table.addCell(String.valueOf(reprovados));
            }

            document.add(table);
            document.close();
            return outputStream.toByteArray();

        } catch (DocumentException e) {
            throw new RuntimeException("Erro ao gerar PDF de desempenho", e);
        }
    }


    // ---------------- ALERTAS ----------------
    public byte[] gerarRelatorioAlertasPdf(Long turmaId) {
        try {
            List<Alerta> alertas = (turmaId != null)
                    ? alertaRepository.findByAlunoTurmaId(turmaId)
                    : alertaRepository.findAll();

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, outputStream);

            document.open();
            document.add(new Paragraph("Relatório de Alertas Acadêmicos"));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.addCell("Aluno");
            table.addCell("Risco Reprovação");
            table.addCell("Risco Evasão");
            table.addCell("Score");
            table.addCell("Status");

            for (Alerta alerta : alertas) {
                table.addCell(alerta.getAluno().getNome());
                table.addCell(alerta.isRiscoReprovacao() ? "Sim" : "Não");
                table.addCell(alerta.isRiscoEvasao() ? "Sim" : "Não");
                table.addCell(String.format("%.2f", alerta.getScoreRisco()));
                table.addCell(alerta.getStatus().name());
            }

            document.add(table);
            document.close();
            return outputStream.toByteArray();
        } catch (DocumentException e) {
            throw new RuntimeException("Erro ao gerar PDF de alertas", e);
        }
    }

    // ---------------- PROFESSORES ----------------
    public byte[] gerarRelatorioProfessoresPdf() {
        try {
            List<Professor> professores = professorRepository.findAll();

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, outputStream);

            document.open();
            document.add(new Paragraph("Relatório de Professores e Disciplinas"));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(3);
            table.setWidthPercentage(100);
            table.addCell("Professor");
            table.addCell("Disciplina");
            table.addCell("Turma");

            for (Professor prof : professores) {
                for (Disciplina d : prof.getDisciplinas()) {
                    if (d.getTurmas() != null && !d.getTurmas().isEmpty()) {
                        // Para cada turma da disciplina, adiciona uma linha
                        for (Turma t : d.getTurmas()) {
                            table.addCell(prof.getNome());
                            table.addCell(d.getNome());
                            table.addCell(t.getNome());
                        }
                    } else {
                        // Caso não tenha turma, adiciona apenas professor e disciplina
                        table.addCell(prof.getNome());
                        table.addCell(d.getNome());
                        table.addCell("-");
                    }
                }
            }

            document.add(table);
            document.close();
            return outputStream.toByteArray();
        } catch (DocumentException e) {
            throw new RuntimeException("Erro ao gerar PDF de professores", e);
        }
    }


    // ---------------- INDICADORES ----------------
    public byte[] gerarRelatorioIndicadoresExcel() throws IOException {
        List<Aluno> alunos = alunoRepository.findAll();

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Indicadores");

        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Alunos");
        header.createCell(1).setCellValue("Risco Reprovação");
        header.createCell(2).setCellValue("Risco Evasão");
        header.createCell(3).setCellValue("Média Geral");

        int rowNum = 1;
        for (Aluno aluno : alunos) {
            // Busca alertas ativos do aluno
            List<Alerta> alertas = alertaRepository.findByAlunoIdAndStatus(aluno.getId(), StatusAlerta.ATIVO);

            // Pega o alerta mais recente pela data de geração
            Alerta alertaMaisRecente = alertas.stream()
                    .max(Comparator.comparing(Alerta::getDataGeracao))
                    .orElse(null);

            boolean riscoReprovacao = alertaMaisRecente != null && alertaMaisRecente.isRiscoReprovacao();
            boolean riscoEvasao = alertaMaisRecente != null && alertaMaisRecente.isRiscoEvasao();

            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(aluno.getNome());
            row.createCell(1).setCellValue(riscoReprovacao ? "Sim" : "Não");
            row.createCell(2).setCellValue(riscoEvasao ? "Sim" : "Não");

            Double mediaAluno = notaRepository.mediaAluno(aluno.getId());
            row.createCell(3).setCellValue(mediaAluno != null ? mediaAluno : 0.0);
        }


        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        return outputStream.toByteArray();
    }

    public byte[] gerarRelatorioIndicadoresPdf() {
        try {
            List<Aluno> alunos = alunoRepository.findAll();

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, outputStream);

            document.open();
            document.add(new Paragraph("Indicadores Gerais"));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.addCell("Aluno");
            table.addCell("Risco Reprovação");
            table.addCell("Risco Evasão");
            table.addCell("Média Geral");

            for (Aluno aluno : alunos) {
                // Busca alertas ativos do aluno
                List<Alerta> alertas = alertaRepository.findByAlunoIdAndStatus(aluno.getId(), StatusAlerta.ATIVO);

                // Pega o alerta mais recente pela data de geração
                Alerta alertaMaisRecente = alertas.stream()
                        .max(Comparator.comparing(Alerta::getDataGeracao))
                        .orElse(null);
                boolean riscoReprovacao = alertaMaisRecente != null && alertaMaisRecente.isRiscoReprovacao();
                boolean riscoEvasao = alertaMaisRecente != null && alertaMaisRecente.isRiscoEvasao();
                table.addCell(aluno.getNome());
                table.addCell(riscoReprovacao ? "Sim" : "Não");
                table.addCell(riscoEvasao ? "Sim" : "Não");
                table.addCell(String.valueOf(notaRepository.mediaAluno(aluno.getId())));
            }

            document.add(table);
            document.close();
            return outputStream.toByteArray();
        } catch (DocumentException e) {
            throw new RuntimeException("Erro ao gerar PDF de indicadores", e);
        }
    }


}
