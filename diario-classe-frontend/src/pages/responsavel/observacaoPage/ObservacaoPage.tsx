import React, {useEffect, useState} from "react";
import {
  Alert,
  Badge,
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
import {useAuth} from "../../../contexts/UseAuth.ts";
import {buscar} from "../../../services/Service.ts";
import type {Aluno, Observacao, Responsavel} from "../../../models";
import {CategoriasAgrupadas} from "../../../utils/CategoriasAgrupadas.ts";
import {FaBookOpen, FaCalendarAlt, FaUserTie} from "react-icons/fa";

export default function ObservacoesPage() {
  const {usuario, isAuthenticated} = useAuth();
  const [observacoes, setObservacoes] = useState<Observacao[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responsavel, setResponsavel] = useState<Responsavel>();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState<string>("");

  const categoriaCores: Record<string, "success" | "failure" | "info" | "secondary"> = {
    Acadêmicas: "info",
    Comportamentais: "failure",
    Socioemocionais: "success",
    Administrativas: "secondary",
  };

  async function buscarResponsavelPorEmail() {
    try {
      await buscar(`/responsaveis/email/${usuario.email}`, setResponsavel, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function buscarAlunosDoResponsavel() {
    try {
      await buscar(`/responsaveis/${responsavel.id}/alunos`, setAlunos, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function carregarObservacoes() {
    if (!alunoSelecionado) return;
    setIsLoading(true);

    try {
      await buscar(`/observacoes/aluno/${alunoSelecionado}`, setObservacoes, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
          "Content-Type": "application/json",
        }
      });
    } catch (error) {
      console.error("Erro ao carregar observações:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!usuario?.email) return;
    buscarResponsavelPorEmail();
  }, [usuario, isAuthenticated]);

  useEffect(() => {
    if (!responsavel?.email) return;
    buscarAlunosDoResponsavel();
  }, [responsavel, isAuthenticated]);

  useEffect(() => {
    carregarObservacoes();
  }, [alunoSelecionado, isAuthenticated]);

  return (
    <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10">
      <Card className="mb-10 p-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Observações sobre o Aluno
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Veja os registros feitos pelos professores ao longo do período letivo.
        </p>
      </Card>

      <div className="flex flex-col md:flex-row gap-4 flex-grow w-full">
        <Select
          id="aluno"
          value={alunoSelecionado ?? ""}
          onChange={(e) => setAlunoSelecionado(e.target.value)}
          className="w-full mb-4"
        >
          <option value="">Selecione...</option>
          {alunos.map((aluno: Aluno) => (
            <option key={aluno.id} value={aluno.id}>
              {aluno.nome}
            </option>
          ))}
        </Select>
      </div>

      {!alunoSelecionado ? (
        <Alert color="info" className="mt-10 text-center">
          <span className="font-medium">Selecione os filtros:</span> escolha um aluno para visualizar as anotações
          realizadas pelos professores.
        </Alert>
      ) : isLoading ? (
        <div className="flex justify-center mt-10">
          <Spinner size="xl" color="purple"/>
        </div>
      ) : (
        alunoSelecionado && (
          <>
            <div
              className=" overflow-x-auto rounded-lg">
              {observacoes.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-400 py-6">
                  Nenhuma observação registrada até o momento.
                </p>
              ) : (

                <div className="w-full">
                  {/* 💻 Versão Desktop */}
                  <div className="hidden md:block overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    {observacoes.length === 0 ? (
                      <p className="text-center text-gray-600 dark:text-gray-400 py-6">
                        Nenhuma observação registrada até o momento.
                      </p>
                    ) : (
                      <Table className="min-w-[700px] text-sm text-gray-700 dark:text-gray-300">
                        <TableHead className="bg-gray-100 dark:bg-gray-700">
                          <TableHeadCell className="font-semibold">Data</TableHeadCell>
                          <TableHeadCell className="font-semibold">Disciplina</TableHeadCell>
                          <TableHeadCell className="font-semibold">Professor</TableHeadCell>
                          <TableHeadCell className="font-semibold">Categoria</TableHeadCell>
                          <TableHeadCell className="font-semibold">Descrição</TableHeadCell>
                        </TableHead>
                        <TableBody className="divide-y divide-gray-200 dark:divide-gray-600">
                          {observacoes.map((obs) => (
                            <TableRow
                              key={obs.id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-150"
                            >
                              <TableCell>{new Date(obs.data).toLocaleDateString("pt-BR")}</TableCell>
                              <TableCell>{obs.disciplinaNome || "-"}</TableCell>
                              <TableCell>{obs.professorNome || "-"}</TableCell>
                              <TableCell>
                                {Object.entries(CategoriasAgrupadas).map(([grupo, categorias]) => {
                                  const categoria = categorias.find((cat) => cat.value === obs.categoria);
                                  return (
                                    categoria && (
                                      <Badge key={obs.id} color={categoriaCores[grupo]}>
                                        {categoria.label}
                                      </Badge>
                                    )
                                  );
                                })}
                              </TableCell>
                              <TableCell className="max-w-md">{obs.descricao}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>

                  {/* 📱 Versão Mobile */}
                  <div className="md:hidden flex flex-col gap-4 mt-4">
                    {observacoes.length === 0 ? (
                      <p className="text-center text-gray-600 dark:text-gray-400 py-6">
                        Nenhuma observação registrada até o momento.
                      </p>
                    ) : (
                      <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
                        {observacoes.map((obs) => (
                          <Card
                            key={obs.id}
                            className="p-5 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-2xl"
                          >
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex items-center gap-2">
                                <FaCalendarAlt className="text-blue-500" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {new Date(obs.data).toLocaleDateString("pt-BR")}
                                </span>
                              </div>
                              {Object.entries(CategoriasAgrupadas).map(([grupo, categorias]) => {
                                const categoria = categorias.find((cat) => cat.value === obs.categoria);
                                return (
                                  categoria && (
                                    <Badge
                                      key={obs.id}
                                      color={categoriaCores[grupo]}
                                      className="text-xs font-semibold px-2 py-1 rounded-md"
                                    >
                                      {categoria.label}
                                    </Badge>
                                  )
                                );
                              })}
                            </div>

                            <div className="py-2 border-t-2 border-gray-400">
                              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                <FaBookOpen className="text-blue-600" />
                                {obs.disciplinaNome || "Sem disciplina"}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                                <FaUserTie className="text-purple-500" />
                                {obs.professorNome || "Professor não informado"}
                              </p>
                            </div>

                            <p className="text-gray-700 dark:text-gray-200 text-sm border-t-2 border-gray-500 bg-gray-400 dark:bg-gray-700 p-2 rounded-xl leading-relaxed">
                              {obs.descricao}
                            </p>
                          </Card>
                        ))}
                      </div>

                    )}
                  </div>

                </div>
              )}
            </div>
          </>
        )
      )}

    </div>
  );
}
