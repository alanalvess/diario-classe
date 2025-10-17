import {useEffect, useState} from "react";
import {
  Button,
  Card,
  Label,
  Select,
} from "flowbite-react";
import {baixarArquivo, buscar} from "../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import type {Filtro} from "../../../models";
import {useAuth} from "../../../contexts/UseAuth.ts";
import {
  FaChalkboardTeacher,
  FaChartLine,
  FaExclamationTriangle,
  FaFileExcel,
  FaFilePdf,
  FaUserGraduate
} from "react-icons/fa";

export default function RelatoriosCoordenacao() {
  const {usuario, isHydrated, isAuthenticated} = useAuth();

  const [filtros, setFiltros] = useState<Filtro>({
    anoLetivo: new Date().getFullYear().toString(),
    turmaId: null,
    disciplinaId: null,
  });

  const [turmas, setTurmas] = useState<{ id: number; nome: string; anoLetivo: string }[]>([]);
  const [disciplinas, setDisciplinas] = useState<{ id: number; nome: string }[]>([]);
  const [professores, setProfessores] = useState<{ id: number; nome: string }[]>([]);
  // const [relatorio, setRelatorio] = useState<Relatorio[]>([]);

  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  const [periodoSelecionado, setPeriodoSelecionado] = useState("");


  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 🔹 Buscar opções de filtro iniciais
  useEffect(() => {
    if (!isHydrated || !isAuthenticated) return;

    buscar("/turmas", setTurmas, {headers: {Authorization: `Bearer ${usuario.token}`}});
    buscar("/professores", setProfessores, {headers: {Authorization: `Bearer ${usuario.token}`}});
  }, [isHydrated, isAuthenticated]);

  // 🔹 Buscar disciplinas quando seleciona uma turma
  useEffect(() => {
    if (!isHydrated || !isAuthenticated || !filtros.turmaId) {
      setDisciplinas([]);
      return;
    }

    buscar(`/disciplinas/turma/${filtros.turmaId}`, setDisciplinas, {headers: {Authorization: `Bearer ${usuario.token}`}});
  }, [filtros.turmaId, isAuthenticated, isHydrated]);


  const periodos = ["1º Bimestre", "2º Bimestre", "3º Bimestre", "4º Bimestre"];

  async function handleDownload(relatorio: string, formato: "pdf" | "xlsx") {
    try {
      setIsLoading(true);

      const query = new URLSearchParams({
        relatorio,               // obrigatório pelo backend
        tipo: formato,           // pdf ou xlsx
        ...(turmaSelecionada ? { turmaId: turmaSelecionada } : {}),
        ...(periodoSelecionado ? { periodo: periodoSelecionado } : {})
      });

      await baixarArquivo(
        `/relatorios?${query.toString()}`,
        `${relatorio}.${formato}`,
        { headers: { Authorization: `Bearer ${usuario.token}` } }
      );

      ToastAlerta(`✅ Relatório ${relatorio.toUpperCase()} gerado com sucesso!`, Toast.Success);
    } catch (error) {
      console.error(error);
      ToastAlerta(`Erro ao gerar relatório ${relatorio.toUpperCase()}`, Toast.Error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10">
        <Card className="p-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            📊 Relatórios da Coordenação
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gere e baixe relatórios acadêmicos detalhados para análise e acompanhamento.
          </p>
        </Card>

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <div>
            <Label htmlFor="turma" />
            <Select
              id="turma"
              value={turmaSelecionada}
              onChange={(e) => setTurmaSelecionada(e.target.value)}
            >
              <option value="">Todas</option>
              {turmas.map((t) => (
                <option key={t.id}>{t.nome}</option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="periodo" />
            <Select
              id="periodo"
              value={periodoSelecionado}
              onChange={(e) => setPeriodoSelecionado(e.target.value)}
            >
              <option value="">Todos</option>
              {periodos.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </Select>
          </div>
        </div>

        {/* Cards dos relatórios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {/* Relatório de Risco Acadêmico */}
          <Card className="p-5 shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-3">
              <FaExclamationTriangle className="text-yellow-500 text-2xl" />
              <h3 className="text-lg font-semibold">Risco Acadêmico</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Exibe todos os alunos com seus níveis de risco de reprovação e evasão.
            </p>
            <div className="flex gap-2">
              <Button color="purple" onClick={() => handleDownload("risco", "pdf")}>
                <FaFilePdf className="mr-2" /> PDF
              </Button>
              <Button color="green" onClick={() => handleDownload("risco", "xlsx")}>
                <FaFileExcel className="mr-2" /> Excel
              </Button>
            </div>
          </Card>

          {/* Relatório de Desempenho por Turma */}
          <Card className="p-5 shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-3">
              <FaChartLine className="text-blue-500 text-2xl" />
              <h3 className="text-lg font-semibold">Desempenho por Turma</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Mostra médias gerais, taxas de aprovação e reprovação por turma.
            </p>
            <div className="flex gap-2">
              <Button color="purple" onClick={() => handleDownload("desempenho", "pdf")}>
                <FaFilePdf className="mr-2" /> PDF
              </Button>
              <Button color="green" onClick={() => handleDownload("desempenho", "xlsx")}>
                <FaFileExcel className="mr-2" /> Excel
              </Button>
            </div>
          </Card>

          {/* Relatório de Frequência */}
          <Card className="p-5 shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-3">
              <FaUserGraduate className="text-indigo-500 text-2xl" />
              <h3 className="text-lg font-semibold">Frequência</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Mostra percentuais de presença e ausência dos alunos.
            </p>
            <div className="flex gap-2">
              <Button color="green" onClick={() => handleDownload("frequencia", "xlsx")}>
                <FaFileExcel className="mr-2" /> Excel
              </Button>
            </div>
          </Card>

          {/* Relatório de Alertas */}
          <Card className="p-5 shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-3">
              <FaExclamationTriangle className="text-red-500 text-2xl" />
              <h3 className="text-lg font-semibold">Alertas Acadêmicos</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Lista todos os alertas ativos, revisados e resolvidos.
            </p>
            <div className="flex gap-2">
              <Button color="purple" onClick={() => handleDownload("alertas", "pdf")}>
                <FaFilePdf className="mr-2" /> PDF
              </Button>
            </div>
          </Card>

          {/* Relatório de Professores e Disciplinas */}
          <Card className="p-5 shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-3">
              <FaChalkboardTeacher className="text-amber-500 text-2xl" />
              <h3 className="text-lg font-semibold">Professores e Disciplinas</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Mostra o vínculo entre professores, turmas e disciplinas.
            </p>
            <div className="flex gap-2">
              <Button color="purple" onClick={() => handleDownload("professores", "pdf")}>
                <FaFilePdf className="mr-2" /> PDF
              </Button>
            </div>
          </Card>

          {/* Relatório de Indicadores Gerais */}
          <Card className="p-5 shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-3">
              <FaChartLine className="text-emerald-500 text-2xl" />
              <h3 className="text-lg font-semibold">Indicadores Gerais</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Mostra taxas médias de risco, evasão, reprovação e desempenho geral da escola.
            </p>
            <div className="flex gap-2">
              <Button color="green" onClick={() => handleDownload("indicadores", "xlsx")}>
                <FaFileExcel className="mr-2" /> Excel
              </Button>
              <Button color="purple" onClick={() => handleDownload("indicadores", "pdf")}>
                <FaFilePdf className="mr-2" /> PDF
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/*/!* Tabela *!/*/}
      {/*{relatorio.length > 0 && (*/}
      {/*  <Table>*/}
      {/*    <TableHead>*/}
      {/*      <TableHeadCell>Aluno</TableHeadCell>*/}
      {/*      <TableHeadCell>Turma</TableHeadCell>*/}
      {/*    </TableHead>*/}
      {/*    <TableBody>*/}
      {/*      {relatorio.map((item, i) => (*/}
      {/*        <TableRow key={i}>*/}
      {/*          <TableCell>{item.alunoNome}</TableCell>*/}
      {/*          <TableCell>{item.turma}</TableCell>*/}
      {/*        </TableRow>*/}
      {/*      ))}*/}
      {/*    </TableBody>*/}
      {/*  </Table>*/}
      {/*)}*/}
    </>
  );
}