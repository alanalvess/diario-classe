package com.projetointegrador.diarioclasse.repository;

import com.projetointegrador.diarioclasse.entity.Turma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TurmaRepository extends JpaRepository<Turma, Long> {
}
