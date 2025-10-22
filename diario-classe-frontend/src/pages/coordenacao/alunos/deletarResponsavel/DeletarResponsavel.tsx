import {useState} from 'react'
import {Toast, ToastAlerta} from '../../../../utils/ToastAlerta'
import {deletar} from '../../../../services/Service'

import {Button, Card, Modal, ModalBody, ModalHeader, Spinner} from 'flowbite-react';
import DeleteImg from "../../../../assets/images/delete.png";
import type {Responsavel} from "../../../../models";
import {useAuth} from "../../../../contexts/UseAuth.ts";

interface DeletarResponsavelProps {
  isOpen: boolean;
  onClose: () => void;
  responsavelSelecionado: Responsavel;
  aoDeletar: (id: number) => void;
}

function DeletarResponsavel({isOpen, onClose, responsavelSelecionado, aoDeletar}: DeletarResponsavelProps) {
  const {usuario} = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  async function deletarResponsavel() {
    setIsLoading(true);
    try {
      await deletar(`/responsaveis/${responsavelSelecionado.id}`, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
      ToastAlerta('Responsavel excluido com sucesso', Toast.Success);
      aoDeletar(responsavelSelecionado.id);
      onClose();
    } catch (error) {
      if (error instanceof Error) return;
      ToastAlerta('Erro ao excluir responsável do aluno', Toast.Error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal show={isOpen} onClose={onClose} popup>
      <ModalHeader/>
      <ModalBody>
        <Card className="max-w-sm mx-auto lg:gap-10" imgSrc={DeleteImg} horizontal>
          <div className="text-center lg:text-left">
            <h5 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Excluir Responsável?
            </h5>

            <p className="font-normal text-gray-700 dark:text-gray-500">
              <p className="mb-4 text-lg italic text-gray-700 dark:text-gray-300">
                {responsavelSelecionado.nome}
              </p>
              <p className="mb-2">
                <span className="font-bold">Matrícula: </span>
                <span className="italic">{responsavelSelecionado.email}</span>
              </p>
              <p className="mb-2">
                <span className="font-bold">Turma: </span>
                <span className="italic">{responsavelSelecionado.telefone}</span>
              </p>
            </p>


            <div className="flex gap-2 mt-10 justify-center">
              <Button
                className="cursor-pointer text-white bg-gray-400 hover:bg-gray-600 w-24 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none focus:ring-0"
                onClick={onClose}
              >
                Não
              </Button>
              <Button
                className="cursor-pointer text-white bg-rose-600 hover:bg-rose-800 w-24 dark:bg-rose-600 dark:hover:bg-rose-700 focus:outline-none focus:ring-0"
                onClick={deletarResponsavel}
              >
                {isLoading ? <Spinner size="md" light/> : <span>Sim</span>}
              </Button>
            </div>
          </div>
        </Card>
      </ModalBody>
    </Modal>
  );
}

export default DeletarResponsavel;
