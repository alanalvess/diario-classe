import {type ChangeEvent, useEffect, useState} from "react";
import {Button, Card, Label, Modal, ModalBody, ModalHeader, Select, Spinner, TextInput} from "flowbite-react";

import {atualizarAtributo, buscar} from "../../../../services/Service";
import {Toast, ToastAlerta} from "../../../../utils/ToastAlerta";
import type {Aluno, Turma} from "../../../../models"

import {useAuth} from "../../../../contexts/UseAuth.ts";

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

            <TextInput
              placeholder="Nome"
              name="nome"
              required
              value={alunoAtualizado.nome || ""}
              onChange={atualizarEstado}
            />

            <TextInput
              placeholder="Matrícula"
              name="matricula"
              required
              value={alunoAtualizado.matricula || ""}
              onChange={atualizarEstado}
            />

            <TextInput
              placeholder="E-Mail"
              name="email"
              type="email"
              required
              value={alunoAtualizado.email || ""}
              onChange={atualizarEstado}
            />

            <div className="flex flex-col">
              <Label>Data de Nascimento</Label>
              <TextInput
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
            </div>

            <Select
              name="turmaId"
              value={alunoAtualizado.turmaId || ""}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setAlunoAtualizado({
                  ...alunoAtualizado,
                  turmaId: Number(e.target.value),
                })
              }
            >
              <option value="">Selecionar Turma</option>
              {turmas.map(t => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </Select>

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

