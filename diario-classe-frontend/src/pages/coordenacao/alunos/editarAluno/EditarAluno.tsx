import {type ChangeEvent, useEffect, useState} from "react";
import {Button, Card, Modal, ModalBody, ModalHeader, Spinner} from "flowbite-react";

import {atualizarAtributo, buscar} from "../../../../services/Service";
import {Toast, ToastAlerta} from "../../../../utils/ToastAlerta";
import type {Aluno, Turma} from "../../../../models"

import InputField from "../../../../components/form/InputField.tsx";
import {useAuth} from "../../../../contexts/UseAuth.ts";
import SelectField from "../../../../components/form/SelectField.tsx";

interface EditarAlunoProps {
  open?: boolean;
  onClose?: () => void;
  onSaved?: () => void;
  alunoSelecionado?: Aluno | null;
}

function EditarAluno({
                       open,
                       onClose,
                       onSaved,
                       alunoSelecionado
                     }: EditarAlunoProps) {

  const [alunoAtualizado, setAlunoAtualizado] = useState<Aluno>(
    {} as Aluno
  );
  const [isLoading, setIsLoading] = useState(false);
  const {usuario, handleLogout} = useAuth();

  const [turmas, setTurmas] = useState<Turma[]>([]);


  //
  async function editarAluno(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 🔹 Clona e filtra o objeto para enviar só o que tem valor
      const dadosFiltrados = Object.fromEntries(
        Object.entries(alunoAtualizado).filter(([key, value]) => {
          if (value === "" || value === null || value === undefined) return false;
          if (key === "id" || key === "token") return false; // não envia campos não editáveis
          return true;
        })
      );

      await atualizarAtributo(
        `/alunos/${alunoSelecionado.id}`, dadosFiltrados, setAlunoAtualizado, {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
            "Content-Type": "application/json",
          }
        }
      );

      ToastAlerta("Aluno atualizado com sucesso", Toast.Success);
      onSaved?.();
      onClose?.();
    } catch (error) {
      if (error.toString().includes("403")) {
        ToastAlerta("O token expirou, favor logar novamente", Toast.Info);
        handleLogout();
      } else {
        ToastAlerta("Erro ao atualizar o aluno", Toast.Warning);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function atualizarEstado(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setAlunoAtualizado({
      ...alunoAtualizado,
      [e.target.name]: e.target.value,
    });
  }

  async function buscarTurmas() {
    try {
      await buscar("/turmas", setTurmas, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
    } catch (error) {
      console.error("Erro ao buscar turmas", error);
    }
  }

  useEffect(() => {
    if (open) {
      buscarTurmas().then();
    }
  }, [open]);


  useEffect(() => {
    if (alunoSelecionado) {
      setAlunoAtualizado({...alunoSelecionado});
    }
  }, [alunoSelecionado, open]);

  return (
    <>
      <Modal show={open} onClose={onClose} size="md" popup>
        <ModalHeader/>
        <ModalBody>
          <form className="flex flex-col gap-4" onSubmit={editarAluno}>
            <Card className="mb-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Editar Aluno
              </h2>
            </Card>

            <InputField
              label="Nome"
              name="nome"
              required
              value={alunoAtualizado.nome || ""}
              onChange={atualizarEstado}
            />

            <InputField
              label="Matrícula"
              name="matricula"
              required
              value={alunoAtualizado.matricula || ""}
              onChange={atualizarEstado}
            />

            <InputField
              label="Data de Nascimento"
              name="dataNascimento"
              type="date"
              required
              value={
                alunoAtualizado.dataNascimento
                  ? new Date(alunoAtualizado.dataNascimento).toISOString().split("T")[0]
                  : ""
              }
              onChange={atualizarEstado}
            />

            <SelectField
              label="Turma"
              name="turmaId"
              value={alunoAtualizado.turmaId || ""}
              options={turmas.map(t => ({value: t.id, label: t.nome}))}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setAlunoAtualizado({
                  ...alunoAtualizado,
                  turmaId: Number(e.target.value),
                })
              }
            />

            <Button
              type="submit"
              color="green"
              className='cursor-pointer mt-6 focus:outline-none focus:ring-0'>
              {isLoading ? <Spinner size="md" light/> : <span>Salvar Alterações</span>}
            </Button>
          </form>
        </ModalBody>
      </Modal>
    </>
  );
}

export default EditarAluno;

