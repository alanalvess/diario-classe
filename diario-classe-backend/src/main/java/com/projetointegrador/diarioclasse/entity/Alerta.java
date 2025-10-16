package com.projetointegrador.diarioclasse.entity;

import com.projetointegrador.diarioclasse.enums.StatusAlerta;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_alertas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alerta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "aluno_id")
    private Aluno aluno;

    private String titulo;
    private String descricao;

    private boolean riscoReprovacao;
    private boolean riscoEvasao;
    private double scoreRisco;

    private LocalDateTime dataGeracao;

    @Enumerated(EnumType.STRING)
    private StatusAlerta status;

    private String mensagemResumo;
}
