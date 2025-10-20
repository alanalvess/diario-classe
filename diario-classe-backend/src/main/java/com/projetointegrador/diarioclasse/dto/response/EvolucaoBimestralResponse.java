package com.projetointegrador.diarioclasse.dto.response;

import java.time.LocalDate;
import java.util.Map;

public record EvolucaoBimestralResponse(
        Integer bimestre,
        Map<String, Double> mediasPorDisciplina
) {}


