import {Card} from "flowbite-react";
import {FaChalkboardTeacher, FaChartLine, FaClipboardList, FaFileAlt} from "react-icons/fa";
import {useAuth} from "../../../contexts/UseAuth.ts";
import {useEffect, useState} from "react";
import type {Turma} from "../../../models";
import {buscar} from "../../../services/Service.ts";
import {Link} from "react-router-dom";
import {FaNoteSticky} from "react-icons/fa6";

export default function HomeProfessor() {

  const {usuario} = useAuth();
  const [turmas, setTurmas] = useState<Turma[]>([]);

  const totalTurmas = turmas.filter(turma =>
    turma.professorNomes.includes(usuario?.nome)
  ).length;

  const turmasDoProfessor = turmas.filter(turma =>
    turma.professorNomes
      ?.map(nome => nome.toLowerCase())
      .includes(usuario?.nome?.toLowerCase())
  );

// Criar sets para garantir unicidade
  const alunosIdsSet = new Set<number>();
  const alunosNomesSet = new Set<string>();

  turmasDoProfessor.forEach(turma => {
    turma.alunoIds?.forEach(id => alunosIdsSet.add(id));
    turma.alunoNomes?.forEach(nome => alunosNomesSet.add(nome));
  });

  const totalAlunos = alunosIdsSet.size;

  async function carregarTurmas() {
    try {
      const response = await buscar("/turmas", setTurmas, {
        headers: {Authorization: `Bearer ${usuario.token}`}
      });
      console.log("Turmas carregadas:", response);
    } catch (error) {
      console.error("Erro ao buscar turmas:", error);
    }
  }

  useEffect(() => {
    if (usuario) carregarTurmas();
  }, [usuario]);

  return (
    <>
      <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10 space-y-6">

        <Card className="bg-gray-100 dark:bg-gray-800 text-center shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Olá, Professor {usuario?.nome?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gerencie suas turmas, registre presenças e acompanhe o desempenho dos alunos.
          </p>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          <Card className="hover:shadow-lg transition-all cursor-pointer">
            <Link to='/presenca'>
              <FaClipboardList className="text-4xl text-green-600 mb-3"/>
              <h2 className="text-lg font-semibold">Chamada Diária</h2>
              <p className="text-sm text-gray-500">Registre presença dos alunos rapidamente.</p>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer">
            <Link to='/notas'>
              <FaChartLine className="text-4xl text-blue-600 mb-3"/>
              <h2 className="text-lg font-semibold">Lançar Notas</h2>
              <p className="text-sm text-gray-500">Gerencie o desempenho dos alunos.</p>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer">
            <Link to='/observacoes'>
              <FaNoteSticky className="text-4xl text-green-600 mb-3"/>
              <h2 className="text-lg font-semibold">Observações</h2>
              <p className="text-sm text-gray-500">Adicione anotações sobre a vida acadêmica dos alunos.</p>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer">
            <Link to='/avaliacoes'>
              <FaFileAlt className="text-4xl text-yellow-600 mb-3"/>
              <h2 className="text-lg font-semibold">Avaliações</h2>
              <p className="text-sm text-gray-500">Gerencie atividades e avaliações.</p>
            </Link>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

          {/* Alunos ativos */}
          <Card className="text-center py-6">
            <h3 className="text-gray-500">Alunos ativos</h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {totalAlunos}
            </p>

          </Card>


          {/* Turmas com lista */}
          <Card className="text-center py-6">
            <h3 className="text-gray-500 mb-2">Total de Turmas</h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {totalTurmas}
            </p>
          </Card>

          {/*Chamadas registradas*/}
          <Card className="text-center py-6">
            <h3 className="text-gray-500">Turmas</h3>
            <div
              className="mt-4 max-h-32 overflow-y-auto px-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              {turmas
                .filter(turma => turma.professorNomes.includes(usuario?.nome))
                .map(turma => (
                  <div
                    key={turma.id}
                    className="flex items-center justify-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <FaChalkboardTeacher className="text-rose-600"/>
                    <span>{turma.nome}</span>
                  </div>
                ))}
            </div>
          </Card>

        </div>
      </div>
    </>
  )
}
