import {Card} from "flowbite-react";
import {FaBook, FaChalkboardTeacher, FaChartBar, FaChartPie, FaFileAlt, FaGraduationCap, FaUsers} from "react-icons/fa";
import {useAuth} from "../../../contexts/UseAuth.ts";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {buscar} from "../../../services/Service.ts";
import type {Professor, Turma} from "../../../models";
import {MdManageAccounts} from "react-icons/md";

export default function HomeCoordenador() {
  const {usuario, isAuthenticated, isHydrated} = useAuth();
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);

  useEffect(() => {
    if (!isHydrated || !isAuthenticated) return;
    buscar("/professores", setProfessores, {headers: {Authorization: `Bearer ${usuario.token}`}});
    buscar("/turmas", setTurmas, {headers: {Authorization: `Bearer ${usuario.token}`}});
  }, [isHydrated, isAuthenticated]);

  function totalProfessores() {
    return professores.length;
  }

  function totalTurmas() {
    return turmas.length;
  }

  return (
    <>
      <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10 space-y-6">
        {/* Saudação */}
        <Card className="p-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Olá, Coordenador(a) {usuario?.nome?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Acompanhe o desempenho da escola, gerencie professores e turmas com eficiência.
          </p>
        </Card>

        {/* Ações principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          <Card className="hover:shadow-lg transition-all cursor-pointer text-center">
            <Link to="/gestao-alunos">
              <FaGraduationCap className="text-4xl text-blue-600 mb-3 mx-auto"/>
              <h2 className="text-lg font-semibold">Alunos</h2>
              <p className="text-sm text-gray-500">Gerencie todos os alunos matriculados.</p>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer text-center">
            <Link to="/professores">
              <FaChalkboardTeacher className="text-4xl text-blue-600 mb-3 mx-auto"/>
              <h2 className="text-lg font-semibold">Professores</h2>
              <p className="text-sm text-gray-500">Gerencie e acompanhe os professores cadastrados.</p>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer text-center">
            <Link to="/turmas">
              <FaUsers className="text-4xl text-green-600 mb-3 mx-auto"/>
              <h2 className="text-lg font-semibold">Turmas</h2>
              <p className="text-sm text-gray-500">Crie e organize turmas e disciplinas.</p>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer text-center">
            <Link to="/disciplinas">
              <FaBook className="text-4xl text-green-600 mb-3 mx-auto"/>
              <h2 className="text-lg font-semibold">Disciplinas</h2>
              <p className="text-sm text-gray-500">Gerencie as matérias oferecidas pela escola.</p>
            </Link>
          </Card>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <Card className="text-center py-6 dark:bg-gray-800">
            <h3 className="text-gray-500 dark:text-gray-400">Professores ativos</h3>
            <p className="text-3xl font-bold text-blue-600">{totalProfessores()}</p>
          </Card>

          <Card className="text-center py-6 dark:bg-gray-800">
            <h3 className="text-gray-500 dark:text-gray-400">Turmas cadastradas</h3>
            <p className="text-3xl font-bold text-green-600">{totalTurmas()}</p>
          </Card>
        </div>

        {/* Segunda linha de ações */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          <Card className="hover:shadow-lg transition-all cursor-pointer text-center">
            <Link to="/dashboard-coordenacao">
              <FaChartBar className="text-4xl text-purple-600 mb-3 mx-auto"/>
              <h2 className="text-lg font-semibold">Dashboard</h2>
              <p className="text-sm text-gray-500">Analise indicadores de notas e presença.</p>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer text-center">
            <Link to="/usuarios">
              <MdManageAccounts className="text-4xl text-gray-600 mb-3 mx-auto"/>
              <h2 className="text-lg font-semibold">Usuários</h2>
              <p className="text-sm text-gray-500">Gerencie todos os usuários, professores, responsáveis por aluno e outros.</p>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer text-center">
            <Link to="/relatorios-coordenacao">
              <FaChartBar className="text-4xl text-purple-600 mb-3 mx-auto"/>
              <h2 className="text-lg font-semibold">Relatórios</h2>
              <p className="text-sm text-gray-500">Gere relatórios detalhados de desempenho.</p>
            </Link>
          </Card>
        </div>
      </div>
    </>
  )
}
