import {useEffect, useState} from "react";

import {Bar, Pie} from "react-chartjs-2";
import {ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from "chart.js";
import {buscar} from "../../../services/Service.ts";
import {Card} from "flowbite-react";
import type {Aluno, Disciplina, Observacao, Professor, Turma} from "../../../models";
import {useAuth} from "../../../contexts/UseAuth.ts";
import {Roles} from "../../../enums/Roles.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import {useNavigate} from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function DashboardCoordenacaoPage() {
  const {usuario, isHydrated, isAuthenticated} = useAuth();

  const navigate = useNavigate();

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [observacoes, setObservacoes] = useState<Observacao[]>([]);

  const cores = [
    // "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
    // "#9966FF", "#FF9F40", "#66FF66", "#FF66B2",
    // "#00CED1", "#C71585"
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#A78BFA"
  ];

  useEffect(() => {
    if (!isHydrated || !isAuthenticated) return;
    buscar("/turmas", setTurmas, {headers: {Authorization: `Bearer ${usuario.token}`}});
    buscar("/professores", setProfessores, {headers: {Authorization: `Bearer ${usuario.token}`}});
    buscar("/alunos", setAlunos, {headers: {Authorization: `Bearer ${usuario.token}`}});
    buscar("/disciplinas", setDisciplinas, {headers: {Authorization: `Bearer ${usuario.token}`}});
    buscar("/observacoes", setObservacoes, {headers: {Authorization: `Bearer ${usuario.token}`}});
  }, [isHydrated, isAuthenticated]);

  // 🔹 Alunos por turma
  const alunosPorTurma = turmas.map(t => ({
    turma: t.nome,
    count: alunos.filter(a => a.turmaId === t.id).length
  }));

  const dataAlunosPorTurma = {
    labels: alunosPorTurma.map(a => a.turma),
    datasets: [{
      label: "Alunos por Turma",
      data: alunosPorTurma.map(a => a.count),
      backgroundColor: alunosPorTurma.map((_, i) => cores[i % cores.length]),
      borderRadius: 6
    }]
  };

  const disciplinasPorTurma = turmas.map(t => ({
    turma: t.nome,
    count: t.disciplinaNomes ? t.disciplinaNomes.length : 0
  }));

  const dataDisciplinasPorTurma = {
    labels: disciplinasPorTurma.map(d => d.turma),
    datasets: [{
      label: "Disciplinas por Turma",
      data: disciplinasPorTurma.map(d => d.count),
      backgroundColor: disciplinasPorTurma.map((_, i) => cores[i % cores.length]),
      borderRadius: 6
    }]
  };

  const professoresPorTurma = turmas.map(t => ({
    turma: t.nome,
    count: professores.filter(professor => professor.turmaIds.includes(t.id)).length
  }));

  const dataProfessoresPorTurma = {
    labels: professoresPorTurma.map(p => p.turma),
    datasets: [{
      label: "Professores por Turma",
      data: professoresPorTurma.map(p => p.count),
      backgroundColor: professoresPorTurma.map((_, i) => cores[i % cores.length]),
      borderRadius: 6
    }]
  };

  const categoriasCount: Record<string, number> = {};
  observacoes.forEach(o => {
    categoriasCount[o.categoria] = (categoriasCount[o.categoria] || 0) + 1;
  });
  const dataObservacoes = {
    labels: Object.keys(categoriasCount),
    datasets: [{
      data: Object.values(categoriasCount),
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#A78BFA"]
    }]
  };

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated || !usuario?.roles.includes(Roles.COORDENADOR)) {
      ToastAlerta("Você precisa estar autenticado como Coordenador", Toast.Info);
      navigate("/login");
    }
  }, [isHydrated, isAuthenticated, usuario]);

  return (
    <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10">
      <Card className="mb-10 p-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Dashboard da Coordenação
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Acompanhe os principais indicadores acadêmicos de turmas, alunos e professores.
        </p>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="p-4 border rounded shadow">
          <h2 className="text-lg font-semibold">Turmas</h2>
          <p className="text-3xl font-bold text-blue-600">{turmas.length}</p>
          <p className="text-sm text-gray-500">turmas no total</p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Professores</h2>
          <p className="text-3xl font-bold text-blue-600">{professores.length}</p>
          <p className="text-sm text-gray-500">professores no total</p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Alunos</h2>
          <p className="text-3xl font-bold text-blue-600">{alunos.length}</p>
          <p className="text-sm text-gray-500">alunos no total</p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Disciplinas</h2>
          <p className="text-3xl font-bold text-blue-600">{disciplinas.length}</p>
          <p className="text-sm text-gray-500">disciplinas no total</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="p-4">
          <h2 className="font-bold mb-2">Alunos por Turma</h2>
          <Bar
            data={dataAlunosPorTurma}
            options={{
              plugins: {legend: {display: false}},
              scales: {
                y: {beginAtZero: true, ticks: {stepSize: 1}}
              }
            }}
          />
        </Card>

        <Card>
          <h2 className="font-bold mb-2">Disciplinas por Turma</h2>
          <Bar
            data={dataDisciplinasPorTurma}
            options={{
              plugins: {legend: {display: false}},
              scales: {
                y: {beginAtZero: true, ticks: {stepSize: 1}}
              }
            }}
          />
        </Card>
        <Card>
          <h2 className="font-bold mb-2">Professores por Turma</h2>
          <Bar
            data={dataProfessoresPorTurma}
            options={{
              plugins: {legend: {display: false}},
              scales: {
                y: {beginAtZero: true, ticks: {stepSize: 1}}
              }
            }}
          />
        </Card>
        <Card>
          <h2 className="font-bold mb-2">Observações por Categoria</h2>
          <Pie data={dataObservacoes}/>
        </Card>
      </div>
    </div>
  );
}
