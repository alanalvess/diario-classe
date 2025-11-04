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
import type {Alerta} from "../../models/Alerta.ts";
import {useAuth} from "../../contexts/UseAuth.ts";
import type {Aluno, Responsavel} from "../../models";
import {buscar} from "../../services/Service.ts";
import {Roles} from "../../enums/Roles.ts";
import {Toast, ToastAlerta} from "../../utils/ToastAlerta.ts";
import {useNavigate} from "react-router-dom";

export default function AlertasPage() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {usuario, isAuthenticated, isHydrated} = useAuth();
  const navigate = useNavigate();

  const [responsavel, setResponsavel] = useState<Responsavel>();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState<string>("");

  async function buscarResponsavel() {
    if (!usuario?.email) return;
    setIsLoading(true);
    try {
      await buscar(`/responsaveis/email/${usuario.email}`, setResponsavel, {
        headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"},
      });
    } catch (error) {
      console.error("Erro ao buscar responsável:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function buscarAlunosDoResponsavel() {
    if (!responsavel?.id) return;
    setIsLoading(true);
    try {
      await buscar(`/responsaveis/${responsavel.id}/alunos`, setAlunos, {
        headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"},
      });
    } catch (error) {
      console.error("Erro ao buscar alunos do responsável:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function buscarAlertas() {
    if (!alunoSelecionado) return;
    setIsLoading(true);
    try {
      await buscar(`/alertas/aluno/${alunoSelecionado}`, setAlertas, {
        headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"},
      });
    } catch (error) {
      console.error("Erro ao buscar alertas:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!usuario?.email) return;
    buscarResponsavel();
  }, [usuario, isAuthenticated]);

  useEffect(() => {
    if (!responsavel?.id) return;
    buscarAlunosDoResponsavel();
  }, [responsavel, isAuthenticated]);

  useEffect(() => {
    if (!alunoSelecionado) return;
    buscarAlertas();
  }, [alunoSelecionado, isAuthenticated]);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated || !usuario?.roles.includes(Roles.RESPONSAVEL)) {
      ToastAlerta("Você precisa estar autenticado como responsável de um aluno.", Toast.Info);
      navigate("/login");
    }
  }, [isHydrated, isAuthenticated, usuario]);

  function corDoScore(score: number) {
    if (score < 0.3) return "text-green-600 font-semibold";
    if (score < 0.7) return "text-yellow-600 font-semibold";
    return "text-red-600 font-semibold";
  }

  return (
    <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10">
      {/* 🔹 Cabeçalho */}
      <Card className="mb-10 p-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Alertas Acadêmicos
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Veja os alertas emitidos automaticamente durante o período letivo.
        </p>
      </Card>

      <div className="flex flex-col md:flex-row gap-4 mt-8 mb-4 flex-grow w-full">
        <Select
          id="aluno"
          value={alunoSelecionado ?? ""}
          onChange={(e) => setAlunoSelecionado(e.target.value)}
          className="w-full"
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
          <span className="font-medium">Selecione os filtros:</span> escolha um aluno para visualizar os alertas
          emitidos.
        </Alert>
      ) : isLoading ? (
        <div className="flex justify-center mt-10">
          <Spinner size="xl"/>
        </div>
      ) : (
        alunoSelecionado && (
          <>
            <div className="w-full">
              <div
                className="hidden md:block overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <Table className="min-w-[700px] text-sm text-gray-700 dark:text-gray-300">
                  <TableHead className="bg-gray-100 dark:bg-gray-700">
                    <TableHeadCell className="text-center font-semibold">Aluno</TableHeadCell>
                    <TableHeadCell className="text-center font-semibold">Risco Reprovação</TableHeadCell>
                    <TableHeadCell className="text-center font-semibold">Risco Evasão</TableHeadCell>
                    <TableHeadCell className="text-center font-semibold">Score</TableHeadCell>
                    <TableHeadCell className="text-center font-semibold">Data</TableHeadCell>
                    <TableHeadCell className="text-center font-semibold">Status</TableHeadCell>
                  </TableHead>
                  <TableBody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {alertas.map((a) => (
                      <TableRow
                        key={a.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-150"
                      >
                        <TableCell className="text-center font-medium text-gray-900 dark:text-gray-100">{a.alunoNome}</TableCell>
                        <TableCell className="text-center">
                          <Badge color={a.riscoReprovacao ? "failure" : "success"}>
                            {a.riscoReprovacao ? "Sim" : "Não"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge color={a.riscoEvasao ? "failure" : "success"}>
                            {a.riscoEvasao ? "Sim" : "Não"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                      <span className={corDoScore(a.scoreRisco ?? 0)}>
                        {a.scoreRisco != null ? a.scoreRisco.toFixed(2) : "-"}
                      </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {new Date(a.dataGeracao).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className="text-center"
                            color={
                              a.status === "ATIVO"
                                ? "warning"
                                : a.status === "REVISADO"
                                  ? "info"
                                  : "success"
                            }
                          >
                            {a.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* 📱 Layout de Cards no Mobile */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {alertas.map((a) => (
                <div
                  key={a.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {a.alunoNome}
                    </h3>
                    <Badge
                      color={
                        a.status === "ATIVO"
                          ? "warning"
                          : a.status === "REVISADO"
                            ? "info"
                            : "success"
                      }
                    >
                      {a.status}
                    </Badge>
                  </div>

                  <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <p>
                      <span className="font-medium">📆 Data:</span>{" "}
                      {new Date(a.dataGeracao).toLocaleDateString("pt-BR")}
                    </p>
                    <p>
                      <span className="font-medium">Risco Reprovação:</span>{" "}
                      <Badge color={a.riscoReprovacao ? "failure" : "success"}>
                        {a.riscoReprovacao ? "Sim" : "Não"}
                      </Badge>
                    </p>
                    <p>
                      <span className="font-medium">Risco Evasão:</span>{" "}
                      <Badge color={a.riscoEvasao ? "failure" : "success"}>
                        {a.riscoEvasao ? "Sim" : "Não"}
                      </Badge>
                    </p>
                    <p>
                      <span className="font-medium">Score:</span>{" "}
                      <span className={corDoScore(a.scoreRisco ?? 0)}>
                      {a.scoreRisco?.toFixed(2) ?? "-"}
                    </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </>
        ))}
    </div>
  );

}
