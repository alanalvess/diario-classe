import React, {type FormEvent, useEffect, useState} from "react";
import {Button, Card, Modal, ModalBody, ModalHeader, Spinner, TextInput} from "flowbite-react";

import type {Disciplina, Professor, Turma} from "../../../../models";
import {buscar, cadastrar} from "../../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../../utils/ToastAlerta.ts";
import {useAuth} from "../../../../contexts/UseAuth.ts";
import MultiSelectDropdown from "../../../../components/form/MultipleSelectDropdown.tsx";

interface CadastroProfessorProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

function CadastroProfessor({
                             open,
                             onClose,
                             onSaved,
                           }: CadastroProfessorProps) {

  const {usuario, isAuthenticated, isHydrated} = useAuth();

  const [professorCadastro, setProfessorCadastro] = useState<Professor>(
    {
      id: 0,
      nome: "",
      email: "",
      disciplinaIds: [],
      turmaIds: []
    }
  )

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [disciplinaIdsSelecionadas, setDisciplinaIdsSelecionadas] = useState<number[]>([]);
  const [turmaIdsSelecionadas, setTurmaIdsSelecionadas] = useState<number[]>([]);

  async function cadastrarNovoProfessor(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const body = {
      ...professorCadastro,
      disciplinaIds: disciplinaIdsSelecionadas,
      turmaIds: turmaIdsSelecionadas,
    };

    try {
      await cadastrar(`/professores`, body, setProfessorCadastro, {
        headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"},
      });

      ToastAlerta("Usuário cadastrado com sucesso", Toast.Success);
      onSaved();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao cadastrar usuário", Toast.Error);
      }
    } finally {
      setIsLoading(false);
    }

  }

  async function buscarTurmas() {
    setIsLoading(true);
    try {
      await buscar("/turmas", setTurmas, {
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
    buscarDisciplinas()
    buscarTurmas();
  }, [isHydrated, isAuthenticated]);

  useEffect(() => {
    if (open) {
      setProfessorCadastro({
        id: 0,
        nome: "",
        email: "",
        disciplinaIds: [],
        turmaIds: []
      });
      setDisciplinaIdsSelecionadas([]); // também limpar o select
      setTurmaIdsSelecionadas([]);
    }
  }, [open]);

  return (
    <>
      <Modal show={open} onClose={onClose} size="md" popup>
        <ModalHeader/>

        <ModalBody>
          <form className="flex flex-col gap-4" onSubmit={cadastrarNovoProfessor}>
            <Card className="mb-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Cadastro de Professor
              </h2>
            </Card>

            <TextInput
              id="nome"
              name="nome"
              type="text"
              autoComplete="nome"
              placeholder="Nome"
              required
              value={professorCadastro.nome}
              onChange={e => setProfessorCadastro({...professorCadastro, nome: e.target.value})}

            />

            <TextInput
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="E-Mail"
              required
              value={professorCadastro.email}
              onChange={e => setProfessorCadastro({...professorCadastro, email: e.target.value})}
            />

            {/*<MultiSelectDropdown*/}
            {/*  titulo="Disciplinas *"*/}
            {/*  opcoes={disciplinas}*/}
            {/*  selecionados={disciplinaIdsSelecionadas}*/}
            {/*  setSelecionados={setDisciplinaIdsSelecionadas}*/}
            {/*/>*/}

            <MultiSelectDropdown
              titulo="Turmas (opcional)"
              opcoes={turmas}
              selecionados={turmaIdsSelecionadas}
              setSelecionados={setTurmaIdsSelecionadas}
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

export default CadastroProfessor;
