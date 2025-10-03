package com.projetointegrador.diarioclasse.service;

import com.projetointegrador.diarioclasse.entity.AlunoDisciplina;
import com.projetointegrador.diarioclasse.repository.AlunoDisciplinaRepository;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
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

@Service
public class RelatoriosService {

    private final AlunoDisciplinaRepository alunoDisciplinaRepository;

    public RelatoriosService(AlunoDisciplinaRepository repository) {
        this.alunoDisciplinaRepository = repository;
    }

    public byte[] gerarPdf(Long turmaId, Long disciplinaId) {
        try {
            List<AlunoDisciplina> lista =
                    alunoDisciplinaRepository.findByTurmaIdAndDisciplinaId(turmaId, disciplinaId);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, outputStream);

            document.open();
            document.add(new Paragraph("Relatório de Alunos"));
            document.add(new Paragraph(" ")); // espaço em branco

            // Criar tabela com 5 colunas
            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);

            // Cabeçalho
            table.addCell(new PdfPCell(new Paragraph("Aluno")));
            table.addCell(new PdfPCell(new Paragraph("Turma")));
            table.addCell(new PdfPCell(new Paragraph("Disciplina")));
            table.addCell(new PdfPCell(new Paragraph("Nota")));
            table.addCell(new PdfPCell(new Paragraph("Frequência")));

            // Linhas
            for (AlunoDisciplina ad : lista) {
                table.addCell(ad.getAluno().getNome());
                table.addCell(ad.getTurma().getNome());
                table.addCell(ad.getDisciplina().getNome());
                table.addCell(String.valueOf(ad.getNotaFinal()));
                table.addCell(String.valueOf(ad.getFrequencia()));
            }

            document.add(table);
            document.close();

            return outputStream.toByteArray();

        } catch (DocumentException e) {
            throw new RuntimeException("Erro ao gerar PDF", e);
        }
    }

    public byte[] gerarExcel(Long turmaId, Long disciplinaId) throws IOException {
        List<AlunoDisciplina> lista = alunoDisciplinaRepository.findByTurmaIdAndDisciplinaId(turmaId, disciplinaId);

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Relatório");

        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Aluno");
        header.createCell(1).setCellValue("Turma");
        header.createCell(2).setCellValue("Disciplina");
        header.createCell(3).setCellValue("Nota");
        header.createCell(4).setCellValue("Frequência");

        int rowNum = 1;
        for (AlunoDisciplina ad : lista) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(ad.getAluno().getNome());
            row.createCell(1).setCellValue(ad.getTurma().getNome());
            row.createCell(2).setCellValue(ad.getDisciplina().getNome());
            row.createCell(3).setCellValue(ad.getNotaFinal());
            row.createCell(4).setCellValue(ad.getFrequencia());
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();

        return outputStream.toByteArray();
    }

}
