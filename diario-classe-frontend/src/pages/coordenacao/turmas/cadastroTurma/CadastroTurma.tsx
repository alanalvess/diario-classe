import React, {type FormEvent, useEffect, useState} from "react";
import {Button, Card, Modal, ModalBody, ModalHeader, Spinner, TextInput} from "flowbite-react";

import type {Disciplina, Professor, Turma} from "../../../../models";
import {buscar, cadastrar} from "../../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../../utils/ToastAlerta.ts";
import {useAuth} from "../../../../contexts/UseAuth.ts";
import MultiSelectDropdown from "../../../../components/form/MultipleSelectDropdown.tsx";

interface CadastroTurmaProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

function CadastroTurma({
                             open,
                             onClose,
                             onSaved,
                           }: CadastroTurmaProps) {

  const {usuario, isAuthenticated, isHydrated} = useAuth();

  const [turmaCadastro, setTurmaCadastro] = useState<Turma>(
    {
      id: 0,
      nome: "",
      anoLetivo: "",
      mediaTurma: 0,
      frequenciaMedia: 0,
      professorIds: [],
      professorNomes: [],
      disciplinaIds: [],
      disciplinaNomes: [],
      alunoIds: [],
      alunoNomes: [],
    }
  )

  const [professores, setProfessores] = useState<Professor[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [professorIdsSelecionados, setProfessorIdsSelecionados] = useState<number[]>([]);
  const [disciplinaIdsSelecionadas, setDisciplinaIdsSelecionadas] = useState<number[]>([]);

  async function cadastrarNovaDisciplina(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const body = {
      ...turmaCadastro,
      professorIds: professorIdsSelecionados,
      disciplinaIds: disciplinaIdsSelecionadas,
    };

    try {
      await cadastrar(`/turmas`, body, setTurmaCadastro, {
        headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"},
      });

      ToastAlerta("Turma cadastrada com sucesso", Toast.Success);
      onSaved();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao cadastrar turma", Toast.Error);
      }
    } finally {
      setIsLoading(false);
    }

  }

  async function buscarProfessores() {
    setIsLoading(true);
    try {
      await buscar("/professores", setProfessores, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao carregar turmas", Toast.Error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function buscarDisciplinas() {
    setIsLoading(true);
    try {
      await buscar("/disciplinas", setDisciplinas, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao carregar turmas", Toast.Error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!isHydrated || !isAuthenticated) return;
    buscarProfessores();
    buscarDisciplinas()
  }, [isHydrated, isAuthenticated]);

  useEffect(() => {
    if (open) {
      setTurmaCadastro({
        id: 0,
        nome: "",
        anoLetivo: "",
        mediaTurma: 0,
        frequenciaMedia: 0,
        professorIds: [],
        professorNomes: [],
        disciplinaIds: [],
        disciplinaNomes: [],
        alunoIds: [],
        alunoNomes: [],
      });
      setProfessorIdsSelecionados([]);
      setDisciplinaIdsSelecionadas([]);
    }
  }, [open]);

  return (
    <>
      <Modal show={open} onClose={onClose} size="md" popup>
        <ModalHeader/>

        <ModalBody>
          <form className="flex flex-col gap-4" onSubmit={cadastrarNovaDisciplina}>
            <Card className="mb-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Cadastro de Turma
              </h2>
            </Card>

            <TextInput
              id="nome"
              name="nome"
              type="text"
              autoComplete="nome"
              placeholder="Nome"
              required
              value={turmaCadastro.nome}
              onChange={e => setTurmaCadastro({...turmaCadastro, nome: e.target.value})}

            />

            <TextInput
              id="anoLetivo"
              name="anoLetivo"
              type="text"
              autoComplete="anoLetivo"
              placeholder="Ano Letivo"
              required
              value={turmaCadastro.anoLetivo}
              onChange={e => setTurmaCadastro({...turmaCadastro, anoLetivo: e.target.value})}
            />

            <MultiSelectDropdown
              titulo="Professores"
              opcoes={professores}
              selecionados={professorIdsSelecionados}
              setSelecionados={setProfessorIdsSelecionados}
            />

            <MultiSelectDropdown
              titulo="Disciplinas"
              opcoes={disciplinas}
              selecionados={disciplinaIdsSelecionadas}
              setSelecionados={setDisciplinaIdsSelecionadas}
            />

            <Button color="green" type="submit" className='cursor-pointer mt-6 focus:outline-none focus:ring-0'>
              {isLoading ?
                <Spinner size="md" light/> :
                <span>Cadastrar</span>
              }
            </Button>
          </form>

        </ModalBody>
      </Modal>
    </>
  )
}

export default CadastroTurma;
