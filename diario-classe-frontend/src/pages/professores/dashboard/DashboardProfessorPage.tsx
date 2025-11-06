import {useAuth} from "../../../contexts/UseAuth.ts";
import React, {useEffect, useState} from "react";
import type {Aluno, Nota, Observacao, Presenca, Professor, Turma} from "../../../models";
import {buscar} from "../../../services/Service.ts";
import {Alert, Card, Select} from "flowbite-react";
import {Bar, Line} from "react-chartjs-2";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from "chart.js";
import {Roles} from "../../../enums/Roles.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import {useNavigate} from "react-router-dom";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  PointElement
);

type EvolucaoBimestral = {
  bimestre: number;
  mediasPorDisciplina: Record<string, number>;
};

export default function DashboardProfessorPage() {
  const {usuario, isHydrated, isAuthenticated} = useAuth();
  const navigate = useNavigate();

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState<number | null>(null);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [notas, setNotas] = useState<Nota[]>([]);
  const [presencas, setPresencas] = useState<Presenca[]>([]);
  const [professor, setProfessor] = useState<Professor>();
  const [observacoes, setObservacoes] = useState<Observacao[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [evolucaoNotas, setEvolucaoNotas] = useState<EvolucaoBimestral[]>([]);

  const [mediaGeral, setMediaGeral] = useState<number>(0);


  const cores = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#A78BFA"];


  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated || !usuario?.roles.includes(Roles.PROFESSOR)) {
      ToastAlerta("Você precisa estar autenticado como Professor", Toast.Info);
      navigate("/login");
    }
  }, [isHydrated, isAuthenticated, usuario]);

  async function buscarProfessorPorEmail() {
    try {
      await buscar(`/professores/email/${usuario.email}`, setProfessor,
        {headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"}}
      );
    } catch (err) {
      console.log(err);
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

  async function buscarAlunosPorTurma() {
    try {
      await buscar(`/alunos/turma/${turmaSelecionada}`, setAlunos,
        {headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"}}
      );
    } catch (error) {
      console.error("Erro ao carregar turmas do professor", error);
    }
  }

  async function buscarObservacoesPorTurma() {
    try {
      await buscar(`/observacoes/turma/${turmaSelecionada}`, setObservacoes,
        {headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"}}
      );
    } catch (error) {
      console.error("Erro ao carregar turmas do professor", error);
    }
  }

  async function buscarPresencasPorTurma() {
    try {
      await buscar(`/presencas/turma/${turmaSelecionada}`, setPresencas,
        {headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"}}
      );
    } catch (error) {
      console.error("Erro ao carregar turmas do professor", error);
    }
  }

  async function buscarMediasPorTurma() {
    try {
      await buscar(`/notas/turma/${turmaSelecionada}/media-por-disciplina`, setNotas,
        {headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"}}
      );
    } catch (error) {
      console.error("Erro ao carregar turmas do professor", error);
    }
  }

  async function buscarEvolucaoNotas() {
    if (!turmaSelecionada) return;

    try {
      await buscar(
        `/avaliacoes/turma/${turmaSelecionada}/evolucao-bimestral`,
        setEvolucaoNotas,
        {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Erro ao carregar evolução de notas:", error);
      setEvolucaoNotas([]); // evita que fique indefinido
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
    setIsLoading(true);
    Promise.all(
      [
        buscarAlunosPorTurma(),
        buscarObservacoesPorTurma(),
        buscarPresencasPorTurma(),
        buscarMediasPorTurma(),
        buscarEvolucaoNotas(),
      ]
    )
      .catch((error) => console.error("Erro ao carregar dados da turma:", error))
      .finally(() => setIsLoading(false));
  }, [turmaSelecionada]);

  useEffect(() => {
    calcularMediaGeral();
  }, [evolucaoNotas])

  const totalObservacoes = observacoes.length;
  const totalAlunos = alunos.length;

  const feriados: string[] = ["2025-01-01"];

  function gerarDiasLetivosDoMes(ano: number, mes: number) {
    const dias: string[] = [];
    const hoje = new Date();
    const ultimoDia = new Date(ano, mes, 0).getDate();
    for (let dia = 1; dia <= ultimoDia; dia++) {
      const data = new Date(ano, mes - 1, dia);
      const dataStr = `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
      const diaSemana = data.getDay();
      const fimDeSemana = diaSemana === 0 || diaSemana === 6;
      const ehFeriado = feriados.includes(dataStr);

      if (!fimDeSemana && !ehFeriado && data <= hoje) {
        dias.push(dataStr);
      }
    }
    return dias;
  }

  function calcularFrequenciaPorAluno(presencasList: Presenca[]) {
    const agora = new Date();
    const diasLetivos = gerarDiasLetivosDoMes(agora.getFullYear(), agora.getMonth() + 1);
    const totalDiasLetivos = diasLetivos.length;
    const mapa = new Map<number, number>();

    for (const p of presencasList) {
      const alunoId = p.alunoId ?? p.alunoId;
      if (!alunoId || !p.data) continue;
      if (diasLetivos.includes(p.data) && p.presente === true) {
        mapa.set(alunoId, (mapa.get(alunoId) ?? 0) + 1);
      }
    }
    const resultado = new Map<number, number>();
    for (const [alunoId, presencas] of mapa.entries()) {
      const freq = totalDiasLetivos > 0 ? (presencas / totalDiasLetivos) * 100 : 0;
      resultado.set(alunoId, Number(freq.toFixed(1)));
    }
    return resultado;
  }

  function gerarSemanasDoMes(mesAno: string): { inicio: string, fim: string }[] {
    const [ano, mes] = mesAno.split("-").map(Number);
    const semanas: { inicio: string, fim: string }[] = [];

    const primeiroDiaMes = new Date(ano, mes - 1, 1);
    const ultimoDiaMes = new Date(ano, mes, 0);

    // Garante que a primeira semana comece no domingo anterior
    const inicioSemana = new Date(primeiroDiaMes);
    inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());

    while (inicioSemana <= ultimoDiaMes) {
      const fimSemana = new Date(inicioSemana);
      fimSemana.setDate(fimSemana.getDate() + 6);

      const inicioStr = inicioSemana.toLocaleDateString("en-CA");
      const fimStr = fimSemana.toLocaleDateString("en-CA");

      semanas.push({inicio: inicioStr, fim: fimStr});
      inicioSemana.setDate(inicioSemana.getDate() + 7);
    }

    return semanas;
  }


  const mesAno = new Date().toISOString().slice(0, 7);
  // const mesAno = "2025-07";

  const semanas = gerarSemanasDoMes(mesAno);
  const dadosSemana = contarPresencasEFaltasPorSemana(presencas, semanas, feriados, alunos);

  function contarPresencasEFaltasPorSemana(
    presencas: Presenca[],
    semanas: { inicio: string, fim: string }[],
    feriados: string[],
    alunos: Aluno[]
  ) {
    const mesAtual = new Date().getMonth() + 1;
    // const mesAtual = Number(mesAno.split("-")[1]);

    return semanas.map(semana => {
      const inicio = new Date(semana.inicio);
      const fim = new Date(semana.fim);

      const diasUteis: string[] = [];

      for (let d = new Date(inicio); d <= fim; d.setDate(d.getDate() + 1)) {
        const diaSemana = d.getDay();
        const dataStr = d.toLocaleDateString("en-CA");
        const isFimDeSemana = diaSemana === 0 || diaSemana === 6;
        const isFeriado = feriados.includes(dataStr);
        const mesDoDia = d.getMonth() + 1;

        // ✅ filtra apenas dias úteis dentro do mês atual
        if (!isFimDeSemana && !isFeriado && mesDoDia === mesAtual) {
          diasUteis.push(dataStr);
        }
      }

      let presencasCount = 0;
      let faltasCount = 0;

      for (const dia of diasUteis) {
        for (const aluno of alunos) {
          const presente = presencas.some(
            p => p.data === dia && p.alunoId === aluno.id && p.presente
          );
          if (presente) presencasCount++;
          else faltasCount++;
        }
      }

      return {presencas: presencasCount, faltas: faltasCount};
    });
  }

  function calcularMediaGeral() {
    if (!evolucaoNotas || evolucaoNotas.length === 0) {
      setMediaGeral(0);
      return;
    }

    let somaNotas = 0;
    let totalNotas = 0;

    // percorre cada bimestre
    evolucaoNotas.forEach((bimestre) => {
      const notas = Object.values(bimestre.mediasPorDisciplina ?? {});
      notas.forEach((nota) => {
        somaNotas += nota;
        totalNotas++;
      });
    });

    const media = totalNotas > 0 ? somaNotas / totalNotas : 0;
    setMediaGeral(Number(media.toFixed(1)));
  }


  const presencasData = {
    labels: ["Semana1", "Semana2", "Semana3", "Semana4", "Semana5"],
    datasets: [{
      label: "Presenças",
      data: dadosSemana.map(d => d.presencas),
      borderColor: "#22c55e",
      backgroundColor: "rgba(34, 197, 94, 0.2)",
    }, {
      label: "Faltas",
      data: dadosSemana.map(d => d.faltas),
      borderColor: "#ef4444",
      backgroundColor: "rgba(239, 68, 68, 0.2)",
    }]
  };

// 🔹 Calcula a média geral de cada disciplina
  const mediasPorDisciplina = notas.reduce((acc, n) => {
    if (!acc[n.disciplinaNome]) acc[n.disciplinaNome] = [];
    acc[n.disciplinaNome].push(Number(n.mediaTurma));
    return acc;
  }, {} as Record<string, number[]>);

// 🔹 Converte em array no mesmo formato de “alunosPorTurma”
  const disciplinasPorTurma = Object.entries(mediasPorDisciplina).map(
    ([disciplina, medias]) => ({
      disciplina,
      media: Number(
        (medias.reduce((soma, v) => soma + v, 0) / medias.length).toFixed(2)
      ),
    })
  );

// 🔹 Monta os dados para o gráfico (idêntico ao padrão anterior)
  const notasData = {
    labels: disciplinasPorTurma.map(d => d.disciplina),
    datasets: [
      {
        label: "Média por Disciplina",
        data: disciplinasPorTurma.map(d => d.media),
        backgroundColor: disciplinasPorTurma.map(
          (_, i) => cores[i % cores.length]
        ),
        borderRadius: 6,
      },
    ],
  };

  const frequenciasPorAluno = calcularFrequenciaPorAluno(presencas);
  const frequenciaData = {
    labels: alunos.map(a => a.nome),
    datasets: [{
      label: "Frequência(%)",
      data: alunos.map(a => frequenciasPorAluno.get(a.id) ?? 0),
      backgroundColor: "#FFCE56",
      borderRadius: 6,
    }]
  };

  const todasDisciplinas = Array.from(
    new Set(
      evolucaoNotas.flatMap(e =>
        Object.keys(e.mediasPorDisciplina ?? {}) // garante que não seja undefined
      )
    )
  );

  const evolucaoData = {
    labels: evolucaoNotas.map(e => `Bimestre ${e.bimestre}`),
    datasets: todasDisciplinas.map((disciplina, index) => ({
      label: disciplina,
      data: evolucaoNotas.map(e =>
        e.mediasPorDisciplina && e.mediasPorDisciplina[disciplina] != null
          ? Number(e.mediasPorDisciplina[disciplina])
          : 0
      ),
      borderColor: cores[index % cores.length],
      backgroundColor: "transparent",
      tension: 0.4,
    })),
  };



  return (
    <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10">
      <Card className="mb-10 p-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Dashboard do Professor
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Analise os principais indicadores da turma.
        </p>
      </Card>

      <div className="flex items-center gap-4 mt-8 mb-4">
        <Select
          id="turma"
          value={turmaSelecionada}
          onChange={(e) => setTurmaSelecionada(Number(e.target.value))}
          className="rounded-md w-full"
        >
          <option value="">
            Selecione a turma...
          </option>
          {turmas.map((t: Turma) => (<option key={t.id} value={t.id}> {t.nome} </option>))}
        </Select>
      </div>

      {!turmaSelecionada ? (
        <Alert color="info" className="mt-10 text-center">
          <span className="font-medium">Selecione os filtros:</span> escolha uma turma para visualizar gráficos.
        </Alert>

      ) : turmaSelecionada && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 my-6 gap-4">
            <Card>
              <h2 className="text-lg font-semibold">Alunos</h2>
              <p className="text-3xl font-bold text-blue-600">
                {isLoading ? "..." : totalAlunos}
              </p>
              <p className="text-sm text-gray-500">Total na turma</p>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold">Média Geral</h2>
              <p className="text-3xl font-bold text-green-600">
                {isLoading ? "..." : mediaGeral}
              </p>
              <p className="text-sm text-gray-500">Média de notas</p>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold">Observações</h2>
              <p className="text-3xl font-bold text-red-600">
                {isLoading ? "..." : totalObservacoes}
              </p>
              <p className="text-sm text-gray-500">Registradas na turma</p>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h2 className="font-bold mb-2">Evolução de Notas ao Longo do Tempo</h2>
              <Line
                data={evolucaoData}
                options={{
                  responsive: true,
                  plugins: { legend: { position: "top" } },
                  scales: { y: { beginAtZero: true, max: 10 } },
                }}
              />
            </Card>

            <Card>
              <h2 className="font-bold mb-2">Média de Notas por Disciplina</h2>
              <Bar
                data={notasData}
                // options={{ indexAxis: "x" }}
                options={{
                  plugins: {legend: {display: false}},
                  scales: {
                    y: {beginAtZero: true, ticks: {stepSize: 1}}
                  }
                }}
              />
            </Card>

            <Card>
              <h2 className="font-bold mb-2">Frequência de Presença por Aluno</h2>
              <Bar data={frequenciaData} options={{ indexAxis: "y" }} />
            </Card>

            <Card>
              <h2 className="text-lg font-semibold mb-2">📅 Presenças e Faltas</h2>
              <Line data={presencasData} />
            </Card>
          </div>
        </>
      )}

    </div>
  );
}