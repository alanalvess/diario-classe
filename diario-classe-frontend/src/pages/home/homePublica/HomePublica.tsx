import {Link} from 'react-router-dom';
import {Button, Card} from "flowbite-react";
import {FaChartBar, FaClipboardList, FaSchool} from "react-icons/fa";

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 md:px-60 px-5">
        <section className="bg-gray-100 dark:bg-gray-900 text-center py-20 mt-16">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            O Diário de Classe Digital da sua escola 🏫
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Gerencie presenças, notas e relatórios de forma simples e integrada.
            Um sistema moderno para professores e gestores escolares.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/login">
              <Button className="bg-green-600 hover:bg-green-700 px-6 py-3 text-lg">Entrar</Button>
            </Link>
            <Link to="/sobre">
              <Button color="light" className="px-6 py-3 text-lg">Saiba Mais</Button>
            </Link>
          </div>
        </section>

        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-12">
              Tudo o que você precisa em um só lugar
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-5">
              <Card>
                <FaClipboardList className="text-green-600 text-4xl mb-3" />
                <h3 className="text-xl font-semibold">Chamadas Digitais</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Registre presenças com rapidez e evite planilhas manuais.
                </p>
              </Card>

              <Card>
                <FaChartBar className="text-blue-600 text-4xl mb-3" />
                <h3 className="text-xl font-semibold">Notas e Avaliações</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Controle o desempenho dos alunos com relatórios inteligentes.
                </p>
              </Card>

              <Card>
                <FaSchool className="text-green-600 text-4xl mb-3" />
                <h3 className="text-xl font-semibold">Gestão Escolar</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Professores, turmas e alunos integrados em um sistema único.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="bg-gray-100 dark:bg-gray-900 py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
            Simples de usar em 3 passos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-5">
            <Card><span className="text-2xl font-bold">1️⃣</span><p>Faça login com seu usuário</p></Card>
            <Card><span className="text-2xl font-bold">2️⃣</span><p>Selecione sua turma e registre presença</p></Card>
            <Card><span className="text-2xl font-bold">3️⃣</span><p>Lance notas e acompanhe relatórios</p></Card>
          </div>
        </section>

      </div>
    </>
  )
}
