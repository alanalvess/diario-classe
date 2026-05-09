package com.projetointegrador.diarioclasse.entity;

import com.projetointegrador.diarioclasse.enums.Role;
import com.projetointegrador.diarioclasse.enums.TipoAcesso;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tb_acessos")
public class Acesso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ID da pessoa (aluno, professor, etc.)
    @Column(nullable = false)
    private Long pessoaId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private LocalDateTime data;

    @Enumerated(EnumType.STRING)
    private TipoAcesso tipo;
}
