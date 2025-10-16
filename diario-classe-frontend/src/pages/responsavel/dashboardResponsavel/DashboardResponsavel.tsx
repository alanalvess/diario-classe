import { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {useAuth} from "../../../contexts/UseAuth.ts";
import type {Aluno, Observacao, Responsavel} from "../../../models";
import {buscar} from "../../../services/Service.ts";
import {Card} from "flowbite-react";

export default function DashboardResponsavelPage() {
  const { usuario, isAuthenticated } = useAuth();

  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [observacoes, setObservacoes] = useState<Observacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [responsavel, setResponsavel] = useState<Responsavel>();


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
  useEffect(() => {
    if (!usuario?.email) return;
    buscarResponsavelPorEmail();
  }, [usuario]);

  useEffect(() => {
    if (!responsavel?.email) return;
    buscarAlunosDoResponsavel();
  }, [responsavel]);

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

  useEffect(() => {
    if (isAuthenticated && usuario?.token) {
      carregarDados();
    }
  }, [isAuthenticated]);

  async function carregarDados() {
    try {
      await buscar("/observacoes", setObservacoes, {
        headers: { Authorization: `Bearer ${usuario.token}` },
      });
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // 🟢 Total de alunos sob responsabilidade
  const totalAlunos = alunos.length;

  // 🟣 Média geral dos alunos (mock enquanto não vem do backend)
  const mediaGeral =
    alunos.length > 0
      ? (
        alunos.reduce((sum, a) => sum + (
          // a.mediaGeral ||
          0), 0) / alunos.length
      ).toFixed(1)
      : 0;

  // 🔴 Observações por categoria
  const categoriaMap: Record<string, string> = {
    FALTA: "Falta",
    INDISCIPLINA: "Indisciplina",
    ATIVIDADE: "Atividade Pós-Classe",
  };
  const categoriasCount: Record<string, number> = {};
  observacoes.forEach((o) => {
    const friendly = categoriaMap[o.categoria] || o.categoria;
    categoriasCount[friendly] = (categoriasCount[friendly] || 0) + 1;
  });

  const dataObservacoes = {
    labels: Object.keys(categoriasCount),
    datasets: [
      {
        label: "Observações",
        data: Object.values(categoriasCount),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  // 🟡 Frequência média simulada (mock)
  const freqData = {
    labels: alunos.map((a) => a.nome),
    datasets: [
      {
        label: "Frequência (%)",
        data: alunos.map((a) =>
          // a.frequenciaGeral ||
          Math.random() * 10 + 85),
        backgroundColor: "#4BC0C0",
      },
    ],
  };

  // 🔵 Evolução de notas (mock)
  const evolucaoData = {
    labels: ["1º Bimestre", "2º Bimestre", "3º Bimestre", "4º Bimestre"],
    datasets: [
      {
        label: "Média do aluno",
        data: [7.2, 7.5, 8.0, 8.3],
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54,162,235,0.2)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10 space-y-6">
    <h1 className="text-2xl font-bold">🎓 Dashboard do Responsável</h1>

  {/* Indicadores principais */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <Card>
    <h2 className="text-lg font-semibold">Alunos sob responsabilidade</h2>
  <p className="text-3xl font-bold text-blue-600">{totalAlunos}</p>
    <p className="text-sm text-gray-500">Filhos ou dependentes</p>
  </Card>

  <Card>
  <h2 className="text-lg font-semibold">Média Geral</h2>
  <p className="text-3xl font-bold text-green-600">{mediaGeral}</p>
    <p className="text-sm text-gray-500">Média das notas</p>
  </Card>

  <Card>
  <h2 className="text-lg font-semibold">Observações</h2>
    <p className="text-3xl font-bold text-red-600">
    {isLoading ? "..." : observacoes.length}
    </p>
    <p className="text-sm text-gray-500">Registradas pelos professores</p>
  </Card>
  </div>

  {/* Gráficos */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <Card>
    <h2 className="font-bold mb-2">Observações por Categoria</h2>
  <Pie data={dataObservacoes} />
  </Card>

  <Card>
  <h2 className="font-bold mb-2">Frequência de Presença (%)</h2>
  <Bar
  data={freqData}
  options={{
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, max: 100 },
    },
  }}
  />
  </Card>

  <Card className="md:col-span-2">
  <h2 className="font-bold mb-2">Evolução do Desempenho</h2>
  <Line data={evolucaoData} />
  </Card>
  </div>
  </div>
);
}
