import {type ChangeEvent, useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "flowbite-react";

import {atualizarAtributo, buscar} from "../../../../services/Service";
import {Toast, ToastAlerta} from "../../../../utils/ToastAlerta";
import type {Aluno, Disciplina, Observacao, Turma} from "../../../../models"

import InputField from "../../../../components/form/InputField.tsx";
import {useAuth} from "../../../../contexts/UseAuth.ts";
import SelectField from "../../../../components/form/SelectField.tsx";
import {CategoriaObservacao} from "../../../../enums/CategoriaObservacao.ts";
import TextAreaField from "../../../../components/form/TextInputField.tsx";

interface EditarObservacaoProps {
  open?: boolean;
  onClose?: () => void;
  onSaved?: () => void;
  observacaoSelecionada?: Observacao | null;
}

function EditarObservacao({
                         open,
                         onClose,
                         onSaved,
                         observacaoSelecionada
                       }: EditarObservacaoProps) {

  const [observacaoAtualizada, setObservacaoAtualizada] = useState<Observacao>(
    {} as Observacao
  );
  const [isLoading, setIsLoading] = useState(false);
  const {usuario, handleLogout} = useAuth();

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);

  async function editarObservacao(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 🔹 Clona e filtra o objeto para enviar só o que tem valor
      const dadosFiltrados = Object.fromEntries(
        Object.entries(observacaoAtualizada).filter(([key, value]) => {
          if (value === "" || value === null || value === undefined) return false;
          if (key === "id" || key === "token") return false; // não envia campos não editáveis
          return true;
        })
      );

      await atualizarAtributo(
        `/observacoes/${observacaoSelecionada.id}`, dadosFiltrados, setObservacaoAtualizada, {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
            "Content-Type": "application/json",
          }
        }
      );

      ToastAlerta("Observação atualizada com sucesso", Toast.Success);
      onSaved?.();
      onClose?.();
    } catch (error) {
      if (error.toString().includes("403")) {
        ToastAlerta("O token expirou, favor logar novamente", Toast.Info);
        handleLogout();
      } else {
        ToastAlerta("Erro ao atualizar a observação", Toast.Warning);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function atualizarEstado(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setObservacaoAtualizada({
      ...observacaoAtualizada,
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

  async function buscarDisciplinas() {
    try {
      await buscar("/disciplinas", setDisciplinas, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
    } catch (error) {
      console.error("Erro ao buscar disciplinas", error);
    }
  }

  async function buscarAlunos() {
    try {
      await buscar("/alunos", setAlunos, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
    } catch (error) {
      console.error("Erro ao buscar alunos", error);
    }
  }

  useEffect(() => {

    if (open) {
      buscarTurmas();
      buscarDisciplinas();
      buscarAlunos();
    }
  }, [open]);


  useEffect(() => {
    if (observacaoSelecionada) {
      setObservacaoAtualizada({...observacaoSelecionada});
    }
  }, [observacaoSelecionada, open]);

  return (
    <>
      <Modal show={open} onClose={onClose} size="md" popup>
        <ModalHeader/>
        <ModalBody>
          <div className="justify-center">
            <div
              className="flex justify-center shadow-xl dark:shadow-lg shadow-cinza-300 dark:shadow-preto-600 bg-cinza-100 dark:bg-preto-300 py-[3vh] lg:py-[10vh] rounded-2xl font-bold">
              <form className="flex max-w-md flex-col gap-4 w-[80%]" onSubmit={editarObservacao}>
                <h2 className="text-slate-900 dark:text-cinza-100 my-4 text-center text-2xl lg:text-4xl">
                  Editar Observação
                </h2>

                <SelectField
                  label="Turma"
                  name="turmaId"
                  value={observacaoAtualizada.turmaId || ""}
                  options={turmas.map(turma => ({ value: turma.id, label: turma.nome }))}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setObservacaoAtualizada({
                      ...observacaoAtualizada,
                      turmaId: Number(e.target.value),
                    })
                  }
                />

                <SelectField
                  label="Disciplina"
                  name="disciplinaId"
                  value={observacaoAtualizada.disciplinaId || ""}
                  options={disciplinas.map(disciplina => ({ value: disciplina.id, label: disciplina.nome }))}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setObservacaoAtualizada({
                      ...observacaoAtualizada,
                      disciplinaId: Number(e.target.value),
                    })
                  }
                />

                <SelectField
                  label="Aluno"
                  name="alunoId"
                  value={observacaoAtualizada.alunoId || ""}
                  options={alunos.map(aluno => ({ value: aluno.id, label: aluno.nome }))}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setObservacaoAtualizada({
                      ...observacaoAtualizada,
                      alunoId: Number(e.target.value),
                    })
                  }
                />

                <InputField
                  label="Data da Ocorrência"
                  name="data"
                  type="date"
                  required
                  value={
                    observacaoAtualizada.data
                      ? new Date(observacaoAtualizada.data).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={atualizarEstado}
                />

                <SelectField
                  label="Categoria"
                  name="categoria"
                  value={observacaoAtualizada.categoria || ""}
                  options={Object.values(CategoriaObservacao).map(categoriaObservacao => ({
                    value: categoriaObservacao,
                    label: categoriaObservacao
                  }))}
                  onChange={atualizarEstado} // ✅ Mais limpo
                />



                <TextAreaField
                  label="Descrição"
                  name="descricao"
                  required
                  value={observacaoAtualizada.descricao || ""}
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

export default EditarObservacao;

