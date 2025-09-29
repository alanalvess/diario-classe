package com.projetointegrador.diarioclasse.repository;

import com.projetointegrador.diarioclasse.entity.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, Long> {
}
