import {type ChangeEvent, useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "flowbite-react";

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

      // if (Array.isArray(usuarioAtualizado.roles) && usuarioAtualizado.roles.length > 0) {
      //   dadosFiltrados.roles = usuarioAtualizado.roles;
      // }

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

  useEffect(() => {
    async function buscarTurmas() {
      try {
        await buscar("/turmas", setTurmas, {
          headers: { Authorization: `Bearer ${usuario.token}` },
        });
      } catch (error) {
        console.error("Erro ao buscar turmas", error);
      }
    }

    if (open) {
      buscarTurmas();
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
          <div className="justify-center">
            <div
              className="flex justify-center shadow-xl dark:shadow-lg shadow-cinza-300 dark:shadow-preto-600 bg-cinza-100 dark:bg-preto-300 py-[3vh] lg:py-[10vh] rounded-2xl font-bold">
              <form className="flex max-w-md flex-col gap-4 w-[80%]" onSubmit={editarAluno}>
                <h2 className="text-slate-900 dark:text-cinza-100 my-4 text-center text-2xl lg:text-4xl">
                  Editar Aluno
                </h2>

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
                  options={turmas.map(t => ({ value: t.id, label: t.nome }))}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setAlunoAtualizado({
                      ...alunoAtualizado,
                      turmaId: Number(e.target.value),
                    })
                  }
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

export default EditarAluno;

