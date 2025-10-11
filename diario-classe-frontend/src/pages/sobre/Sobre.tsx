import {FaBullseye, FaHistory, FaUsers} from "react-icons/fa";

function Sobre() {
  return (
      <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10 space-y-16">


      {/* Cabeçalho */}
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
          Sobre Nosso Sistema
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Uma solução pensada para facilitar a gestão acadêmica e o acompanhamento
          de alunos.
        </p>
      </header>

      {/* História / Origem */}
      <section className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center space-x-3">
          <FaHistory className="text-rose-400 text-2xl" />
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Nossa História
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Este projeto nasceu como um trabalho acadêmico, desenvolvido com o
          objetivo de aplicar conhecimentos em desenvolvimento de sistemas e
          gestão escolar. Durante o processo, o sistema evoluiu para uma ferramenta
          funcional, capaz de auxiliar coordenações, professores, alunos e
          responsáveis em suas atividades diárias.
        </p>
      </section>

      {/* Objetivo */}
      <section className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center space-x-3">
          <FaBullseye className="text-blue-400 text-2xl" />
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Nosso Objetivo
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          O principal objetivo do sistema é centralizar informações acadêmicas,
          permitindo que responsáveis, alunos e coordenadores tenham acesso rápido
          e confiável a dados sobre notas, frequência e observações. A proposta é
          tornar a gestão escolar mais eficiente e a comunicação mais transparente.
        </p>
      </section>

      {/* Equipe / Responsáveis */}
      <section className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center space-x-3">
          <FaUsers className="text-green-400 text-2xl" />
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Equipe do Projeto
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Desenvolvido como parte do curso de Engenharia de Computação, este projeto contou
          com a dedicação de estudantes comprometidos em criar soluções práticas
          para a educação.
        </p>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
          <li>Alan Alves</li>
          <li>Brian Schneider</li>
          <li>Jair Batista</li>
        </ul>
      </section>
    </div>
  );
}

export default Sobre;