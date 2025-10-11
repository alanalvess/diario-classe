import {Accordion, AccordionContent, AccordionPanel, AccordionTitle} from "flowbite-react";
import {Roles} from "../../../enums/Roles.ts";

interface DuvidasProfessorProps {
  usuarioTipo: Roles;
}

function DuvidasProfessor({usuarioTipo}: DuvidasProfessorProps) {

  return (
    <>
      {usuarioTipo === Roles.PROFESSOR && (
        <div className="max-w-4xl mx-auto mt-6 space-y-4">
          <Accordion
            collapseAll
            theme={{
              flush: {
                off: "rounded-none border-none",
                on: "border-none"
              }
            }}
          >
            <AccordionPanel>
              <AccordionTitle
                theme={{
                  base: "first:rounded-none last:rounded-none",
                  flush: {
                    off: "focus:ring-0",
                  },
                }}
              >
                Como lançar notas
              </AccordionTitle>
              <AccordionContent>
                <p>
                  Vá até a turma desejada, selecione a disciplina, clique no aluno
                  e registre as notas.
                </p>
              </AccordionContent>
            </AccordionPanel>

            <AccordionPanel>
              <AccordionTitle
                theme={{
                  base: "first:rounded-none last:rounded-none",
                  flush: {
                    off: "focus:ring-0",
                  },
                }}
              >
                Como fazer chamada
              </AccordionTitle>
              <AccordionContent>
                <p>
                  Na aba de Frequência, selecione a turma e marque a presença ou
                  ausência dos alunos.
                </p>
              </AccordionContent>
            </AccordionPanel>

            <AccordionPanel>
              <AccordionTitle
                theme={{
                  base: "first:rounded-none last:rounded-none",
                  flush: {
                    off: "focus:ring-0",
                  },
                }}
              >
                Como adicionar observações
              </AccordionTitle>
              <AccordionContent>
                <p>
                  No menu da turma, clique em "Observações", selecione o aluno e
                  registre observações relevantes.
                </p>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
        </div>
      )}
    </>
  );
}

export default DuvidasProfessor;
