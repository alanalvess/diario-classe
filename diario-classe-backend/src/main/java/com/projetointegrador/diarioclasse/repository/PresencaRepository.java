package com.projetointegrador.diarioclasse.repository;

import com.projetointegrador.diarioclasse.entity.Presenca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PresencaRepository extends JpaRepository<Presenca, Long> {
    List<Presenca> findByAlunoId(Long alunoId);
    List<Presenca> findByTurmaId(Long turmaId);
    List<Presenca> findByAlunoIdAndTurmaId(Long alunoId, Long turmaId);
}
