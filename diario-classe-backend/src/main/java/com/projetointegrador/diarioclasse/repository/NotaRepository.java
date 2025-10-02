package com.projetointegrador.diarioclasse.repository;

import com.projetointegrador.diarioclasse.entity.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotaRepository extends JpaRepository<Nota, Long> {
    List<Nota> findByAlunoId(Long alunoId);
    List<Nota> findByDisciplinaId(Long disciplinaId);
    List<Nota> findByAvaliacaoId(Long avaliacaoId);
    List<Nota> findByAlunoIdAndDisciplinaId(Long alunoId, Long disciplinaId);

    Optional<Nota> findByAlunoIdAndDisciplinaIdAndAvaliacaoId(Long alunoId, Long disciplinaId, Long avaliacaoId);
}
