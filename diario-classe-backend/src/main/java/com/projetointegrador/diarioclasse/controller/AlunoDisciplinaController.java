package com.projetointegrador.diarioclasse.controller;

import com.projetointegrador.diarioclasse.dto.request.AlunoDisciplinaRequest;
import com.projetointegrador.diarioclasse.dto.request.patchrequest.AlunoDisciplinaPatchRequest;
import com.projetointegrador.diarioclasse.dto.response.AlunoDisciplinaResponse;
import com.projetointegrador.diarioclasse.service.AlunoDisciplinaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alunos-disciplinas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AlunoDisciplinaController {

    private final AlunoDisciplinaService alunoDisciplinaService;

    @PostMapping
    public ResponseEntity<AlunoDisciplinaResponse> matricular(@RequestBody AlunoDisciplinaRequest request) {
        return ResponseEntity.ok(alunoDisciplinaService.matricular(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlunoDisciplinaResponse> atualizarNotasEFrequencia(
            @PathVariable Long id,
            @RequestParam(required = false) Double nota,
            @RequestParam(required = false) Double frequencia,
            @RequestParam(required = false) String observacoes) {
        return ResponseEntity.ok(alunoDisciplinaService.atualizarNotasEFrequencia(id, nota, frequencia, observacoes));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<AlunoDisciplinaResponse> patch(
            @PathVariable Long id,
            @RequestBody AlunoDisciplinaPatchRequest request) {
        return ResponseEntity.ok(alunoDisciplinaService.patch(id, request));
    }


    @GetMapping("/aluno/{alunoId}")
    public ResponseEntity<List<AlunoDisciplinaResponse>> listarPorAluno(@PathVariable Long alunoId) {
        return ResponseEntity.ok(alunoDisciplinaService.listarPorAluno(alunoId));
    }

    @GetMapping("/disciplina/{disciplinaId}")
    public ResponseEntity<List<AlunoDisciplinaResponse>> listarPorDisciplina(@PathVariable Long disciplinaId) {
        return ResponseEntity.ok(alunoDisciplinaService.listarPorDisciplina(disciplinaId));
    }

    @GetMapping("/turma/{turmaId}")
    public ResponseEntity<List<AlunoDisciplinaResponse>> listarPorTurma(@PathVariable Long turmaId) {
        return ResponseEntity.ok(alunoDisciplinaService.listarPorTurma(turmaId));
    }

    @PostMapping("/matricular-multiplas")
    public ResponseEntity<List<AlunoDisciplinaResponse>> matricularMultiplas(@RequestBody List<AlunoDisciplinaRequest> requests) {
        return ResponseEntity.ok(alunoDisciplinaService.matricularMultiplas(requests));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        alunoDisciplinaService.deletar(id);
        return ResponseEntity.noContent().build();
    }


}
