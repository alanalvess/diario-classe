import {useAuth} from "../../../contexts/UseAuth.ts";
import {Card} from "flowbite-react";
import {FaBell, FaChartBar, FaClipboardCheck, FaMedal} from "react-icons/fa";
import {Link} from "react-router-dom";
import {FaNoteSticky} from "react-icons/fa6";

export default function HomeResponsavel() {

  const {usuario} = useAuth();

  return (
    <>
      <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10">
        {/* Saudação */}
        <Card className="p-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Olá, {usuario?.nome?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Acompanhe o desempenho e a presença de seus filhos em tempo real.
          </p>
        </Card>

        {/* Ações principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-10">

          <Card className="hover:shadow-lg transition-all cursor-pointer text-center">
            <Link to='/boletim'>
              <FaMedal className="text-4xl text-green-600 mb-3 mx-auto"/>
              <h2 className="text-lg font-semibold">Notas e Avaliações</h2>
              <p className="text-sm text-gray-500">Acompanhe as notas e progresso das disciplinas.</p>
            </Link>
          </Card>
          <Card className="hover:shadow-lg transition-all cursor-pointer text-center">
            <Link to='/presencaAluno'>
              <FaClipboardCheck className="text-4xl text-green-600 mb-3 mx-auto"/>
              <h2 className="text-lg font-semibold">Presenças</h2>
              <p className="text-sm text-gray-500">Confira as presenças e faltas registradas.</p>
            </Link>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6 mt-10">

          <Card className="hover:shadow-lg transition-all cursor-pointer text-center">
            <Link to='/alertas'>
              <FaBell className="text-4xl text-red-600 mb-3 mx-auto"/>
              <h2 className="text-lg font-semibold">Alertas</h2>
              <p className="text-sm text-gray-500">Acompanhe os alerta de risco de evasão e reprovação emitidos para o aluno e enviados as seus responsáveis.</p>
            </Link>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <Card className="hover:shadow-lg transition-all cursor-pointer text-center">
            <Link to="/dashboardResponsavel">
              <FaChartBar className="text-4xl text-purple-600 mb-3 mx-auto"/>
              <h2 className="text-lg font-semibold">Desempenho Escolar</h2>
              <p className="text-sm text-gray-500">Analise indicadores de notas e presença.</p>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer text-center">
            <Link to='/observacoesAluno'>
              <FaNoteSticky className="text-4xl text-purple-600 mb-3 mx-auto"/>
              <h2 className="text-lg font-semibold">Observações</h2>
              <p className="text-sm text-gray-500">Acompanhe anotações dos professores sobre a vida acadêmica do
                aluno.</p>
            </Link>
          </Card>
        </div>

      </div>
    </>
  )
}
