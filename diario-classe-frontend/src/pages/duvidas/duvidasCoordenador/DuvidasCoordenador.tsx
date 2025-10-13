import {Accordion, AccordionContent, AccordionPanel, AccordionTitle} from "flowbite-react";
import {Roles} from "../../../enums/Roles.ts";
import AdicionaAluno from '../../../assets/images/duvidas/coordenador/adiciona-aluno.png'
import VisualizaAluno from '../../../assets/images/duvidas/coordenador/visualiza-aluno.png'
import GeraQRCoceAluno from '../../../assets/images/duvidas/coordenador/gera-qrcode-aluno.png'
import QRCoceAluno from '../../../assets/images/duvidas/coordenador/qrcode-aluno.png'
import AdicionaProfessor from '../../../assets/images/duvidas/coordenador/adiciona-professor.png'
import VisualizaProfessor from '../../../assets/images/duvidas/coordenador/visualiza-professor.png'
import ExcluiProfessor from '../../../assets/images/duvidas/coordenador/exclui-professor.png'
import AdicionaTurma from '../../../assets/images/duvidas/coordenador/adiciona-turma.png'
import VisualizaTurma from '../../../assets/images/duvidas/coordenador/visualiza-turma.png'
import ExcluiTurma from '../../../assets/images/duvidas/coordenador/exclui-turma.png'
import AdicionaDisciplina from '../../../assets/images/duvidas/coordenador/adiciona-disciplina.png'
import VisualizaDisciplina from '../../../assets/images/duvidas/coordenador/visualiza-disciplina.png'
import ExcluiDisciplina from '../../../assets/images/duvidas/coordenador/exclui-disciplina.png'
import Dashboard from '../../../assets/images/duvidas/coordenador/dashboard.png'
import Relatorios from '../../../assets/images/duvidas/coordenador/relatorios.png'

interface DuvidasCoordenadorProps {
  usuarioTipo: string;
}

function DuvidasCoordenador({usuarioTipo}: DuvidasCoordenadorProps) {

  return (
    <>
      {usuarioTipo === Roles.COORDENADOR && (
        <div className="max-w-4xl mx-auto mt-6 space-y-4">
          <h3 className='bg-gray-700 text-gray-100 p-2 text-2xl rounded-lg'>Sessão de Alunos</h3>
          <Accordion collapseAll>
            <AccordionPanel>
              <AccordionTitle theme={{flush: {off: "focus:ring-0"}}}>
                Como adicionar um aluno?
              </AccordionTitle>

              <AccordionContent className="bg-white dark:bg-gray-900 px-6 py-4 space-y-4 rounded-b-xl shadow-sm">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Para adicionar um novo aluno ao sistema, siga os passos abaixo:
                </p>

                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Acesse o menu lateral e clique em{" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">“Alunos”</span>.
                  </li>
                  <li>Preencha o formulário com os{" "}
                    <span className="font-semibold">dados obrigatórios</span> do aluno.
                  </li>
                  <li>Clique no botão{" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">“Adicionar Aluno”</span>
                    {" "} para salvar as informações.
                  </li>
                </ol>

                <div className="mt-4 flex justify-center">
                  <img
                    src={AdicionaAluno}
                    alt="Exemplo de formulário de adição de aluno"
                    className="rounded-xl shadow-md border border-gray-200 dark:border-gray-700 max-w-full lg:max-w-2xl"
                  />
                </div>
              </AccordionContent>
            </AccordionPanel>

            <AccordionPanel>
              <AccordionTitle theme={{flush: {off: "focus:ring-0"}}}>
                Como visualizar os alunos cadastrados?
              </AccordionTitle>

              <AccordionContent className="bg-white dark:bg-gray-900 px-6 py-4 space-y-4 rounded-b-xl shadow-sm">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Para visualizar todos os alunos cadastrados no sistema, siga os passos abaixo:
                </p>

                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Acesse o menu lateral e clique em{" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">“Alunos”</span>.
                  </li>
                  <li>A relação de alunos cadastrados localiza-se logo abaixo do {" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">“Formulário de Cadastro”</span>.
                  </li>
                </ol>

                <div className="mt-4 flex justify-center">
                  <img
                    src={VisualizaAluno}
                    alt="Exemplo de visualização de alunos cadastrados"
                    className="rounded-xl shadow-md border border-gray-200 dark:border-gray-700 max-w-full lg:max-w-2xl"
                  />
                </div>
              </AccordionContent>
            </AccordionPanel>

            <AccordionPanel>
              <AccordionTitle theme={{flush: {off: "focus:ring-0"}}}>
                Como excluir um aluno?
              </AccordionTitle>

              <AccordionContent className="bg-white dark:bg-gray-900 px-6 py-4 space-y-4 rounded-b-xl shadow-sm">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Para excluir o cadastro de um aluno, siga os passos abaixo:
                </p>

                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Acesse o menu lateral e clique em{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">“Alunos”</span>.
                  </li>
                  <li>A relação de alunos cadastrados localiza-se logo abaixo do {" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">“Formulário de Cadastro”</span>.
                  </li>
                  <li>Para cada aluno da lista, há um botão {" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">"Excluir"</span>.
                    <div className="mt-4 flex justify-center">
                      <img
                        src={GeraQRCoceAluno}
                        alt="Exemplo de exclusão de aluno"
                        className="rounded-xl shadow-md border border-gray-200 dark:border-gray-700 max-w-full lg:max-w-2xl"
                      />
                    </div>
                  </li>
                </ol>
              </AccordionContent>
            </AccordionPanel>

            <AccordionPanel>
              <AccordionTitle theme={{flush: {off: "focus:ring-0"}}}>
                Como emitir o QR Code individual de cada aluno?
              </AccordionTitle>

              <AccordionContent className="bg-white dark:bg-gray-900 px-6 py-4 space-y-4 rounded-b-xl shadow-sm">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Para imprimir o QR Code individual do aluno, siga os passos abaixo:
                </p>

                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Acesse o menu lateral e clique em{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">“Alunos”</span>.
                  </li>
                  <li>A relação de alunos cadastrados localiza-se logo abaixo do {" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">“Formulário de Cadastro”</span>.
                  </li>
                  <li>Para cada aluno da lista, há um botão {" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">"QR Code"</span>.
                    <div className="mt-4 flex justify-center">
                      <img
                        src={GeraQRCoceAluno}
                        alt="Exemplo de QR Code gerado para aluno"
                        className="rounded-xl shadow-md border border-gray-200 dark:border-gray-700 max-w-full lg:max-w-2xl"
                      />
                    </div>
                  </li>
                  <li>Clique no botão {" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">QR Code</span> do aluno desejado.
                  </li>
                  <li>Surge na tela o QR Code para uso individual do aluno.</li>
                  <li>Clique no botão {" "}
                    <span
                      className="font-semibold text-blue-600 dark:text-blue-400">Imprimir / Baixar QR Code</span> para
                    gerar um arquivo PDF.
                    <div className="mt-4 flex justify-center">
                      <img
                        src={QRCoceAluno}
                        alt="Exemplo de formulário de adição de aluno"
                        className="rounded-xl shadow-md border border-gray-200 dark:border-gray-700 max-w-full lg:max-w-2xl"
                      />
                    </div>
                  </li>
                </ol>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>

          <h3 className='bg-gray-700 text-gray-100 p-2 text-2xl rounded-lg'>Sessão de Professores</h3>
          <Accordion collapseAll>
            <AccordionPanel>
              <AccordionTitle theme={{flush: {off: "focus:ring-0"}}}>
                Como adicionar um professor?
              </AccordionTitle>

              <AccordionContent className="bg-white dark:bg-gray-900 px-6 py-4 space-y-4 rounded-b-xl shadow-sm">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Para cadastrar um novo professor, siga os passos abaixo.
                  É importante que as <span className="font-semibold">disciplinas</span> e
                  as <span className="font-semibold">turmas</span> já estejam previamente cadastradas no sistema.
                </p>

                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>No menu lateral, acesse{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">“Professores”</span>.
                  </li>
                  <li>No formulário, preencha os{" "}
                    <span className="font-semibold">dados obrigatórios</span> do professor (como nome, e-mail e senha).
                  </li>
                  <li>Selecione ao menos{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">uma disciplina</span>{" "}na lista.
                    <br/>
                    💡 Para selecionar mais de uma opção, mantenha a tecla{" "}
                    <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm font-mono">Ctrl</kbd>{" "}
                    pressionada enquanto clica nas disciplinas desejadas.
                  </li>
                  <li>
                    Opcionalmente, selecione também{" "}
                    <span className="font-semibold text-purple-600 dark:text-purple-400">uma ou mais turmas</span>
                    {" "} às quais o professor estará vinculado — também usando{" "}
                    <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm font-mono">Ctrl</kbd>{" "}
                    para múltipla seleção.
                  </li>
                  <li>Revise os dados e clique em{" "}
                    <span
                      className="font-semibold text-green-600 dark:text-green-400">“Adicionar Professor”</span>{" "} para
                    concluir o cadastro.
                  </li>
                </ol>

                <div className="mt-4 flex justify-center">
                  <img
                    src={AdicionaProfessor}
                    alt="Exemplo de formulário de cadastro de professor"
                    className="rounded-xl shadow-md border border-gray-200 dark:border-gray-700 max-w-full lg:max-w-2xl"
                  />
                </div>
              </AccordionContent>
            </AccordionPanel>

            <AccordionPanel>
              <AccordionTitle theme={{flush: {off: "focus:ring-0"}}}>
                Como visualizar os professores cadastrados?
              </AccordionTitle>

              <AccordionContent className="bg-white dark:bg-gray-900 px-6 py-4 space-y-4 rounded-b-xl shadow-sm">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Para visualizar todos os professores cadastrados no sistema, siga os passos abaixo:
                </p>

                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Acesse o menu lateral e clique em{" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">“Professores”</span>.
                  </li>
                  <li>A relação de professores cadastrados localiza-se logo abaixo do {" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">“Formulário de Cadastro”</span>.
                  </li>
                </ol>

                <div className="mt-4 flex justify-center">
                  <img
                    src={VisualizaProfessor}
                    alt="Exemplo de visualização de professores cadastrados"
                    className="rounded-xl shadow-md border border-gray-200 dark:border-gray-700 max-w-full lg:max-w-2xl"
                  />
                </div>
              </AccordionContent>
            </AccordionPanel>

            <AccordionPanel>
              <AccordionTitle theme={{flush: {off: "focus:ring-0"}}}>
                Como excluir um professor?
              </AccordionTitle>

              <AccordionContent className="bg-white dark:bg-gray-900 px-6 py-4 space-y-4 rounded-b-xl shadow-sm">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Para excluir o cadastro de um professor, siga os passos abaixo:
                </p>

                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Acesse o menu lateral e clique em{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">“Professores”</span>.
                  </li>
                  <li>A relação de professores cadastrados localiza-se logo abaixo do {" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">“Formulário de Cadastro”</span>.
                  </li>
                  <li>Para cada professor da lista, há um botão {" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">"Excluir"</span>.
                    <div className="mt-4 flex justify-center">
                      <img
                        src={ExcluiProfessor}
                        alt="Exemplo de Exclusão de professor"
                        className="rounded-xl shadow-md border border-gray-200 dark:border-gray-700 max-w-full lg:max-w-2xl"
                      />
                    </div>
                  </li>
                </ol>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>

          <h3 className='bg-gray-700 text-gray-100 p-2 text-2xl rounded-lg'>Sessão de Turmas</h3>
          <Accordion collapseAll>
            <AccordionPanel>
              <AccordionTitle theme={{flush: {off: "focus:ring-0"}}}>
                Como adicionar uma turma?
              </AccordionTitle>

              <AccordionContent className="bg-white dark:bg-gray-900 px-6 py-4 space-y-4 rounded-b-xl shadow-sm">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Para adicionar uma nova turma, siga os passos abaixo.
                  É importante que as <span className="font-semibold">disciplinas</span> já estejam previamente
                  cadastradas no sistema.
                </p>

                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>No menu lateral, acesse{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">“Turmas”</span>.
                  </li>
                  <li>No formulário, preencha os{" "}
                    <span className="font-semibold">dados obrigatórios</span> da Turma (como nome e ano de vigência).
                  </li>
                  <li>Selecione ao menos{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">uma disciplina</span>{" "}na lista.
                    <br/>
                    💡 Para selecionar mais de uma opção, mantenha a tecla{" "}
                    <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm font-mono">Ctrl</kbd>{" "}
                    pressionada enquanto clica nas disciplinas desejadas.
                  </li>
                  <li>
                    Opcionalmente, selecione também{" "}
                    <span className="font-semibold text-purple-600 dark:text-purple-400">um ou mais professores</span>
                    — também usando{" "}
                    <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm font-mono">Ctrl</kbd>{" "}
                    para múltipla seleção.
                  </li>
                  <li>Revise os dados e clique em{" "}
                    <span
                      className="font-semibold text-green-600 dark:text-green-400">“Adicionar Turma”</span>{" "} para
                    concluir o cadastro.
                  </li>
                </ol>

                <div className="mt-4 flex justify-center">
                  <img
                    src={AdicionaTurma}
                    alt="Exemplo de formulário de cadastro de turma"
                    className="rounded-xl shadow-md border border-gray-200 dark:border-gray-700 max-w-full lg:max-w-2xl"
                  />
                </div>
              </AccordionContent>
            </AccordionPanel>

            <AccordionPanel>
              <AccordionTitle theme={{flush: {off: "focus:ring-0"}}}>
                Como visualizar as turmas cadastradas?
              </AccordionTitle>

              <AccordionContent className="bg-white dark:bg-gray-900 px-6 py-4 space-y-4 rounded-b-xl shadow-sm">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Para visualizar todos as turmas cadastradas no sistema, siga os passos abaixo:
                </p>

                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Acesse o menu lateral e clique em{" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">“Turmas”</span>.
                  </li>
                  <li>A relação de turmas cadastradas localiza-se logo abaixo do {" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">“Formulário de Cadastro”</span>.
                  </li>
                </ol>

                <div className="mt-4 flex justify-center">
                  <img
                    src={VisualizaTurma}
                    alt="Exemplo de visualização de turmas cadastradas"
                    className="rounded-xl shadow-md border border-gray-200 dark:border-gray-700 max-w-full lg:max-w-2xl"
                  />
                </div>
              </AccordionContent>
            </AccordionPanel>

            <AccordionPanel>
              <AccordionTitle theme={{flush: {off: "focus:ring-0"}}}>
                Como excluir uma turma?
              </AccordionTitle>

              <AccordionContent className="bg-white dark:bg-gray-900 px-6 py-4 space-y-4 rounded-b-xl shadow-sm">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Para excluir o cadastro de uma turma, siga os passos abaixo:
                </p>

                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Acesse o menu lateral e clique em{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">“Turmas”</span>.
                  </li>
                  <li>A relação de turmas cadastrados localiza-se logo abaixo do {" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">“Formulário de Cadastro”</span>.
                  </li>
                  <li>Para cada turma da lista, há um botão {" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">"Excluir"</span>.
                    <div className="mt-4 flex justify-center">
                      <img
                        src={ExcluiTurma}
                        alt="Exemplo de exclusão de turma"
                        className="rounded-xl shadow-md border border-gray-200 dark:border-gray-700 max-w-full lg:max-w-2xl"
                      />
                    </div>
                  </li>
                </ol>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>

          <h3 className='bg-gray-700 text-gray-100 p-2 text-2xl rounded-lg'>Sessão de Disciplinas</h3>
          <Accordion collapseAll>
            <AccordionPanel>
              <AccordionTitle theme={{flush: {off: "focus:ring-0"}}}>
                Como adicionar uma disciplina?
              </AccordionTitle>

              <AccordionContent className="bg-white dark:bg-gray-900 px-6 py-4 space-y-4 rounded-b-xl shadow-sm">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Para adicionar uma nova disciplina, siga os passos abaixo:
                </p>

                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>No menu lateral, acesse{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">“Disciplinas”</span>.
                  </li>
                  <li>No formulário, preencha os{" "}
                    <span className="font-semibold">dados obrigatórios</span> da disciplina (nome e código).
                  </li>
                  <li>Revise os dados e clique em{" "}
                    <span
                      className="font-semibold text-green-600 dark:text-green-400">“Adicionar Disciplina”</span>{" "} para
                    concluir o cadastro.
                  </li>
                </ol>

                <div className="mt-4 flex justify-center">
                  <img
                    src={AdicionaDisciplina}
                    alt="Exemplo de formulário de cadastro de disciplina"
                    className="rounded-xl shadow-md border border-gray-200 dark:border-gray-700 max-w-full lg:max-w-2xl"
                  />
                </div>
              </AccordionContent>
            </AccordionPanel>

            <AccordionPanel>
              <AccordionTitle theme={{flush: {off: "focus:ring-0"}}}>
                Como visualizar as disciplinas cadastradas?
              </AccordionTitle>

              <AccordionContent className="bg-white dark:bg-gray-900 px-6 py-4 space-y-4 rounded-b-xl shadow-sm">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Para visualizar todos as disciplinas cadastradas no sistema, siga os passos abaixo:
                </p>

                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Acesse o menu lateral e clique em{" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">“Disciplinas”</span>.
                  </li>
                  <li>A relação de disciplinas cadastradas localiza-se logo abaixo do {" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">“Formulário de Cadastro”</span>.
                  </li>
                </ol>

                <div className="mt-4 flex justify-center">
                  <img
                    src={VisualizaDisciplina}
                    alt="Exemplo de visualização de disciplinas cadastradas"
                    className="rounded-xl shadow-md border border-gray-200 dark:border-gray-700 max-w-full lg:max-w-2xl"
                  />
                </div>
              </AccordionContent>
            </AccordionPanel>

            <AccordionPanel>
              <AccordionTitle theme={{flush: {off: "focus:ring-0"}}}>
                Como excluir uma Disciplina?
              </AccordionTitle>

              <AccordionContent className="bg-white dark:bg-gray-900 px-6 py-4 space-y-4 rounded-b-xl shadow-sm">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Para excluir o cadastro de uma disciplina, siga os passos abaixo:
                </p>

                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Acesse o menu lateral e clique em{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">“Disciplinas”</span>.
                  </li>
                  <li>A relação de disciplinas cadastrados localiza-se logo abaixo do {" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">“Formulário de Cadastro”</span>.
                  </li>
                  <li>Para cada disciplina da lista, há um botão {" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">"Excluir"</span>.
                    <div className="mt-4 flex justify-center">
                      <img
                        src={ExcluiDisciplina}
                        alt="Exemplo de exclusão de disciplina"
                        className="rounded-xl shadow-md border border-gray-200 dark:border-gray-700 max-w-full lg:max-w-2xl"
                      />
                    </div>
                  </li>
                </ol>
              </AccordionContent>
            </AccordionPanel>


          </Accordion>

          <h3 className='bg-gray-700 text-gray-100 p-2 text-2xl rounded-lg'>Sessão Dashboard</h3>
          <Accordion collapseAll>
            <AccordionPanel>
              <AccordionTitle theme={{flush: {off: "focus:ring-0"}}}>
                Como visualizar os principais dados estatísticos?
              </AccordionTitle>

              <AccordionContent className="bg-white dark:bg-gray-900 px-6 py-4 space-y-4 rounded-b-xl shadow-sm">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Para visualizar o dashboard da coordenação, siga os passos abaixo:
                </p>

                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>No menu lateral, acesse{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">“Dashboard”</span>.
                  </li>
                  <li>Cada gráfico ou tabela representa um dado importante para gestão da escola.</li>
                </ol>

                <div className="mt-4 flex justify-center">
                  <img
                    src={Dashboard}
                    alt="Exemplo de como visualizar dados em gráficos"
                    className="rounded-xl shadow-md border border-gray-200 dark:border-gray-700 max-w-full lg:max-w-2xl"
                  />
                </div>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>

          <h3 className='bg-gray-700 text-gray-100 p-2 text-2xl rounded-lg'>Sessão Relatórios</h3>
          <Accordion collapseAll>
            <AccordionPanel>
              <AccordionTitle theme={{flush: {off: "focus:ring-0"}}}>
                Como emitir relatórios?
              </AccordionTitle>

              <AccordionContent className="bg-white dark:bg-gray-900 px-6 py-4 space-y-4 rounded-b-xl shadow-sm">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Para relatórios em arquivos PDF ou de Planilhas Eletrônicas, siga os passos abaixo:
                </p>

                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>No menu lateral, acesse{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">“Relatórios”</span>.
                  </li>
                  <li>Selecione os dados que deseja.</li>
                  <li>Clique no botão do tipo de arquivo{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">“Gerar PDF”</span> ou {" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">“Gerar Excel”</span>.
                  </li>
                  <li>Salve ou imprima o arquivo gerado.</li>
                  <p>
                    💡 Os relatórios devem ser previamente solicitados ao setor de TI. No exemplo, está a relação de alunos por turma.
                  </p>
                </ol>

                <div className="mt-4 flex justify-center">
                  <img
                    src={Relatorios}
                    alt="Exemplo de como emitir relatórios"
                    className="rounded-xl shadow-md border border-gray-200 dark:border-gray-700 max-w-full lg:max-w-2xl"
                  />
                </div>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
        </div>
      )}
    </>
  );
}

export default DuvidasCoordenador;