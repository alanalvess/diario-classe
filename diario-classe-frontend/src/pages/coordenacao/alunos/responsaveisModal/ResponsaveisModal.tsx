import {useEffect, useState} from "react";
import {
  Button,
  Card,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow
} from "flowbite-react";
import {FaEdit, FaPlus, FaTrashAlt} from "react-icons/fa";
import {buscar} from "../../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../../utils/ToastAlerta.ts";
import {useAuth} from "../../../../contexts/UseAuth.ts";
import type {Aluno, Responsavel} from "../../../../models";
import CadastroResponsavel from "../cadastroResponsavel/CadastroResponsavel.tsx";
import EditarResponsavel from "../editarResponsavel/EditarResponsavel.tsx";
import DeletarResponsavel from "../deletarResponsavel/DeletarResponsavel.tsx";
import {FiliacaoText} from "../../../../utils/FiliacaoText.ts";

interface ResponsaveisModalProps {
  open: boolean;
  onClose: () => void;
  alunoSelecionado?: Aluno | null;
}

export default function ResponsaveisModal({open, onClose, alunoSelecionado}: ResponsaveisModalProps) {
  const {usuario} = useAuth();
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [responsavelSelecionado, setResponsavelSelecionado] = useState<Responsavel | null>(null);
  const [modalEditarResponsavel, setModalEditarResponsavel] = useState(false);

  const [modalCadastroResponsavel, setModalCadastroResponsavel] = useState(false);
  const [modalExclusaoResponsavel, setModalExclusaoResponsavel] = useState(false);

  // 🔹 Buscar responsáveis do aluno
  async function listarResponsaveis() {
    try {
      setIsLoading(true);
      await buscar(`/alunos/${alunoSelecionado.id}/responsaveis`, setResponsaveis, {
        headers: {authorization: `Bearer ${usuario.token}`},
      });
    } catch {
      ToastAlerta("Erro ao carregar responsáveis", Toast.Error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (open && alunoSelecionado) listarResponsaveis();
  }, [open, alunoSelecionado]);

  return (
    <>
      <Modal show={open} onClose={onClose} size="5xl" popup>
        <ModalHeader/>
        <ModalBody>
          <Card className="mb-10 p-4 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
            <h2 className="text-xl text-gray-900 dark:text-gray-100">
              Responsáveis do(a){" "}
              <span className="font-bold text-green-600">{alunoSelecionado.nome}</span>
            </h2>

            <Button
              color="alternative"
              className="cursor-pointer mt-4 flex items-center justify-center gap-2 px-6 py-3 rounded-lg shadow hover:shadow-md transition duration-200 focus:outline-none focus:ring-0"
              onClick={() => setModalCadastroResponsavel(true)}
            >
              <FaPlus className="text-lg"/> Adicionar Responsável
            </Button>
          </Card>

          {isLoading ? (
            <div className="flex justify-center py-6">
              <Spinner size="lg" color="purple"/>
            </div>
          ) : (
            <div className="w-full">
              <div
                className="hidden md:block overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">

                <Table className="min-w-[700px] text-sm text-gray-700 dark:text-gray-300">
                  <TableHead className="bg-gray-100 dark:bg-gray-700">
                    <TableRow>
                      <TableHeadCell className="text-center font-semibold">Nome</TableHeadCell>
                      <TableHeadCell className="text-center font-semibold">E-mail</TableHeadCell>
                      <TableHeadCell className="text-center font-semibold">Telefone</TableHeadCell>
                      <TableHeadCell className="text-center font-semibold">Filiação</TableHeadCell>
                      <TableHeadCell className="text-center font-semibold">Ações</TableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {responsaveis.length > 0 ? (
                      responsaveis.map(r => (
                        <TableRow
                          key={r.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-150"
                        >
                          <TableCell
                            className="text-center font-medium text-gray-900 dark:text-gray-100">{r.nome}</TableCell>
                          <TableCell className="text-center">{r.email}</TableCell>
                          <TableCell className="text-center">{r.telefone}</TableCell>
                          <TableCell className="text-center">
                            {FiliacaoText.find(item => item.value === r.filiacao)?.label || r.filiacao}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center gap-2 flex-wrap">
                              <Button
                                className="cursor-pointer text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 focus:outline-none focus:ring-0"
                                color="alternative"
                                size="xs"
                                onClick={() => {
                                  setResponsavelSelecionado(r);
                                  setModalEditarResponsavel(true);
                                }}
                              >
                                <FaEdit size={18}/>
                              </Button>
                              <Button
                                className="cursor-pointer text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 focus:outline-none focus:ring-0"
                                color="alternative"
                                size="xs"
                                onClick={() => {
                                  setResponsavelSelecionado(r);
                                  setModalExclusaoResponsavel(true);
                                }}
                              >
                                <FaTrashAlt size={18}/>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500 py-4">
                          Nenhum responsável cadastrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>


              {/* 📱 Layout mobile */}
              <div className="md:hidden flex flex-col gap-4 mt-4">
                {responsaveis.length > 0 ? (
                  responsaveis.map((responsavel, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
                    >
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {responsavel.nome}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">E-mail:</span> {responsavel.email}
                      </p>

                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">Telefone:</span> {responsavel.telefone}
                      </p>

                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">Filiação: </span>
                        {FiliacaoText.find(item => item.value === responsavel.filiacao)?.label || responsavel.filiacao}

                      </p>

                      <div className="flex justify-around mt-3 border-t border-gray-200 dark:border-gray-600 pt-3">
                        <Button
                          className="cursor-pointer text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 focus:outline-none focus:ring-0"
                          color="alternative"
                          size="xs"
                          onClick={() => {
                            setResponsavelSelecionado(responsavel);
                            setModalEditarResponsavel(true);
                          }}
                        >
                          <FaEdit size={20}/>
                        </Button>
                        <Button
                          className="cursor-pointer text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 focus:outline-none focus:ring-0"
                          color="alternative"
                          size="xs"
                          onClick={() => {
                            setResponsavelSelecionado(responsavel);
                            setModalExclusaoResponsavel(true);
                          }}
                        >
                          <FaTrashAlt size={20}/>
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <Card>
                    <div className="text-center text-gray-500 py-4">
                      Nenhum responsável cadastrado.
                    </div>
                  </Card>
                )}
              </div>

            </div>

          )}
        </ModalBody>
      </Modal>

      {/* 🔹 Modal de cadastro separado */}
      <CadastroResponsavel
        open={modalCadastroResponsavel}
        onClose={() => setModalCadastroResponsavel(false)}
        onSaved={listarResponsaveis}
        alunoSelecionado={alunoSelecionado}
      />

      {responsavelSelecionado && (
        <EditarResponsavel
          open={modalEditarResponsavel}
          onClose={() => setModalEditarResponsavel(false)}
          onSaved={listarResponsaveis}
          responsavelSelecionado={responsavelSelecionado}
        />
      )}

      {responsavelSelecionado && (
        <DeletarResponsavel
          isOpen={modalExclusaoResponsavel}
          onClose={() => {
            setModalExclusaoResponsavel(false);
            setResponsavelSelecionado(null);
          }}
          responsavelSelecionado={responsavelSelecionado}
          aoDeletar={() => listarResponsaveis()}
        />
      )}
    </>
  );
}
