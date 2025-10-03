package com.projetointegrador.diarioclasse.controller;

import com.projetointegrador.diarioclasse.dto.PredicaoDTO;
import com.projetointegrador.diarioclasse.entity.Aluno;
import com.projetointegrador.diarioclasse.entity.Responsavel;
import com.projetointegrador.diarioclasse.ml.Predicao;
import com.projetointegrador.diarioclasse.notification.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notification")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class NotificationTestController {

    private final NotificationService notificationService;

    public NotificationTestController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    /**
     * Endpoint temporário para testar envio de alertas
     * POST /api/notification/test-alerts
     */
    @PostMapping("/test-alerts")
    public String testarAlertas(@RequestBody List<PredicaoDTO> predicoesDTO) {
        // Converter DTO para Predicao se necessário
        List<Predicao> predicoes = predicoesDTO.stream()
                .map(dto -> {
                    Aluno aluno = new Aluno();
                    aluno.setId(dto.alunoId());
                    aluno.setNome(dto.alunoNome());
                    aluno.setResponsaveis(dto.responsaveis().stream()
                            .map(r -> {
                                Responsavel resp = new Responsavel();
                                resp.setNome(r.nome());
                                resp.setEmail(r.email());
                                return resp;
                            }).collect(Collectors.toSet())
                    );

                    return new Predicao(
                            aluno,
                            dto.riscoReprovacao(),
                            dto.riscoEvasao(),
                            dto.scoreRisco()
                    );
                })
                .toList();

        notificationService.enviarAlertas(predicoes);
        return "✅ Alertas processados e enviados!";
    }

}


