import React, {type ChangeEvent, useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "flowbite-react";

import {atualizarAtributo} from "../../../../services/Service";
import {Toast, ToastAlerta} from "../../../../utils/ToastAlerta";
import type {Disciplina} from "../../../../models"

import InputField from "../../../../components/form/InputField.tsx";
import {useAuth} from "../../../../contexts/UseAuth.ts";

interface EditarDisciplinaProps {
  open?: boolean;
  onClose?: () => void;
  onSaved?: () => void;
  disciplinaSelecionada?: Disciplina | null;
}

function EditarDisciplina({
                       open,
                       onClose,
                       onSaved,
                       disciplinaSelecionada
                     }: EditarDisciplinaProps) {

  const [disciplinaAtualizada, setDisciplinaAtualizada] = useState<Disciplina>(
    {} as Disciplina
  );
  const [isLoading, setIsLoading] = useState(false);
  const {usuario, handleLogout} = useAuth();

  async function editarDisciplina(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 🔹 Clona e filtra o objeto para enviar só o que tem valor
      const dadosFiltrados = Object.fromEntries(
        Object.entries(disciplinaAtualizada).filter(([key, value]) => {
          if (value === "" || value === null || value === undefined) return false;
          if (key === "id" || key === "token") return false; // não envia campos não editáveis
          return true;
        })
      );
      console.log("Payload enviado:", dadosFiltrados);

      await atualizarAtributo(
        `/disciplinas/${disciplinaSelecionada.id}`, dadosFiltrados, setDisciplinaAtualizada, {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
            "Content-Type": "application/json",
          }
        }
      );

      ToastAlerta("Disciplina atualizada com sucesso", Toast.Success);
      onSaved?.();
      onClose?.();
    } catch (error) {
      if (error.toString().includes("403")) {
        ToastAlerta("O token expirou, favor logar novamente", Toast.Info);
        handleLogout();
      } else {
        ToastAlerta("Erro ao atualizar a disciplina", Toast.Warning);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function atualizarEstado(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setDisciplinaAtualizada({
      ...disciplinaAtualizada,
      [e.target.name]: e.target.value,
    });
  }

  useEffect(() => {
    if (disciplinaSelecionada) {
      setDisciplinaAtualizada({...disciplinaSelecionada});
    }
  }, [disciplinaSelecionada, open]);

  return (
    <>
      <Modal show={open} onClose={onClose} size="md" popup>
        <ModalHeader/>
        <ModalBody>
          <div className="justify-center">
            <div
              className="flex justify-center shadow-xl dark:shadow-lg shadow-cinza-300 dark:shadow-preto-600 bg-cinza-100 dark:bg-preto-300 py-[3vh] lg:py-[10vh] rounded-2xl font-bold">
              <form className="flex max-w-md flex-col gap-4 w-[80%]" onSubmit={editarDisciplina}>
                <h2 className="text-slate-900 dark:text-cinza-100 my-4 text-center text-2xl lg:text-4xl">
                  Editar Disciplina
                </h2>

                <InputField
                  label="Nome da Disciplina"
                  name="nome"
                  required
                  value={disciplinaAtualizada.nome || ""}
                  onChange={atualizarEstado}
                />

                <InputField
                  label="Código da Disciplina"
                  name="codigo"
                  required
                  value={disciplinaAtualizada.codigo || ""}
                  onChange={atualizarEstado}
                />

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

export default EditarDisciplina;

