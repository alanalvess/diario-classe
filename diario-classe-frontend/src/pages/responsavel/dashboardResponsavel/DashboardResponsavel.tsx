import {useEffect, useState} from "react";
import {Line} from "react-chartjs-2";
import {useAuth} from "../../../contexts/UseAuth.ts";
import type {Aluno, Nota, Presenca, Responsavel} from "../../../models";
import {buscar} from "../../../services/Service.ts";
import {Card} from "flowbite-react";

type EvolucaoBimestral = {
  bimestre: number;
  mediasPorDisciplina: Record<string, number>;
};

export default function DashboardResponsavelPage() {
  const { usuario } = useAuth();

  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [responsavel, setResponsavel] = useState<Responsavel>();
  const [alunoSelecionado, setAlunoSelecionado] = useState<number | null>(null);
  const [presencas, setPresencas] = useState<Presenca[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [evolucoes, setEvolucoes] = useState<EvolucaoBimestral[]>([]);
  const [notas, setNotas] = useState<Nota[]>([]);
  const [mediaGeral, setMediaGeral] = useState<number>(0);
  const [frequencia, setFrequencia] = useState<number>(0);

  const cores = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#A78BFA"];

  const feriados: string[] = ["2025-01-01"];

  // 🔹 Buscar responsável
  async function buscarResponsavelPorEmail() {
    try {
      await buscar(`/responsaveis/email/${usuario.email}`, setResponsavel, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error("Erro ao buscar responsável:", err);
    }
  }

  // 🔹 Buscar alunos do responsável
  async function buscarAlunosDoResponsavel() {
    if (!responsavel?.id) return;
    try {
      await buscar(`/responsaveis/${responsavel.id}/alunos`, setAlunos, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error("Erro ao buscar alunos:", err);
    }
  }

  // 🔹 Buscar evolução de notas
  async function buscarEvolucaoNotas() {
    if (!alunoSelecionado) return [];
    try {
      await buscar(
        `/notas/aluno/${alunoSelecionado}/evolucao-bimestral`,
        setEvolucoes,
        {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Erro ao carregar evolução de notas:", error);
      setEvolucoes([]);
      return [];
    }
  }

// 🔹 Calcular média geral do aluno usando evolução bimestral
  function calcularMediaGeral() {
    if (!evolucoes || evolucoes.length === 0) {
      setMediaGeral(0);
      return;
    }

    let somaNotas = 0;
    let totalNotas = 0;

    // percorre cada bimestre
    evolucoes.forEach((bimestre) => {
      const notas = Object.values(bimestre.mediasPorDisciplina ?? {});
      notas.forEach((nota) => {
        somaNotas += nota;
        totalNotas++;
      });
    });

    const media = totalNotas > 0 ? somaNotas / totalNotas : 0;
    setMediaGeral(Number(media.toFixed(1)));
  }




  async function buscarPresencasDoAluno() {
    if (!alunoSelecionado) return;
    setIsLoading(true);
    try {
      await buscar(`/presencas/aluno/${alunoSelecionado}`, setPresencas, {
        headers: { Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

// 🔹 Calcular frequência
  function calcularFrequenciaDoMes() {
    if (!alunoSelecionado) return;

    const hoje = new Date();
    const periodo = hoje.toISOString().slice(0, 7); // YYYY-MM
    const [ano, mes] = periodo.split("-").map(Number);
    const ultimoDia = new Date(ano, mes, 0).getDate();

    let totalAulas = 0;
    let totalPresencas = 0;

    for (let dia = 1; dia <= ultimoDia; dia++) {
      const dataStr = `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
      const dataObj = new Date(dataStr);
      const diaSemana = dataObj.getDay();
      const fimDeSemana = diaSemana === 0 || diaSemana === 6;
      const feriado = feriados.includes(dataStr);

      if (dataObj > hoje || fimDeSemana || feriado) continue;

      totalAulas++;
      const presencaDia = presencas.find((p) => p.data === dataStr);
      if (presencaDia?.presente) totalPresencas++;
    }

    const freq = totalAulas > 0 ? (totalPresencas / totalAulas) * 100 : 0;
    setFrequencia(Number(freq.toFixed(1)));
  }

  useEffect(() => {
    if (!alunoSelecionado) return;
    buscarPresencasDoAluno();
  }, [alunoSelecionado]);

  useEffect(() => {
    if (presencas.length > 0) calcularFrequenciaDoMes();
  }, [presencas, alunoSelecionado]);

  // 🔹 Efeitos
  useEffect(() => {
    if (usuario?.email) buscarResponsavelPorEmail();
  }, [usuario]);

  useEffect(() => {
    if (responsavel?.id) buscarAlunosDoResponsavel();
  }, [responsavel]);

  useEffect(() => {
    if (!alunoSelecionado) return;
    setIsLoading(true);

    buscarEvolucaoNotas()
      .then(() => calcularMediaGeral())
      .catch((error) => console.error("Erro ao carregar dados:", error))
      .finally(() => setIsLoading(false));
  }, [alunoSelecionado]);


  // 🔹 Dados para o gráfico
  const todasDisciplinas = Array.from(
    new Set(
      evolucoes.flatMap((e) => Object.keys(e.mediasPorDisciplina ?? {}))
    )
  );

  const evolucaoData = {
    labels: evolucoes.map((e) => `Bimestre ${e.bimestre}`),
    datasets: todasDisciplinas.map((disciplina, index) => ({
      label: disciplina,
      data: evolucoes.map((e) =>
        e.mediasPorDisciplina?.[disciplina] != null
          ? Number(e.mediasPorDisciplina[disciplina])
          : 0
      ),
      borderColor: cores[index % cores.length],
      backgroundColor: "transparent",
      tension: 0.4,
    })),
  };

  const evolucaoOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        min: 0,   // força começar em 0
        max: 10,  // força terminar em 10
        ticks: {
          stepSize: 1, // opcional: incrementos de 1
        },
      },
      x: {
        title: {
          display: true,
          text: 'Bimestres',
        },
      },
    },
  };

  return (
    <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10 space-y-6">
      <h1 className="text-2xl font-bold">🎓 Dashboard do Responsável</h1>

      <div className="flex items-center gap-4 mb-4">
        <select
          id="aluno"
          value={alunoSelecionado ?? ""}
          onChange={(e) => setAlunoSelecionado(Number(e.target.value))}
          className="rounded-md my-4 w-full p-2 border"
        >
          <option value="">Selecione...</option>
          {alunos.map((aluno: Aluno) => (
            <option key={aluno.id} value={aluno.id}>
              {aluno.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h2 className="text-lg font-semibold">Média Geral</h2>
          <p className="text-3xl font-bold text-green-600">
            {mediaGeral ? mediaGeral.toFixed(1) : "-"}
          </p>
          <p className="text-sm text-gray-500">Média das notas</p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Frequência</h2>
          <p className="text-3xl font-bold text-blue-600">
            {isLoading ? "..." : `${frequencia}%`}
          </p>
          <p className="text-sm text-gray-500">Percentual de presença</p>
        </Card>
      </div>

      <Card className="md:col-span-2">
        <h2 className="font-bold mb-2">Evolução do Desempenho</h2>
        {evolucoes.length > 0 ? (
          <Line data={evolucaoData} options={evolucaoOptions} />
        ) : (
          <p className="text-gray-500 italic">Sem evolução de notas disponível</p>
        )}
      </Card>
    </div>
  );
}
