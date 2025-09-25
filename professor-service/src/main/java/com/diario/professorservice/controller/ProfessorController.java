package com.diario.professorservice.controller;

import com.diario.professorservice.dto.request.ProfessorRequest;
import com.diario.professorservice.dto.response.ProfessorResponse;
import com.diario.professorservice.service.ProfessorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/professores")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ProfessorController {

    private final ProfessorService professorService;

    public ProfessorController(ProfessorService professorService) {
        this.professorService = professorService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<ProfessorResponse>> listarTodos() {
        return ResponseEntity.status(HttpStatus.OK).body(professorService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfessorResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(professorService.buscarPorId(id));
    }

    @GetMapping("/buscar/{nome}")
    public ResponseEntity<ProfessorResponse> buscarPorNome(@PathVariable String nome) {
        return ResponseEntity.status(HttpStatus.OK).body(professorService.buscarPorNome(nome));
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<ProfessorResponse> cadastrar(@RequestBody @Valid ProfessorRequest dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(professorService.cadastrar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfessorResponse> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid ProfessorRequest request
    ) {
        request = new ProfessorRequest(
                id,
                request.nome(),
                request.disciplinas(),
                request.turmas()
        );

        ProfessorResponse response = professorService.atualizar(request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ProfessorResponse> atualizarAtributo(
            @PathVariable Long id,
            @RequestBody Map<String, Object> atributos
    ) {

        ProfessorResponse response = professorService.atualizarAtributo(
                id,
                atributos
        );
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        professorService.deletar(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
