import React, {useEffect, useState} from "react";
import {
  Alert,
  Button,
  Card,
  Select,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow
} from "flowbite-react";
import {buscar} from "../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import type {Aluno, Observacao, Professor, Turma} from "../../../models";
import {useAuth} from "../../../contexts/UseAuth.ts";
import EditarObservacao from "./editarObservacao/EditarObservacao.tsx";
import {FaEdit, FaPlus, FaTrashAlt} from "react-icons/fa";
import CadastroObservacao from "./cadastroObservacao/CadastroObservacao.tsx";
import DeletarObservacao from "./deletarObservacao/DeletarObservacao.tsx";
import {useNavigate} from "react-router-dom";
import {Roles} from "../../../enums/Roles.ts";

export default function RegistroObservacoesPage() {
  const {usuario, isHydrated, isAuthenticated} = useAuth();
  const navigate = useNavigate();

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [observacoes, setObservacoes] = useState<Observacao[]>([]);

  const [turmaSelecionada, setTurmaSelecionada] = useState<number | null>(null);
  const [alunoSelecionado, setAlunoSelecionado] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [modalCadastro, setModalCadastro] = useState(false);
  const [modalEditarObservacao, setModalEditarObservacao] = useState(false);
  const [modalExclusao, setModalExclusao] = useState(false);

  const [observacaoSelecionada, setObservacaoSelecionada] = useState<Observacao | null>(null);
  const [professor, setProfessor] = useState<Professor>();

  async function buscarProfessorPorEmail() {
    try {
      await buscar(`/professores/email/${usuario.email}`, setProfessor, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.log(err);
      ToastAlerta("Não há turmas cadastradas para este professor", Toast.Error)
    }
  }

  useEffect(() => {
    if (usuario?.email) {
      buscarProfessorPorEmail();
    }
  }, [usuario?.email]);


  async function buscarObservacoes() {
    try {
      await buscar("/observacoes", setObservacoes, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao carregar observações", Toast.Error);
      }
    }
  }

  async function buscarTurmasPorProfessor() {
    try {
      await buscar(`/turmas/professor/${professor.id}`, setTurmas,
        {headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"}}
      )
      ;
    } catch (error) {
      console.error("Erro ao carregar turmas do professor", error);
    }
  }

  useEffect(() => {
    if (usuario?.email) {
      buscarProfessorPorEmail();
    }
  }, [usuario?.email]);

  useEffect(() => {
    if (professor?.id) {
      buscarTurmasPorProfessor();
    }
  }, [professor]);

  useEffect(() => {
    if (!turmaSelecionada) return;
    buscar(`/alunos/turma/${turmaSelecionada}`, setAlunos, {
      headers: {Authorization: `Bearer ${usuario.token}`},
    });
  }, [turmaSelecionada, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const params = new URLSearchParams();

    if (turmaSelecionada) params.append("turmaId", turmaSelecionada.toString());
    if (alunoSelecionado) params.append("alunoId", alunoSelecionado.toString());

    const url = `/observacoes/obs${params.toString() ? `?${params.toString()}` : ""}`;

    buscar(url, setObservacoes, {
      headers: { Authorization: `Bearer ${usuario.token}` },
    });

  }, [turmaSelecionada, alunoSelecionado, isAuthenticated]);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated || !usuario?.roles.includes(Roles.PROFESSOR)) {
      ToastAlerta("Você precisa estar autenticado como Professor", Toast.Info);
      navigate("/login");
    }
  }, [isHydrated, isAuthenticated, usuario]);

  return (
    <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10">
      <Card className="mb-10 p-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Registro de Observações
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Gerencie todas as anotações realizadas durante o ano letivo.
        </p>

        <Button
          color="alternative"
          className="cursor-pointer mt-4 md:mt-0 flex items-center justify-center gap-2 px-6 py-3 rounded-lg shadow hover:shadow-md transition duration-200 focus:outline-none focus:ring-0"
          onClick={() => setModalCadastro(true)}
        >
          <FaPlus className="text-lg"/> Adicionar Observação
        </Button>
      </Card>

      {/* Filtros */}
      <div className="flex flex-row gap-4 mb-6">
        <Select
          value={turmaSelecionada ?? ""}
          className="flex-1 w-full"
          onChange={e => setTurmaSelecionada(Number(e.target.value))}>
          <option value="">Selecione a turma</option>
          {turmas.map(t => <option key={t.id} value={t.id}>{t.nome} ({t.anoLetivo})</option>)}
        </Select>

        <Select
          value={alunoSelecionado ?? ""}
          className="flex-1 w-full"
          onChange={e => setAlunoSelecionado(Number(e.target.value))}>
          <option value="">Selecione o aluno</option>
          {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
        </Select>
      </div>

      {!turmaSelecionada ? (
        <Alert color="info" className="mt-10 text-center">
          <span className="font-medium">Selecione os filtros:</span> escolha uma turma e/ou um aluno para visualizar as observações dos alunos.
        </Alert>
      ) : isLoading ? (
        <div className="flex justify-center mt-10">
          <Spinner size="xl" color="purple"/>
        </div>
      ) : (
        <div className="w-full">
          <div
            className="hidden md:block overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <Table className="min-w-[700px] text-sm text-gray-700 dark:text-gray-300">
              <TableHead className="bg-gray-100 dark:bg-gray-700">
                <TableHeadCell className="text-center font-semibold">Aluno</TableHeadCell>
                <TableHeadCell className="text-center font-semibold">Data</TableHeadCell>
                <TableHeadCell className="text-center font-semibold">Categoria</TableHeadCell>
                <TableHeadCell className="text-center font-semibold">Descrição</TableHeadCell>
                <TableHeadCell className="text-center font-semibold">Ações</TableHeadCell>
              </TableHead>

              <TableBody className="divide-y divide-gray-200 dark:divide-gray-600">
                {observacoes.length > 0 ? (
                  observacoes.map((obs, i) => (
                    <TableRow
                      key={i}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-150"
                    >
                      <TableCell
                        className="text-center font-medium text-gray-900 dark:text-gray-100">{alunos.find(a => a.id === obs.alunoId)?.nome || "—"}</TableCell>
                      <TableCell className="text-center">{obs.data}</TableCell>
                      <TableCell className="text-center">{obs.categoria}</TableCell>
                      <TableCell className="text-center">{obs.descricao}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2 flex-wrap">
                          <Button
                            className="cursor-pointer text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 focus:outline-none focus:ring-0"

                            color="alternative"
                            size="xs"
                            onClick={() => {
                              setObservacaoSelecionada(obs)
                              setModalEditarObservacao(true);
                            }}
                          >
                            <FaEdit size={18}/>
                          </Button>

                          <Button
                            className="cursor-pointer text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 focus:outline-none focus:ring-0"
                            color="alternative"
                            size="xs"
                            onClick={() => {
                              setObservacaoSelecionada(obs);
                              setModalExclusao(true);
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
                    <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                      Nenhuma observação cadastrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* 📱 Layout mobile */}
          <div className="md:hidden flex flex-col gap-4 mt-4">
            {observacoes.length > 0 ? (
              observacoes.map((observacao, i) => (
                <div
                  key={i}
                  className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {observacao.alunoNome}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Data da Ocorrência:</span>{" "}
                    {new Date(observacao.data).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Matrícula:</span> {observacao.categoria}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Turma:</span> {observacao.descricao}
                  </p>

                  <div className="flex justify-around mt-3 border-t border-gray-200 dark:border-gray-600 pt-3">


                    <Button
                      className="cursor-pointer text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 focus:outline-none focus:ring-0"
                      color="alternative"
                      size="xs"
                      onClick={() => {
                        setObservacaoSelecionada(observacao);
                        setModalEditarObservacao(true);
                      }}
                    >
                      <FaEdit size={20}/>
                    </Button>

                    <Button
                      className="cursor-pointer text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 focus:outline-none focus:ring-0"
                      color="alternative"
                      size="xs"
                      onClick={() => {
                        setObservacaoSelecionada(observacao);
                        setModalExclusao(true);
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

      <CadastroObservacao
        open={modalCadastro}
        onClose={() => {
          setModalCadastro(false)
          setObservacaoSelecionada(null)
        }}
        onSaved={buscarObservacoes}
      />

      {observacaoSelecionada && (
        <EditarObservacao
          open={modalEditarObservacao}
          onClose={() => setModalEditarObservacao(false)}
          onSaved={buscarObservacoes}
          observacaoSelecionada={observacaoSelecionada}
        />
      )}

      {observacaoSelecionada && (
        <DeletarObservacao
          isOpen={modalExclusao}
          onClose={() => {
            setModalExclusao(false);
            setObservacaoSelecionada(null);
          }}
          observacaoSelecionada={observacaoSelecionada}
          aoDeletar={() => buscarObservacoes()}
        />
      )}
    </div>
  );
}
