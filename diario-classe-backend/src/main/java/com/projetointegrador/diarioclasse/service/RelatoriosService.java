package com.projetointegrador.diarioclasse.service;

import com.projetointegrador.diarioclasse.entity.Aluno;
import com.projetointegrador.diarioclasse.repository.AlunoRepository;
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

    private final AlunoRepository alunoRepository;

    public RelatoriosService(AlunoRepository repository) {
        this.alunoRepository = repository;
    }

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

}
