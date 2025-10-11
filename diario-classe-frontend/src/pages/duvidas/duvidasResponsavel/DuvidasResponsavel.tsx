import {Accordion, AccordionContent, AccordionPanel, AccordionTitle} from "flowbite-react";
import {Roles} from "../../../enums/Roles.ts";

interface DuvidasResponsavelProps {
  usuarioTipo: Roles;
}

function DuvidasResponsavel({usuarioTipo}: DuvidasResponsavelProps) {

  return (
    <>
      {usuarioTipo === Roles.RESPONSAVEL && (
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
                Como consultar notas do aluno
              </AccordionTitle>
              <AccordionContent>
                <p>
                  No seu painel, selecione o aluno e acesse a aba de Notas para
                  acompanhar o desempenho.
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
                Como acompanhar frequência
              </AccordionTitle>
              <AccordionContent>
                <p>
                  Acesse a aba de Frequência do aluno para verificar presença e
                  ausência em cada disciplina.
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
                Como visualizar observações
              </AccordionTitle>
              <AccordionContent>
                <p>
                  Na aba de Observações, veja comentários feitos pelos professores
                  sobre o aluno.
                </p>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
        </div>
      )}
    </>
  );
}

export default DuvidasResponsavel;
