import {useEffect, useState} from "react";

import {Bar, Pie} from "react-chartjs-2";
import {ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from "chart.js";
import {buscar} from "../../../services/Service.ts";
import {Card} from "flowbite-react";
import type {Aluno, Disciplina, Observacao, Professor, Turma} from "../../../models";
import {useAuth} from "../../../contexts/UseAuth.ts";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function DashboardCoordenacaoPage() {
  const {usuario, isHydrated, isAuthenticated} = useAuth();

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

  // const dataAlunosPorTurma = {
  //   labels: alunosPorTurma.map(a => a.turma),
  //   datasets: [{ label: "Alunos por Turma", data: alunosPorTurma.map(a => a.count), backgroundColor: "rgba(54, 162, 235, 0.6)" }]
  // };

  const dataAlunosPorTurma = {
    labels: alunosPorTurma.map(a => a.turma),
    datasets: [{
      label: "Alunos por Turma",
      data: alunosPorTurma.map(a => a.count),
      backgroundColor: alunosPorTurma.map((_, i) => cores[i % cores.length]),
      borderRadius: 6
    }]
  };

  // 🔹 Disciplinas por turma
  const disciplinasPorTurma = turmas.map(t => ({
    turma: t.nome,
    count: t.disciplinaNomes ? t.disciplinaNomes.length : 0
  }));

  // const dataDisciplinasPorTurma = {
  //   labels: disciplinasPorTurma.map(d => d.turma),
  //   datasets: [{
  //     label: "Disciplinas por Turma",
  //     data: disciplinasPorTurma.map(d => d.count),
  //     backgroundColor: "rgba(255, 206, 86, 0.6)" }]
  // };

  const dataDisciplinasPorTurma = {
    labels: disciplinasPorTurma.map(d => d.turma),
    datasets: [{
      label: "Disciplinas por Turma",
      data: disciplinasPorTurma.map(d => d.count),
      backgroundColor: disciplinasPorTurma.map((_, i) => cores[i % cores.length]),
      borderRadius: 6
    }]
  };

  // 🔹 Professores por turma
  const professoresPorTurma = turmas.map(t => ({
    turma: t.nome,
    count: professores.filter(professor => professor.turmaIds.includes(t.id)).length
  }));

  // const dataProfessoresPorTurma = {
  //   labels: professoresPorTurma.map(p => p.turma),
  //   datasets: [{ label: "Professores por Turma", data: professoresPorTurma.map(p => p.count), backgroundColor: "rgba(75, 192, 192, 0.6)" }]
  // };

  const dataProfessoresPorTurma = {
    labels: professoresPorTurma.map(p => p.turma),
    datasets: [{
      label: "Professores por Turma",
      data: professoresPorTurma.map(p => p.count),
      backgroundColor: professoresPorTurma.map((_, i) => cores[i % cores.length]),
      borderRadius: 6
    }]
  };

  // 🔹 Observações por categoria
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

  return (
    <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10">
      <h1 className="text-2xl font-bold mb-6">Dashboard da Coordenação</h1>

      {/* Indicadores principais */}
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

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/*<Card>*/}
        {/*  <h2 className="font-bold mb-2">Alunos por Turma</h2>*/}
        {/*  <Bar data={dataAlunosPorTurma} />*/}
        {/*</Card>*/}

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
          {/*<div className="flex flex-wrap gap-3 mt-4">*/}
          {/*  {alunosPorTurma.map((a, i) => (*/}
          {/*    <div key={a.turma} className="flex items-center space-x-2">*/}
          {/*      <span className="w-4 h-4 rounded-sm" style={{backgroundColor: cores[i % cores.length]}}></span>*/}
          {/*      <span className="text-sm">{a.turma}</span>*/}
          {/*    </div>*/}
          {/*  ))}*/}
          {/*</div>*/}
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
