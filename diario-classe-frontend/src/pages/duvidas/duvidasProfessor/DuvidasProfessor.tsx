import {Accordion, AccordionContent, AccordionPanel, AccordionTitle} from "flowbite-react";
import {Roles} from "../../../enums/Roles.ts";
import PresencaManual from "../../../assets/images/duvidas/professor/presenca-manual.png";
import MarcaPresenca from "../../../assets/images/duvidas/professor/marca-presenca.png";
import PresencaQRCode from "../../../assets/images/duvidas/professor/presenca-qrcode.png";
import LerQRCode from "../../../assets/images/duvidas/professor/ler-qrcode.png";
import RegistroNotas from "../../../assets/images/duvidas/professor/registro-notas.png";
import AlteraNotas from "../../../assets/images/duvidas/professor/altera-notas.png";
import RegistraObservacao from "../../../assets/images/duvidas/professor/registra-observacao.png";
import VisualizaObservacao from "../../../assets/images/duvidas/professor/visualiza-observacoes.png";
import ExcluiObservacao from "../../../assets/images/duvidas/professor/exclui-observacao.png";
import AdicionaAvaliacao from "../../../assets/images/duvidas/professor/adiciona-avaliacao.png";
import VisualizaAvaliacao from "../../../assets/images/duvidas/professor/visualiza-avaliacao.png";
import ExcluiAvaliacao from "../../../assets/images/duvidas/professor/exclui-avaliacao.png";
import Dashboard from "../../../assets/images/duvidas/professor/dasboard-professor.png";

interface DuvidasProfessorProps {
  usuarioTipo: Roles;
}

function DuvidasProfessor({usuarioTipo}: DuvidasProfessorProps) {

  return (
    <>
      {usuarioTipo === Roles.PROFESSOR && (
        <div className="max-w-4xl mx-auto mt-6 space-y-4">
          <h3 className='bg-gray-700 text-gray-100 p-2 text-2xl rounded-lg'>Sessão de Presença</h3>
          <Accordion collapseAll>
            <AccordionPanel>
              <AccordionTitle theme={{flush: {off: "focus:ring-0"}}}>
                Como marcar presença manualmente?
              </AccordionTitle>

              <AccordionContent className="bg-white dark:bg-gray-900 px-6 py-4 space-y-4 rounded-b-xl shadow-sm">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Para registrar presença para cada aluno, siga os passos abaixo:
                </p>

                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Acesse o menu lateral e clique em{" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">“Presença / QR”</span>.
                  </li>
                  <li>Selecione a turma, a data da chamada e clique no botão{" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">“Carregar alunos”</span>
                    {" "} para listar os alunos da turma.
                    <div className="mt-4 flex justify-center">
                      <img
                        src={PresencaManual}
                        alt="Exemplo de formulário de adição de aluno"
                        className="rounded-xl shadow-md border border-gray-200 dark:border-gray-700 max-w-full lg:max-w-2xl"
                      />
                    </div>
                  </li>
                  <li>Marque o aluno que deseja marcar presença e clique no botão{" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">“Salvar”</span>.
                    <div className="mt-4 flex justify-center">
                      <img
                        src={MarcaPresenca}
                        alt="Exemplo de marcar presença manual para o aluno"
                        className="rounded-xl shadow-md border border-gray-200 dark:border-gray-700 max-w-full lg:max-w-2xl"
                      />
                    </div>
                  </li>
                </ol>

              </AccordionContent>
            </AccordionPanel>

            <AccordionPanel>
              <AccordionTitle theme={{flush: {off: "focus:ring-0"}}}>
                Como marcar presença via QR Code?
              </AccordionTitle>

              <AccordionContent className="bg-white dark:bg-gray-900 px-6 py-4 space-y-4 rounded-b-xl shadow-sm">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Para registrar presença dos alunos via QRCode, siga os passos abaixo:
                </p>

                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Acesse o menu lateral e clique em{" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">“Alunos”</span>.
                  </li>
                  <li>Clique no botão {" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">“Ler QR Code”</span>.
                    <div className="mt-4 flex justify-center">
                      <img
                        src={PresencaQRCode}
                        alt="Exemplo de visualização de alunos cadastrados"
                        className="rounded-xl shadow-md border border-gray-200 dark:border-gray-700 max-w-full lg:max-w-2xl"
                      />
                    </div>
                  </li>
                  <li>Surge na tela o leitor de QR Code utilizando a câmera do dispositivo.
                    <div className="mt-4 flex justify-center">
                      <img
                        src={LerQRCode}
                        alt="Exemplo de visualização de alunos cadastrados"
                        className="rounded-xl shadow-md border border-gray-200 dark:border-gray-700 max-w-full lg:max-w-2xl"
                      />
                    </div>
                  </li>
                </ol>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>

          <h3 className='bg-gray-700 text-gray-100 p-2 text-2xl rounded-lg'>Sessão de Notas</h3>
          <Accordion collapseAll>
            <AccordionPanel>
              <AccordionTitle theme={{flush: {off: "focus:ring-0"}}}>
                Como registrar as notas de uma avaliação?
              </AccordionTitle>

              <AccordionContent className="bg-white dark:bg-gray-900 px-6 py-4 space-y-4 rounded-b-xl shadow-sm">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Para registrar as notas de uma avaliação, siga os passos abaixo:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Acesse o menu lateral e clique em{" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">“Notas”</span>.
                  </li>
                  <li>Selecione a turma, a disciplina, a avaliação e clique em {" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">“Carregar Notas”</span>.
                    <div className="mt-4 flex justify-center">
                      <img
                        src={RegistroNotas}
                        alt="Exemplo de formulário de adição de aluno"
                        className="rounded-xl shadow-md border border-gray-200 dark:border-gray-700 max-w-full lg:max-w-2xl"
                      />
                    </div>
                  </li>
                  <li>Digite a nota do aluno e clique no botão{" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">“Salvar”</span>.
                    <div className="mt-4 flex justify-center">
                      <img
                        src={AlteraNotas}
                        alt="Exemplo de marcar presença manual para o aluno"
                        className="rounded-xl shadow-md border border-gray-200 dark:border-gray-700 max-w-full lg:max-w-2xl"
                      />
                    </div>
                  </li>
                </ol>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>

          <h3 className='bg-gray-700 text-gray-100 p-2 text-2xl rounded-lg'>Sessão de Observações</h3>
          <Accordion collapseAll>
            <AccordionPanel>
              <AccordionTitle theme={{flush: {off: "focus:ring-0"}}}>
                Como acrescentar uma observação?
              </AccordionTitle>

              <AccordionContent className="bg-white dark:bg-gray-900 px-6 py-4 space-y-4 rounded-b-xl shadow-sm">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Para adicionar uma anotação para um aluno, siga os passos abaixo.
                </p>

                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>No menu lateral, acesse{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">“Observações”</span>.
                  </li>
                  <li>Selecione a turma, a disciplina e o aluno desejado.</li>
                  <li>No formulário, selecione a data e a categoria da anotação.</li>
                  <li>Descreva a ocorrência e clique no botão {" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">"Salvar Observação"</span>.
                  </li>
                </ol>

                <div className="mt-4 flex justify-center">
                  <img
                    src={RegistraObservacao}
                    alt="Exemplo de formulário de cadastro de observação"
                    className="rounded-xl shadow-md border border-gray-200 dark:border-gray-700 max-w-full lg:max-w-2xl"
                  />
                </div>
              </AccordionContent>
            </AccordionPanel>

            <AccordionPanel>
              <AccordionTitle theme={{flush: {off: "focus:ring-0"}}}>
                Como visualizar as anotações registradas?
              </AccordionTitle>

              <AccordionContent className="bg-white dark:bg-gray-900 px-6 py-4 space-y-4 rounded-b-xl shadow-sm">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Para visualizar as observações registradas no sistema, siga os passos abaixo:
                </p>

                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Acesse o menu lateral e clique em{" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">“Observações”</span>.
                  </li>
                  <li>Selecione a turma, a disciplina e/ou o aluno desejado.</li>

                  <li>A relação de observações cadastradas localiza-se logo abaixo do {" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">“Formulário de Cadastro”</span>.
                  </li>
                </ol>

                <div className="mt-4 flex justify-center">
                  <img
                    src={VisualizaObservacao}
                    alt="Exemplo de visualização de observações cadastradas"
                    className="rounded-xl shadow-md border border-gray-200 dark:border-gray-700 max-w-full lg:max-w-2xl"
                  />
                </div>
              </AccordionContent>
            </AccordionPanel>

            <AccordionPanel>
              <AccordionTitle theme={{flush: {off: "focus:ring-0"}}}>
                Como excluir uma observação?
              </AccordionTitle>

              <AccordionContent className="bg-white dark:bg-gray-900 px-6 py-4 space-y-4 rounded-b-xl shadow-sm">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Para excluir o cadastro de uma turma, siga os passos abaixo:
                </p>

                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Acesse o menu lateral e clique em{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">“Observações”</span>.
                  </li>
                  <li>Selecione a turma, a disciplina e/ou o aluno desejado.</li>

                  <li>A relação de observações cadastrados localiza-se logo abaixo do {" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">“Formulário de Cadastro”</span>.
                  </li>
                  <li>Para cada observação da lista, há um botão {" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">"Excluir"</span>.
                    <div className="mt-4 flex justify-center">
                      <img
                        src={ExcluiObservacao}
                        alt="Exemplo de exclusão de observação"
                        className="rounded-xl shadow-md border border-gray-200 dark:border-gray-700 max-w-full lg:max-w-2xl"
                      />
                    </div>
                  </li>
                </ol>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>

          <h3 className='bg-gray-700 text-gray-100 p-2 text-2xl rounded-lg'>Sessão de Avaliações</h3>
          <Accordion collapseAll>
            <AccordionPanel>
              <AccordionTitle theme={{flush: {off: "focus:ring-0"}}}>
                Como adicionar uma avaliação ou outras atividades?
              </AccordionTitle>

              <AccordionContent className="bg-white dark:bg-gray-900 px-6 py-4 space-y-4 rounded-b-xl shadow-sm">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Para adicionar uma nova avaliação, siga os passos abaixo.
                  É importante que as <span className="font-semibold">Turmas</span> e
                  as <span className="font-semibold">Disciplinas</span> já estejam previamente cadastradas no sistema.
                </p>

                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>No menu lateral, acesse{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">“Avaliações”</span>.
                  </li>
                  <li>Selecione a Turma e a Disciplina.</li>
                  <li>No formulário, preencha o título, data de aplicação, o peso da atividade e clique em{" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">"Salvar Avaliações"</span>.
                  </li>
                </ol>

                <div className="mt-4 flex justify-center">
                  <img
                    src={AdicionaAvaliacao}
                    alt="Exemplo de formulário de cadastro de avaliação"
                    className="rounded-xl shadow-md border border-gray-200 dark:border-gray-700 max-w-full lg:max-w-2xl"
                  />
                </div>
              </AccordionContent>
            </AccordionPanel>

            <AccordionPanel>
              <AccordionTitle theme={{flush: {off: "focus:ring-0"}}}>
                Como visualizar as avaliações cadastradas?
              </AccordionTitle>

              <AccordionContent className="bg-white dark:bg-gray-900 px-6 py-4 space-y-4 rounded-b-xl shadow-sm">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Para visualizar as avaliações de cada disciplina, siga os passos abaixo:
                </p>

                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Acesse o menu lateral e clique em{" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">“Avaliações”</span>.
                  </li>
                  <li>Selecione a turma e a disciplina.</li>

                  <li>A relação de atividades avaliativas localiza-se logo abaixo do {" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">“Formulário de Cadastro”</span>.
                  </li>
                </ol>

                <div className="mt-4 flex justify-center">
                  <img
                    src={VisualizaAvaliacao}
                    alt="Exemplo de visualização de observações cadastradas"
                    className="rounded-xl shadow-md border border-gray-200 dark:border-gray-700 max-w-full lg:max-w-2xl"
                  />
                </div>
              </AccordionContent>
            </AccordionPanel>

            <AccordionPanel>
              <AccordionTitle theme={{flush: {off: "focus:ring-0"}}}>
                Como excluir uma avaliação?
              </AccordionTitle>

              <AccordionContent className="bg-white dark:bg-gray-900 px-6 py-4 space-y-4 rounded-b-xl shadow-sm">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Para excluir uma avaliação do sistema, siga os passos abaixo:
                </p>

                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Acesse o menu lateral e clique em{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">“Avaliações”</span>.
                  </li>
                  <li>Selecione a turma e a disciplina.</li>

                  <li>A relação de observações cadastrados localiza-se logo abaixo do {" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">“Formulário de Cadastro”</span>.
                  </li>
                  <li>Para cada avaliação da lista, há um botão {" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">"Excluir"</span>.
                    <div className="mt-4 flex justify-center">
                      <img
                        src={ExcluiAvaliacao}
                        alt="Exemplo de exclusão de observação"
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
                  <li>Cada gráfico ou tabela representa um dado importante para gestão da sala de aula.</li>
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

        </div>
      )}
    </>
  );
}

export default DuvidasProfessor;
