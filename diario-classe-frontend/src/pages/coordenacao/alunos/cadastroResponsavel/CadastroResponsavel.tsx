import React, {type FormEvent, useEffect, useState} from "react";
import {Button, Card, Modal, ModalBody, ModalHeader, Select, Spinner, TextInput} from "flowbite-react";

import type {Aluno, Responsavel} from "../../../../models";
import {cadastrar} from "../../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../../utils/ToastAlerta.ts";
import {useAuth} from "../../../../contexts/UseAuth.ts";

import type {Filiacao} from "../../../../enums/Filiacao.ts";
import {FiliacaoText} from "../../../../utils/FiliacaoText.ts";

interface CadastroResponsavelProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  alunoSelecionado: Aluno;
}

export default function CadastroResponsavel({open, onClose, onSaved, alunoSelecionado}: CadastroResponsavelProps) {
  const {usuario} = useAuth();

  const [responsavelCadastro, setResponsavelCadastro] = useState<Responsavel>({
    id: 0,
    nome: "",
    email: "",
    telefone: "",
    filiacao: "" as Filiacao,
    alunoIds: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  async function cadastrarNovoResponsavel(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await cadastrar(`/responsaveis/aluno/${alunoSelecionado.id}`, responsavelCadastro, () => {
      }, {
        headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"},
      });

      ToastAlerta("Responsável cadastrado com sucesso!", Toast.Success);
      onSaved();
      onClose();
    } catch {
      ToastAlerta("Erro ao cadastrar responsável", Toast.Error);
    } finally {
      setIsLoading(false);
    }
  }

  // Resetar o formulário ao abrir
  useEffect(() => {
    if (open) {
      setResponsavelCadastro({
        id: 0,
        nome: "",
        email: "",
        telefone: "",
        filiacao: "" as Filiacao,
        alunoIds: [],
      });
    }
  }, [open]);

  return (
    <Modal show={open} onClose={onClose} size="md" popup>
      <ModalHeader/>

      <ModalBody>
        <form className="flex flex-col gap-4" onSubmit={cadastrarNovoResponsavel}>
          <Card className="mb-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Adicionar Responsável
            </h2>
          </Card>
          <TextInput
            id="nome"
            name="nome"
            placeholder="Nome completo"
            required
            value={responsavelCadastro.nome}
            onChange={(e) => setResponsavelCadastro({...responsavelCadastro, nome: e.target.value})}
          />

          <TextInput
            id="email"
            name="email"
            type="email"
            placeholder="E-mail"
            required
            value={responsavelCadastro.email}
            onChange={(e) => setResponsavelCadastro({...responsavelCadastro, email: e.target.value})}
          />

          <TextInput
            id="telefone"
            name="telefone"
            placeholder="Telefone"
            required
            value={responsavelCadastro.telefone}
            onChange={(e) => setResponsavelCadastro({...responsavelCadastro, telefone: e.target.value})}
          />

          <Select
            id="filiacao"
            name="filiacao"
            required
            value={responsavelCadastro.filiacao}
            onChange={(e) => setResponsavelCadastro({...responsavelCadastro, filiacao: e.target.value as Filiacao})}
          >
            <option value="">Selecione a Filiação</option>

            {FiliacaoText.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>


          <Button
            type="submit"
            color="green"
            className="cursor-pointer mt-6 focus:outline-none focus:ring-0"
            disabled={isLoading}
          >
            {isLoading ? <Spinner size="md" light/> : "Salvar Responsável"}
          </Button>
        </form>
      </ModalBody>
    </Modal>
  );
}
