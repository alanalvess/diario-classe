import React, {type FormEvent, useEffect, useState} from "react";
import {Button, Card, Modal, ModalBody, ModalHeader, Spinner, TextInput} from "flowbite-react";

import type {Disciplina} from "../../../../models";
import {cadastrar} from "../../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../../utils/ToastAlerta.ts";
import {useAuth} from "../../../../contexts/UseAuth.ts";

interface CadastroDisciplinaProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

function CadastroDisciplina({
                             open,
                             onClose,
                             onSaved,
                           }: CadastroDisciplinaProps) {

  const {usuario} = useAuth();

  const [disciplinaCadastro, setDisciplinaCadastro] = useState<Disciplina>(
    {
      id: 0,
      nome: "",
      codigo: "",
    }
  )

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function cadastrarNovaDisciplina(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await cadastrar(`/disciplinas`, disciplinaCadastro, setDisciplinaCadastro, {
        headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"},
      });

      ToastAlerta("Disciplina cadastrada com sucesso", Toast.Success);
      onSaved();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao cadastrar disciplina", Toast.Error);
      }
    } finally {
      setIsLoading(false);
    }

  }

  useEffect(() => {
    if (open) {
      setDisciplinaCadastro({
        id: 0,
        nome: "",
        codigo: "",
      });
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
                Cadastro de Disciplina
              </h2>
            </Card>

            <TextInput
              id="nome"
              name="nome"
              type="text"
              autoComplete="nome"
              placeholder="Nome"
              required
              value={disciplinaCadastro.nome}
              onChange={e => setDisciplinaCadastro({...disciplinaCadastro, nome: e.target.value})}

            />

            <TextInput
              id="codigo"
              name="codigo"
              type="text"
              autoComplete="codigo"
              placeholder="Código"
              required
              value={disciplinaCadastro.codigo}
              onChange={e => setDisciplinaCadastro({...disciplinaCadastro, codigo: e.target.value})}
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

export default CadastroDisciplina;
