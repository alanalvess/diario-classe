import {type FormEvent, useEffect, useState} from "react";
import {Button, Card, Label, Modal, ModalBody, ModalHeader, Select, Spinner, TextInput} from "flowbite-react";

import type {Aluno, Turma} from "../../../../models";
import {buscar, cadastrar} from "../../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../../utils/ToastAlerta.ts";
import {useAuth} from "../../../../contexts/UseAuth.ts";

interface CadastroAlunoProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

function CadastroAluno({
                         open,
                         onClose,
                         onSaved,
                       }: CadastroAlunoProps) {

  const {usuario, isAuthenticated, isHydrated} = useAuth();

  const [alunoCadastro, setAlunoCadastro] = useState<Aluno>(
    {
      id: 0,
      nome: "",
      matricula: "",
      turmaId: 0,
      dataNascimento: ""
    }
  )

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function cadastrarNovoAluno(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await cadastrar(`/alunos`, alunoCadastro, setAlunoCadastro, {
        headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"},
      });

      ToastAlerta("Usuário cadastrado com sucesso", Toast.Success);
      onSaved();

      // 🔹 Fecha o modal
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

  useEffect(() => {
    if (!isHydrated || !isAuthenticated) return;
    buscarTurmas();
  }, [isHydrated, isAuthenticated]);

  useEffect(() => {
    if (open) {
      setAlunoCadastro({
        id: 0,
        nome: "",
        matricula: "",
        turmaId: 0,
        dataNascimento: "",
      });
    }
  }, [open]);

  return (
    <>
      <Modal show={open} onClose={onClose} size="md" popup>
        <ModalHeader/>

        <ModalBody>
          <form className="flex flex-col gap-4" onSubmit={cadastrarNovoAluno}>
            <Card className="mb-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Cadastro de Aluno
              </h2>
            </Card>

            <TextInput
              id="nome"
              name="nome"
              type="text"
              autoComplete="nome"
              placeholder="Nome"
              required
              value={alunoCadastro.nome}
              onChange={e => setAlunoCadastro({...alunoCadastro, nome: e.target.value})}

            />

            <TextInput
              id="matricula"
              name="matricula"
              type="matricula"
              autoComplete="matricula"
              placeholder="Matrícula"
              required
              value={alunoCadastro.matricula}
              onChange={e => setAlunoCadastro({...alunoCadastro, matricula: e.target.value})}
            />

            <div>
              <Label htmlFor="dataNascimento">Data de Nascimento</Label>
              <TextInput
                id="dataNascimento"
                name="dataNascimento"
                type="date"
                autoComplete="dataNascimento"
                placeholder="Data de Nascimento"
                required
                value={alunoCadastro.dataNascimento}
                onChange={e => setAlunoCadastro({...alunoCadastro, dataNascimento: e.target.value})}
              />
            </div>

            <Select
              name="turmaId"
              value={alunoCadastro.turmaId || ""}
              onChange={e => setAlunoCadastro({...alunoCadastro, turmaId: Number(e.target.value)})} required
            >
              <option value="">Selecione a turma</option>
              {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </Select>

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

export default CadastroAluno;
