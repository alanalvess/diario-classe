import {useEffect, useState} from "react";
import {
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
import type {Alerta} from "../../../models/Alerta.ts";
import {useAuth} from "../../../contexts/UseAuth.ts";
import type {Aluno} from "../../../models";
import {atualizarAtributo, buscar} from "../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import {Roles} from "../../../enums/Roles.ts";
import {useNavigate} from "react-router-dom";

export default function AlertasCoordenadorPage() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {usuario, isAuthenticated, isHydrated} = useAuth();
  const navigate = useNavigate();

  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState<string>("");

  async function buscarAlunos() {
    setIsLoading(true);
    try {
      await buscar('/alunos', setAlunos, {
        headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"},
      });
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function buscarAlertas() {
    setIsLoading(true);
    try {
      if (alunoSelecionado) {
        await buscar(`/alertas/aluno/${alunoSelecionado}`, setAlertas, {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
            "Content-Type": "application/json",
          },
        });
      } else {
        await buscar(`/alertas`, setAlertas, {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Erro ao buscar alertas:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function atualizarStatus(id: number, novoStatus: string) {
    try {
      await atualizarAtributo(
        `/alertas/${id}/status?status=${novoStatus}`,
        {}, // não precisa enviar body
        (alertaAtualizado: Alerta) =>
          setAlertas(
            prev => prev.map(a => (a.id === id ? alertaAtualizado : a))
          ), {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      ToastAlerta(`✅ Alerta atualizado para ${novoStatus}`, Toast.Success);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      ToastAlerta("Erro ao atualizar status do alerta", Toast.Error);
    }
  }

  useEffect(() => {
    if (!isAuthenticated) return;
    buscarAlertas();
    buscarAlunos();
  }, [isAuthenticated, alunoSelecionado]);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated || !usuario?.roles.includes(Roles.COORDENADOR)) {
      ToastAlerta("Você precisa estar autenticado como Coordenador", Toast.Info);
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
      <Card className="mb-10 p-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Alertas Acadêmicos
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Veja os alertas de risco acadêmico emitidos ao longo do período letivo.
        </p>
      </Card>

      <div className="mt-8 flex justify-center">
        <Select
          name="aluno"
          required
          className="w-full"
          value={alunoSelecionado}
          onChange={(e) => setAlunoSelecionado(e.target.value)}
        >
          <option value="">Selecione o Aluno</option>
          {alunos.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nome}
            </option>
          ))}
        </Select>
      </div>

      <Card className="w-full mt-4 shadow-lg">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner size="xl" color="info"/>
          </div>
        ) : alertas.length === 0 ? (
          <div className="text-center py-10 text-gray-600 text-lg">
            🎉 Nenhum alerta ativo no momento.
          </div>
        ) : (
          <>
            {/* 📱 VISUALIZAÇÃO MOBILE (cards) */}
            <div className="block md:hidden space-y-4">
              {alertas.map((a) => (
                <Card
                  key={a.id}
                  className="p-4 shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
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
                      <span className="font-semibold">Risco Reprovação:</span>{" "}
                      <Badge color={a.riscoReprovacao ? "failure" : "success"}>
                        {a.riscoReprovacao ? "Sim" : "Não"}
                      </Badge>
                    </p>
                    <p>
                      <span className="font-semibold">Risco Evasão:</span>{" "}
                      <Badge color={a.riscoEvasao ? "failure" : "success"}>
                        {a.riscoEvasao ? "Sim" : "Não"}
                      </Badge>
                    </p>
                    <p>
                      <span className="font-semibold">Score:</span>{" "}
                      <span className={corDoScore(a.scoreRisco ?? 0)}>
                {a.scoreRisco != null ? a.scoreRisco.toFixed(2) : "-"}
              </span>
                    </p>
                    <p>
                      <span className="font-semibold">Data:</span>{" "}
                      {new Date(a.dataGeracao).toLocaleDateString("pt-BR")}
                    </p>
                  </div>

                  <div className="mt-3">
                    <select
                      className="w-full border border-gray-300 text-sm rounded-md px-2 py-1 bg-white cursor-pointer dark:bg-gray-700 dark:text-gray-100"
                      value={a.status}
                      onChange={(e) => atualizarStatus(a.id, e.target.value)}
                    >
                      <option value="ATIVO">Ativo</option>
                      <option value="REVISADO">Revisado</option>
                      <option value="RESOLVIDO">Resolvido</option>
                    </select>
                  </div>
                </Card>
              ))}
            </div>

            {/* 💻 VISUALIZAÇÃO DESKTOP (tabela normal) */}
            <div className="hidden md:block">
              <Table className="min-w-[700px] text-sm text-gray-700 dark:text-gray-300">
                <TableHead className="bg-gray-100 dark:bg-gray-700">
                  <TableHeadCell className="text-center font-semibold">Aluno</TableHeadCell>
                  <TableHeadCell className="text-center font-semibold">Risco Reprovação</TableHeadCell>
                  <TableHeadCell className="text-center font-semibold">Risco Evasão</TableHeadCell>
                  <TableHeadCell className="text-center font-semibold">Score</TableHeadCell>
                  <TableHeadCell className="text-center font-semibold">Data</TableHeadCell>
                  <TableHeadCell className="text-center font-semibold">Status</TableHeadCell>
                  <TableHeadCell className="text-center font-semibold"></TableHeadCell>
                </TableHead>
                <TableBody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {alertas.map((a) => (
                    <TableRow
                      key={a.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-150"
                    >
                      <TableCell
                        className="text-center font-medium text-gray-900 dark:text-gray-100">{a.alunoNome}</TableCell>
                      <TableCell className="text-center">
                        <Badge color={a.riscoReprovacao ? "failure" : "success"} className="flex items-center justify-center">
                          {a.riscoReprovacao ? "Sim" : "Não"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge color={a.riscoEvasao ? "failure" : "success"} className="flex items-center justify-center">
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
                          color={
                            a.status === "ATIVO"
                              ? "warning"
                              : a.status === "REVISADO"
                                ? "info"
                                : "success"
                          }
                          className="flex items-center justify-center"
                        >
                          {a.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="items-center">
                        <Select
                          className="text-sm rounded-md px-2 py-1  cursor-pointer"
                          value={a.status}
                          onChange={(e) => atualizarStatus(a.id, e.target.value)}
                        >
                          <option value="ATIVO">Ativo</option>
                          <option value="REVISADO">Revisado</option>
                          <option value="RESOLVIDO">Resolvido</option>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}

      </Card>
    </div>
  );
}
