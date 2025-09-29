package com.projetointegrador.diarioclasse.repository;

import com.projetointegrador.diarioclasse.entity.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {
    List<Avaliacao> findByTurmaId(Long turmaId);
    List<Avaliacao> findByDisciplinaId(Long disciplinaId);
}
