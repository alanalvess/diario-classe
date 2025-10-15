import React, {type ChangeEvent, useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "flowbite-react";

import {atualizarAtributo, buscar} from "../../../../services/Service";
import {Toast, ToastAlerta} from "../../../../utils/ToastAlerta";
import type {Disciplina, Professor, Turma} from "../../../../models"

import InputField from "../../../../components/form/InputField.tsx";
import {useAuth} from "../../../../contexts/UseAuth.ts";

interface EditarTurmaProps {
  open?: boolean;
  onClose?: () => void;
  onSaved?: () => void;
  turmaSelecionada?: Turma | null;
}

function EditarTurma({
                       open,
                       onClose,
                       onSaved,
                       turmaSelecionada
                     }: EditarTurmaProps) {

  const [turmaAtualizada, setTurmaAtualizada] = useState<Turma>(
    {} as Turma
  );
  const [isLoading, setIsLoading] = useState(false);
  const {usuario, handleLogout} = useAuth();

  const [professores, setProfessores] = useState<Professor[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);


  //
  async function editarTurma(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 🔹 Clona e filtra o objeto para enviar só o que tem valor
      const dadosFiltrados = Object.fromEntries(
        Object.entries(turmaAtualizada).filter(([key, value]) => {
          if (value === "" || value === null || value === undefined) return false;
          if (key === "id" || key === "token") return false; // não envia campos não editáveis
          return true;
        })
      );
      console.log("Payload enviado:", dadosFiltrados);

      await atualizarAtributo(
        `/turmas/${turmaSelecionada.id}`, dadosFiltrados, setTurmaAtualizada, {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
            "Content-Type": "application/json",
          }
        }
      );

      ToastAlerta("Turma atualizada com sucesso", Toast.Success);
      onSaved?.();
      onClose?.();
    } catch (error) {
      if (error.toString().includes("403")) {
        ToastAlerta("O token expirou, favor logar novamente", Toast.Info);
        handleLogout();
      } else {
        ToastAlerta("Erro ao atualizar a turma", Toast.Warning);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function atualizarEstado(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setTurmaAtualizada({
      ...turmaAtualizada,
      [e.target.name]: e.target.value,
    });
  }

  async function buscarProfessores() {
    try {
      await buscar("/professores", setProfessores, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
    } catch (error) {
      console.error("Erro ao buscar turmas", error);
    }
  }

  async function buscarDisciplinas() {
    try {
      await buscar("/disciplinas", setDisciplinas, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
    } catch (error) {
      console.error("Erro ao buscar turmas", error);
    }
  }

  useEffect(() => {
    if (open) {
      buscarProfessores();
    }
  }, [open]);

  useEffect(() => {

    if (open) {
      buscarDisciplinas();
    }
  }, [open]);

  useEffect(() => {
    if (turmaSelecionada) {
      setTurmaAtualizada({...turmaSelecionada});
    }
  }, [turmaSelecionada, open]);

  return (
    <>
      <Modal show={open} onClose={onClose} size="md" popup>
        <ModalHeader/>
        <ModalBody>
          <div className="justify-center">
            <div
              className="flex justify-center shadow-xl dark:shadow-lg shadow-cinza-300 dark:shadow-preto-600 bg-cinza-100 dark:bg-preto-300 py-[3vh] lg:py-[10vh] rounded-2xl font-bold">
              <form className="flex max-w-md flex-col gap-4 w-[80%]" onSubmit={editarTurma}>
                <h2 className="text-slate-900 dark:text-cinza-100 my-4 text-center text-2xl lg:text-4xl">
                  Editar Turma
                </h2>

                <InputField
                  label="Nome"
                  name="nome"
                  required
                  value={turmaAtualizada.nome || ""}
                  onChange={atualizarEstado}
                />

                <InputField
                  label="Ano Letivo"
                  name="anoLetivo"
                  required
                  value={turmaAtualizada.anoLetivo || ""}
                  onChange={atualizarEstado}
                />

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Disciplinas
                </label>
                <select
                  multiple
                  value={turmaAtualizada.disciplinaIds?.map(String) || []}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, opt => Number(opt.value));
                    setTurmaAtualizada({
                      ...turmaAtualizada,
                      disciplinaIds: values,
                    });
                  }}
                  className="border rounded p-2 w-full dark:bg-gray-800 dark:text-gray-100"
                >
                  {disciplinas.map(d => (
                    <option key={d.id} value={d.id}>{d.nome}</option>
                  ))}
                </select>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-4">
                  Professores
                </label>
                <select
                  multiple
                  value={turmaAtualizada.professorIds?.map(String) || []}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, opt => Number(opt.value));
                    setTurmaAtualizada({
                      ...turmaAtualizada,
                      professorIds: values,
                    });
                  }}
                  className="border rounded p-2 w-full dark:bg-gray-800 dark:text-gray-100"
                >
                  {professores.map(p => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>


                <Button type="submit">
                  {isLoading ? <Spinner aria-label="Carregando"/> : <span>Salvar Alterações</span>}
                </Button>
              </form>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default EditarTurma;

