package com.projetointegrador.diarioclasse.repository;

import com.projetointegrador.diarioclasse.entity.Alerta;
import com.projetointegrador.diarioclasse.entity.Aluno;
import com.projetointegrador.diarioclasse.enums.StatusAlerta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface AlertaRepository extends JpaRepository<Alerta, Long> {

    List<Alerta> findByAlunoIdOrderByDataGeracaoDesc(Long alunoId);

    List<Alerta> findByStatus(StatusAlerta status);

    Collection<Alerta> findByAluno(Aluno aluno);

    List<Alerta> findByAlunoIdAndStatus(Long id, StatusAlerta statusAlerta);

    List<Alerta> findByAlunoTurmaId(Long turmaId);
}



