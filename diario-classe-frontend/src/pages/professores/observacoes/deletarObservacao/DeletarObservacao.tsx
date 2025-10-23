import {useState} from 'react'
import {Toast, ToastAlerta} from '../../../../utils/ToastAlerta'
import {deletar} from '../../../../services/Service'

import {Button, Card, Modal, ModalBody, ModalHeader, Spinner} from 'flowbite-react';
import DeleteImg from "../../../../assets/images/delete.png";
import type {Observacao} from "../../../../models";
import {useAuth} from "../../../../contexts/UseAuth.ts";

interface DeletarObservacaoProps {
  isOpen: boolean;
  onClose: () => void;
  observacaoSelecionada: Observacao;
  aoDeletar: (id: number) => void;
}

function DeletarObservacao({isOpen, onClose, observacaoSelecionada, aoDeletar}: DeletarObservacaoProps) {
  const {usuario} = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  async function excluirObservacao() {
    setIsLoading(true);
    try {
      await deletar(`/observacoes/${observacaoSelecionada.id}`, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
      ToastAlerta('Observação excluida com sucesso', Toast.Success);
      aoDeletar(observacaoSelecionada.id);
      onClose();
    } catch (error) {
      if (error instanceof Error) return;
      ToastAlerta('Erro ao deletar observação', Toast.Error);
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
              Excluir Observação?
            </h5>

            <p className="font-normal text-gray-700 dark:text-gray-500">
              <p className="mb-4 text-lg italic text-gray-700 dark:text-gray-300">
                {observacaoSelecionada.alunoNome}
              </p>
              <p className="mb-2">
                <span className="font-bold">Categoria: </span>
                <span className="italic">{observacaoSelecionada.categoria}</span>
              </p>
              <p className="mb-2">
                <span className="font-bold">Descrição: </span>
                <span className="italic">{observacaoSelecionada.descricao}</span>
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
                onClick={excluirObservacao}
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

export default DeletarObservacao;
