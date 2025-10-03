package com.projetointegrador.diarioclasse.controller;

import com.projetointegrador.diarioclasse.service.RelatoriosService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/relatorios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class RelatoriosController {

    private final RelatoriosService relatorioService;

    @GetMapping
    public ResponseEntity<byte[]> gerarRelatorio(
            @RequestParam String tipo, // "pdf" ou "xlsx"
            @RequestParam(required = false) Long turmaId,
            @RequestParam(required = false) Long disciplinaId
//            @RequestParam(required = false) Long professorId
    ) throws IOException {
        byte[] arquivo;

        if ("pdf".equalsIgnoreCase(tipo)) {
            arquivo = relatorioService.gerarPdf(turmaId, disciplinaId);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(arquivo);
        } else if ("xlsx".equalsIgnoreCase(tipo)) {
            arquivo = relatorioService.gerarExcel(turmaId, disciplinaId);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio.xlsx")
                    .contentType(MediaType.parseMediaType(
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(arquivo);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
}

