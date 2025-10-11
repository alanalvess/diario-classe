import {useAuth} from "../../../contexts/UseAuth.ts";
import {Button, Card} from "flowbite-react";
import {FaChartBar, FaClipboardCheck, FaEnvelopeOpenText, FaUserGraduate} from "react-icons/fa";

export default function HomeResponsavel() {

  const {usuario} = useAuth();

  return (
    <>
      <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10">
        {/* Saudação */}
        <Card className="p-6 bg-gray-100 dark:bg-gray-800 mt-20 text-center shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Bem-vindo, {usuario?.nome?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Acompanhe o desempenho e a presença de seus filhos em tempo real.
          </p>
        </Card>

        {/* Ações principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          <Card className="hover:shadow-lg transition-all cursor-pointer text-center" href="/meus-filhos">
            <FaUserGraduate className="text-4xl text-blue-600 mb-3 mx-auto"/>
            <h2 className="text-lg font-semibold">Meus Filhos</h2>
            <p className="text-sm text-gray-500">Visualize informações e desempenho escolar.</p>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer text-center" href="/boletim">
            <FaChartBar className="text-4xl text-green-600 mb-3 mx-auto"/>
            <h2 className="text-lg font-semibold">Notas e Avaliações</h2>
            <p className="text-sm text-gray-500">Acompanhe as notas e progresso das disciplinas.</p>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer text-center" href="/frequencia">
            <FaClipboardCheck className="text-4xl text-green-600 mb-3 mx-auto"/>
            <h2 className="text-lg font-semibold">Presenças</h2>
            <p className="text-sm text-gray-500">Confira as presenças e faltas registradas.</p>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer text-center" href="/comunicados">
            <FaEnvelopeOpenText className="text-4xl text-yellow-600 mb-3 mx-auto"/>
            <h2 className="text-lg font-semibold">Comunicados</h2>
            <p className="text-sm text-gray-500">Receba mensagens e avisos da escola.</p>
          </Card>
        </div>

        {/* Estatísticas / Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <Card className="text-center py-6 dark:bg-gray-800">
            <h3 className="text-gray-500 dark:text-gray-400">Filhos cadastrados</h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">2</p>
          </Card>
          <Card className="text-center py-6 dark:bg-gray-800">
            <h3 className="text-gray-500 dark:text-gray-400">Frequência média</h3>
            <p className="text-3xl font-bold text-green-500">96%</p>
          </Card>
          <Card className="text-center py-6 dark:bg-gray-800">
            <h3 className="text-gray-500 dark:text-gray-400">Notas acima da média</h3>
            <p className="text-3xl font-bold text-blue-500">87%</p>
          </Card>
        </div>

        {/* Dica ou CTA final */}
        <div className="text-center mt-10">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Mantenha-se conectado ao desempenho dos seus filhos.
          </p>
          <Button href="/contato">
            Fale com a escola
          </Button>
        </div>
      </div>
    </>
  )
}
