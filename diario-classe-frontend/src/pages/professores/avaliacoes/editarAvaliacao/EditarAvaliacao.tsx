import React, {type ChangeEvent, useEffect, useState} from "react";
import {Button, Card, Modal, ModalBody, ModalHeader, Select, Spinner} from "flowbite-react";

import {atualizarAtributo, buscar} from "../../../../services/Service";
import {Toast, ToastAlerta} from "../../../../utils/ToastAlerta";
import type {Avaliacao, Disciplina, Professor, Turma} from "../../../../models"

import InputField from "../../../../components/form/InputField.tsx";
import {useAuth} from "../../../../contexts/UseAuth.ts";
import SelectField from "../../../../components/form/SelectField.tsx";

interface EditarAvaliacaoProps {
  open?: boolean;
  onClose?: () => void;
  onSaved?: () => void;
  avaliacaoSelecionada?: Avaliacao | null;
}

function EditarAvaliacao({
                           open,
                           onClose,
                           onSaved,
                           avaliacaoSelecionada
                         }: EditarAvaliacaoProps) {

  const [avaliacaoAtualizada, setAvaliacaoAtualizada] = useState<Avaliacao>(
    {} as Avaliacao
  );
  const [isLoading, setIsLoading] = useState(false);
  const {usuario, handleLogout} = useAuth();

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);

  const [professor, setProfessor] = useState<Professor>();

  async function buscarProfessorPorEmail() {
    try {
      await buscar(`/professores/email/${usuario.email}`, setProfessor, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function buscarTurmasPorProfessor() {
    try {
      await buscar(`/turmas/professor/${professor.id}`, setTurmas,
        {headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"}}
      );
    } catch (error) {
      console.error("Erro ao carregar turmas do professor", error);
    }
  }

  useEffect(() => {
    if (avaliacaoAtualizada.turmaId) {
      buscar(`/disciplinas/turma/${avaliacaoAtualizada.turmaId}`, setDisciplinas, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
    } else {
      setDisciplinas([]);
    }
  }, [avaliacaoAtualizada.turmaId]);


  useEffect(() => {
    if (usuario?.email) {
      buscarProfessorPorEmail();
    }
  }, [usuario?.email]);

  useEffect(() => {
    if (professor?.id) {
      buscarTurmasPorProfessor();
    }
  }, [professor]);

  async function editarAvaliacao(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 🔹 Clona e filtra o objeto para enviar só o que tem valor
      const dadosFiltrados = Object.fromEntries(
        Object.entries(avaliacaoAtualizada).filter(([key, value]) => {
          if (value === "" || value === null || value === undefined) return false;
          if (key === "id" || key === "token") return false; // não envia campos não editáveis
          return true;
        })
      );

      await atualizarAtributo(
        `/avaliacoes/${avaliacaoSelecionada.id}`, dadosFiltrados, setAvaliacaoAtualizada, {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
            "Content-Type": "application/json",
          }
        }
      );

      ToastAlerta("Avaliação atualizada com sucesso", Toast.Success);
      onSaved?.();
      onClose?.();
    } catch (error) {
      if (error.toString().includes("403")) {
        ToastAlerta("O token expirou, favor logar novamente", Toast.Info);
        handleLogout();
      } else {
        ToastAlerta("Erro ao atualizar a avaliação", Toast.Warning);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function atualizarEstado(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setAvaliacaoAtualizada({
      ...avaliacaoAtualizada,
      [e.target.name]: e.target.value,
    });
  }

  useEffect(() => {
    if (avaliacaoSelecionada) {
      setAvaliacaoAtualizada({...avaliacaoSelecionada});
    }
  }, [avaliacaoSelecionada, open]);

  return (
    <>
      <Modal show={open} onClose={onClose} size="md" popup>
        <ModalHeader/>
        <ModalBody>
          <form className="flex flex-col gap-4" onSubmit={editarAvaliacao}>
            <Card className="mb-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Editar Avaliação
              </h2>
            </Card>


            <Select
              name="turmaId"
              value={avaliacaoAtualizada.turmaId || ""}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setAvaliacaoAtualizada({
                  ...avaliacaoAtualizada,
                  turmaId: Number(e.target.value),
                })
              }
            >
              <option value="">Selecione a Turma</option>
              {turmas.map(turma => (
                <option key={turma.id} value={turma.id}>
                  {turma.nome}
                </option>
              ))}
            </Select>

            <SelectField
              label="Disciplina"
              name="disciplinaId"
              value={avaliacaoAtualizada.disciplinaId || ""}
              options={disciplinas.map(disciplina => ({value: disciplina.id, label: disciplina.nome}))}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setAvaliacaoAtualizada({
                  ...avaliacaoAtualizada,
                  disciplinaId: Number(e.target.value),
                })
              }
            />

            <InputField
              label="Título"
              name="titulo"
              required
              value={avaliacaoAtualizada.titulo || ""}
              onChange={atualizarEstado}
            />

            <InputField
              label="Data de aplicação"
              name="data"
              type="date"
              required
              value={
                avaliacaoAtualizada.data
                  ? new Date(avaliacaoAtualizada.data).toISOString().split("T")[0]
                  : ""
              }
              onChange={atualizarEstado}
            />

            <InputField
              label="Peso"
              name="peso"
              required
              value={avaliacaoAtualizada.peso || ""}
              onChange={atualizarEstado}
            />

            <SelectField
              label="Bimestre"
              name="bimestre"
              value={avaliacaoAtualizada.bimestre || ""}
              options={[
                {label: "1º Bimestre", value: 1},
                {label: "2º Bimestre", value: 2},
                {label: "3º Bimestre", value: 3},
                {label: "4º Bimestre", value: 4},
              ]}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setAvaliacaoAtualizada({
                  ...avaliacaoAtualizada,
                  bimestre: Number(e.target.value),
                })
              }
            />

            <Button
              type="submit"
              color="green"
              className="cursor-pointer mt-4 flex items-center justify-center gap-2 focus:outline-none focus:ring-0"
            >
              {isLoading ? <Spinner aria-label="Carregando"/> : <span>Salvar Alterações</span>}
            </Button>
          </form>
        </ModalBody>
      </Modal>
    </>
  );
}

export default EditarAvaliacao;

