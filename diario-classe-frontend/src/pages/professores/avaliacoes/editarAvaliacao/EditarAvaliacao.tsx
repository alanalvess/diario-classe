import {type ChangeEvent, useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalHeader, Spinner} from "flowbite-react";

import {atualizarAtributo, buscar} from "../../../../services/Service";
import {Toast, ToastAlerta} from "../../../../utils/ToastAlerta";
import type {Avaliacao, Disciplina, Turma} from "../../../../models"

import InputField from "../../../../components/form/InputField.tsx";
import {useAuth} from "../../../../contexts/UseAuth.ts";
import SelectField from "../../../../components/form/SelectField.tsx";
import {CategoriaObservacao} from "../../../../enums/CategoriaObservacao.ts";
import TextAreaField from "../../../../components/form/TextInputField.tsx";

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

  useEffect(() => {
    if (open) {
      buscarTurmas();
      buscarDisciplinas();
    }
  }, [open]);


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
          <div className="justify-center">
            <div
              className="flex justify-center shadow-xl dark:shadow-lg shadow-cinza-300 dark:shadow-preto-600 bg-cinza-100 dark:bg-preto-300 py-[3vh] lg:py-[10vh] rounded-2xl font-bold">
              <form className="flex max-w-md flex-col gap-4 w-[80%]" onSubmit={editarAvaliacao}>
                <h2 className="text-slate-900 dark:text-cinza-100 my-4 text-center text-2xl lg:text-4xl">
                  Editar Avaliação
                </h2>

                <SelectField
                  label="Turma"
                  name="turmaId"
                  value={avaliacaoAtualizada.turmaId || ""}
                  options={turmas.map(turma => ({ value: turma.id, label: turma.nome }))}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setAvaliacaoAtualizada({
                      ...avaliacaoAtualizada,
                      turmaId: Number(e.target.value),
                    })
                  }
                />

                <SelectField
                  label="Disciplina"
                  name="disciplinaId"
                  value={avaliacaoAtualizada.disciplinaId || ""}
                  options={disciplinas.map(disciplina => ({ value: disciplina.id, label: disciplina.nome }))}
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

export default EditarAvaliacao;

