import {useEffect, useState} from "react";
import {Badge, Card, Spinner, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import type {Alerta} from "../../models/Alerta.ts";
import {useAuth} from "../../contexts/UseAuth.ts";
import type {Aluno, Responsavel} from "../../models";
import {buscar} from "../../services/Service.ts";
import SelectField from "../../components/form/SelectField.tsx";

export default function AlertasPage() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {usuario, isAuthenticated} = useAuth();

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

  function corDoScore(score: number) {
    if (score < 0.3) return "text-green-600 font-semibold";
    if (score < 0.7) return "text-yellow-600 font-semibold";
    return "text-red-600 font-semibold";
  }

  return (
    <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10">
      <Card className="p-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            📢 Alertas Acadêmicos
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Veja os registros feitos pelos professores ao longo do período letivo.
        </p>
      </Card>
      <div className="mt-8 flex justify-center">
        <SelectField
          label="Aluno"
          name="aluno"
          required
          value={alunoSelecionado}
          onChange={(e) => setAlunoSelecionado(e.target.value)}
          options={alunos.map((a) => ({
            value: a.id.toString(), // garante que o valor é string
            label: a.nome,
          }))}
          // className="w-80"
        />
      </div>
      <Card className="w-full mt-8 max-w-6xl shadow-lg">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner size="xl" color="info"/>
          </div>
        ) : alertas.length === 0 ? (
          <div className="text-center py-10 text-gray-600 text-lg">
            🎉 Nenhum alerta ativo no momento.
          </div>
        ) : (
          <Table hoverable striped>
            <TableHead>
              <TableHeadCell>Aluno</TableHeadCell>
              <TableHeadCell>Risco Reprovação</TableHeadCell>
              <TableHeadCell>Risco Evasão</TableHeadCell>
              <TableHeadCell>Score</TableHeadCell>
              <TableHeadCell>Data</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
            </TableHead>
            <TableBody>
              {alertas.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.aluno?.nome}</TableCell>
                  <TableCell>
                    <Badge color={a.riscoReprovacao ? "failure" : "success"}>
                      {a.riscoReprovacao ? "Sim" : "Não"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge color={a.riscoEvasao ? "failure" : "success"}>
                      {a.riscoEvasao ? "Sim" : "Não"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={corDoScore(a.scoreRisco ?? 0)}>
                      {a.scoreRisco != null ? a.scoreRisco.toFixed(2) : "-"}
                    </span>

                  </TableCell>
                  <TableCell>{new Date(a.dataGeracao).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>
                    <Badge color={a.status === "ATIVO" ? "warning" : "success"}>{a.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
