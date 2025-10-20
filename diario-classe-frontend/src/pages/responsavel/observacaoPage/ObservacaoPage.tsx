import {useEffect, useState} from "react";
import {Badge, Card, Spinner, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import {FaBookOpen, FaStickyNote, FaUserTie} from "react-icons/fa";
import {useAuth} from "../../../contexts/UseAuth.ts";
import {buscar} from "../../../services/Service.ts";
import type {Aluno, Observacao, Responsavel} from "../../../models";
import {CategoriaObservacao} from "../../../enums/CategoriaObservacao.ts";
import SelectField from "../../../components/form/SelectField.tsx";
import {CategoriasAgrupadas} from "../../../utils/CategoriasAgrupadas.ts";

export default function ObservacoesPage() {
  const {usuario, isAuthenticated} = useAuth();
  const [observacoes, setObservacoes] = useState<Observacao[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responsavel, setResponsavel] = useState<Responsavel>();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState<string>("");


  async function buscarResponsavelPorEmail() {
    try {
      await buscar(`/responsaveis/email/${usuario.email}`, setResponsavel, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function buscarAlunosDoResponsavel() {
    try {
      await buscar(`/responsaveis/${responsavel.id}/alunos`, setAlunos, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function carregarObservacoes() {
    if (!alunoSelecionado) return;
    setIsLoading(true);

    try {
      await buscar(`/observacoes/aluno/${alunoSelecionado}`, setObservacoes, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
          "Content-Type": "application/json",
        }
      });
    } catch (error) {
      console.error("Erro ao carregar observações:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!usuario?.email) return;
    buscarResponsavelPorEmail();
  }, [usuario, isAuthenticated]);

  useEffect(() => {
    if (!responsavel?.email) return;
    buscarAlunosDoResponsavel();
  }, [responsavel, isAuthenticated]);

  useEffect(() => {
    carregarObservacoes();
  }, [alunoSelecionado, isAuthenticated]);

  return (
    <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10">
      <Card className="p-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Observações sobre o Aluno
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Veja os registros feitos pelos professores ao longo do período letivo.
        </p>
      </Card>

      <div className="mt-8 flex justify-center">
        <SelectField
          label="Aluno"
          name="aluno"
          required
          value={alunoSelecionado}
          onChange={(e) => setAlunoSelecionado(e.target.value)}
          options={alunos.map((a) => ({
            value: a.id.toString(), // garante que o valor é string
            label: a.nome,
          }))}
          // className="w-80"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center mt-10">
          <Spinner size="xl" />
        </div>
      ) : (
        alunoSelecionado && (
          <Card className="p-6 mt-10 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <FaStickyNote className="text-3xl text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Anotações Recentes
              </h2>
            </div>

            {observacoes.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-400 py-6">
                Nenhuma observação registrada até o momento.
              </p>
            ) : (
              <Table hoverable>
                <TableHead>
                  <TableHeadCell>Data</TableHeadCell>
                  <TableHeadCell>Disciplina</TableHeadCell>
                  <TableHeadCell>Professor</TableHeadCell>
                  <TableHeadCell>Categoria</TableHeadCell>
                  <TableHeadCell>Descrição</TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                  {observacoes.map((obs) => (
                    <TableRow
                      key={obs.id}
                      className="bg-white dark:bg-gray-700 dark:border-gray-600"
                    >
                      {/* 🗓️ Data */}
                      <TableCell className="text-gray-800 dark:text-gray-100">
                        {new Date(obs.data).toLocaleDateString("pt-BR")}
                      </TableCell>

                      {/* 📘 Disciplina */}
                      <TableCell className="text-gray-800 dark:text-gray-100">
                        <div className="flex items-center gap-2">
                          {obs.disciplinaNome || "-"}
                        </div>
                      </TableCell>

                      {/* 👔 Professor */}
                      <TableCell className="text-gray-800 dark:text-gray-100">
                        <div className="flex items-center gap-2">
                          {obs.professorNome || "-"}
                        </div>
                      </TableCell>

                      {/* 🏷️ Categoria */}
                      <TableCell>
                        {Object.entries(CategoriasAgrupadas).map(
                          ([grupo, categorias]) => {
                            if (
                              categorias.includes(
                                obs.categoria as CategoriaObservacao
                              )
                            ) {
                              let color:
                                | "success"
                                | "failure"
                                | "info"
                                | "secondary" = "info";
                              switch (grupo) {
                                case "Acadêmicas":
                                  color = "info";
                                  break;
                                case "Comportamentais":
                                  color = "failure";
                                  break;
                                case "Socioemocionais":
                                  color = "success";
                                  break;
                                case "Administrativas":
                                  color = "secondary";
                                  break;
                              }

                              return (
                                <Badge key={obs.id} color={color}>
                                  {obs.categoria
                                      .charAt(0)
                                      .toUpperCase() +
                                    obs.categoria
                                      .slice(1)
                                      .toLowerCase()
                                      .replaceAll("_", " ")}
                                </Badge>
                              );
                            }
                            return null;
                          }
                        )}
                      </TableCell>

                      {/* 📝 Descrição */}
                      <TableCell className="max-w-md text-gray-700 dark:text-gray-200">
                        {obs.descricao}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        )
      )}


    </div>
  );
}
