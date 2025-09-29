package com.projetointegrador.diarioclasse.repository;

import com.projetointegrador.diarioclasse.entity.AlunoDisciplina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlunoDisciplinaRepository extends JpaRepository<AlunoDisciplina, Long> {
    List<AlunoDisciplina> findByAlunoId(Long alunoId);
    List<AlunoDisciplina> findByDisciplinaId(Long disciplinaId);
    List<AlunoDisciplina> findByTurmaId(Long turmaId);
    Optional<AlunoDisciplina> findByAlunoIdAndDisciplinaIdAndTurmaId(Long alunoId, Long disciplinaId, Long turmaId);
}


