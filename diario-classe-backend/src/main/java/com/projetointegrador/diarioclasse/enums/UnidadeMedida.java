package com.projetointegrador.diarioclasse.enums;

public enum UnidadeMedida {
    UNIDADE("un"),
    DUZIA("dz"),
    QUILOGRAMA("kg"),
    GRAMA("g"),
    MILIGRAMA("mg"),
    LITRO("l"),
    MILILITRO("ml"),
    PACOTE("pacote"),
    CAIXA("caixa"),
    FRASCO("frasco"),
    GARRAFA("garrafa"),
    LATA("lata"),
    SACHE("sachê"),
    ROLO("rolo"),
    PAR("par"),
    KIT("kit"),
    FARDO("fardo"),
    OUTROS("outros");

    private final String descricao;

    UnidadeMedida(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
