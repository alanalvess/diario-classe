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

//    @GetMapping
//    public ResponseEntity<byte[]> gerarRelatorio(
//            @RequestParam String tipo, // "pdf" ou "xlsx"
//            @RequestParam(required = false) Long turmaId
//    ) throws IOException {
//        byte[] arquivo;
//
//        if ("pdf".equalsIgnoreCase(tipo)) {
//            arquivo = relatorioService.gerarPdf(turmaId);
//            return ResponseEntity.ok()
//                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio.pdf")
//                    .contentType(MediaType.APPLICATION_PDF)
//                    .body(arquivo);
//        } else if ("xlsx".equalsIgnoreCase(tipo)) {
//            arquivo = relatorioService.gerarExcel(turmaId);
//            return ResponseEntity.ok()
//                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio.xlsx")
//                    .contentType(MediaType.parseMediaType(
//                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
//                    .body(arquivo);
//        } else {
//            return ResponseEntity.badRequest().build();
//        }
//    }

    @GetMapping
    public ResponseEntity<byte[]> gerarRelatorio(
            @RequestParam String relatorio, // risco, desempenho, alertas, etc.
            @RequestParam String tipo,      // pdf ou xlsx
            @RequestParam(required = false) Long turmaId
    ) throws IOException {
        byte[] arquivo;

        switch (relatorio.toLowerCase()) {
            case "risco":
                arquivo = "pdf".equalsIgnoreCase(tipo)
                        ? relatorioService.gerarRelatorioRiscoPdf(turmaId)
                        : relatorioService.gerarRelatorioRiscoExcel(turmaId);
                break;

            case "frequencia":
                arquivo = "pdf".equalsIgnoreCase(tipo)
                        ? relatorioService.gerarRelatorioFrequenciaPdf(turmaId)
                        : relatorioService.gerarRelatorioFrequenciaExcel(turmaId);
                break;

            case "alertas":
                arquivo = relatorioService.gerarRelatorioAlertasPdf(turmaId);
                tipo = "pdf";
                break;

            case "professores":
                arquivo = relatorioService.gerarRelatorioProfessoresPdf();
                tipo = "pdf";
                break;

            case "desempenho":
                arquivo =  "pdf".equalsIgnoreCase(tipo)
                        ? relatorioService.gerarRelatorioDesempenhoPdf(turmaId)
                        : relatorioService.gerarRelatorioDesempenhoExcel(turmaId);
                break;

            case "indicadores":
                arquivo = "pdf".equalsIgnoreCase(tipo)
                        ? relatorioService.gerarRelatorioIndicadoresPdf()
                        : relatorioService.gerarRelatorioIndicadoresExcel();
                break;

            default:
                return ResponseEntity.badRequest().build();
        }

        String contentType = "pdf".equalsIgnoreCase(tipo)
                ? MediaType.APPLICATION_PDF_VALUE
                : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

        String filename = String.format("relatorio-%s.%s", relatorio, tipo);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType(contentType))
                .body(arquivo);
    }

}

