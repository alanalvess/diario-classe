package com.projetointegrador.diarioclasse.scheduler;

import com.projetointegrador.diarioclasse.dashboard.DashboardService;
import com.projetointegrador.diarioclasse.entity.Aluno;
import com.projetointegrador.diarioclasse.ml.AnaliseRiscoService;
import com.projetointegrador.diarioclasse.ml.Predicao;
import com.projetointegrador.diarioclasse.notification.NotificationService;
import com.projetointegrador.diarioclasse.repository.AlunoRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SchedulerService {

    private final AlunoRepository alunoRepository;
    private final AnaliseRiscoService analiseRiscoService;
    private final DashboardService dashboardService;
    private final NotificationService notificationService;

    public SchedulerService(AlunoRepository alunoRepository,
                            AnaliseRiscoService analiseRiscoService,
                            DashboardService dashboardService,
                            NotificationService notificationService) {
        this.alunoRepository = alunoRepository;
        this.analiseRiscoService = analiseRiscoService;
        this.dashboardService = dashboardService;
        this.notificationService = notificationService;
    }

    // Roda todo dia às 7:00 AM
    @Scheduled(cron = "0 0 7 * * *")
    public void processarDiario() {
        List<Aluno> alunos = alunoRepository.findAll();

        // 1️⃣ Atualizar dashboard
        double mediaTurma = dashboardService.calcularMediaTurma(alunos);
        double frequenciaMedia = dashboardService.calcularFrequenciaMedia(alunos);
        System.out.println("Dashboard atualizado: Média=" + mediaTurma + ", Frequência=" + frequenciaMedia);

        // 2️⃣ Analisar risco
        List<Predicao> predicoes = analiseRiscoService.analisarTurma(alunos);

        // 3️⃣ Enviar alertas
        notificationService.enviarAlertas(predicoes);
    }
}

