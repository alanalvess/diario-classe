import {useEffect, useState} from "react";
import {Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import type {Disciplina} from "../../../models";
import {buscar, cadastrar, deletar} from "../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import {RotatingLines} from "react-loader-spinner";
import {useAuth} from "../../../contexts/UseAuth.ts";

export default function DisciplinasPage() {
  const {usuario, isHydrated, isAuthenticated} = useAuth();

  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 🔹 Buscar disciplinas
  useEffect(() => {
    if (!isHydrated || !isAuthenticated) return;
    buscar("/disciplinas", setDisciplinas, {headers: {Authorization: `Bearer ${usuario.token}`}});
  }, [isHydrated, isAuthenticated]);

  // 🔹 Criar disciplina
  async function salvarDisciplina() {
    if (!nome || !codigo) {
      ToastAlerta("⚠️ Nome e código são obrigatórios", Toast.Error);
      return;
    }

    const body = {nome, codigo};

    try {
      await cadastrar("/disciplinas", body, (novaDisciplina: Disciplina) => {
        setDisciplinas(prev => [...prev, novaDisciplina]);
        setNome("");
        setCodigo("");
        ToastAlerta("✅ Disciplina criada com sucesso", Toast.Success);
      }, {
        headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"}
      });
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao criar disciplina", Toast.Error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  // 🔹 Excluir disciplina
  async function excluirDisciplina(id: number) {
    try {
      await deletar(`/disciplinas/${id}`, {headers: {Authorization: `Bearer ${usuario.token}`}});
      setDisciplinas(prev => prev.filter(d => d.id !== id));
      ToastAlerta("✅ Disciplina excluída", Toast.Success);
    } catch (error) {
      if (error instanceof Error) {
        ToastAlerta("Erro ao excluir disciplina", Toast.Error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10">
      <h1 className="text-2xl font-bold mb-6">Gestão de Disciplinas</h1>

      {/* Formulário */}
      <div className="flex flex-col gap-2 mb-6">
        <input
          type="text"
          placeholder="Nome da disciplina"
          value={nome}
          onChange={e => setNome(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Código da disciplina"
          value={codigo}
          onChange={e => setCodigo(e.target.value)}
          className="border rounded p-2"
        />
        <Button onClick={salvarDisciplina}>
          {isLoading ?
            <RotatingLines
              strokeColor="white"
              strokeWidth="5"
              animationDuration="0.75"
              width="24"
              visible={true}
            /> :
            <span>Adicionar Disciplina</span>}
        </Button>
      </div>

      {/* Tabela */}
      {disciplinas.length > 0 && (
        <Table>
          <TableHead>
            <TableHeadCell>Nome</TableHeadCell>
            <TableHeadCell>Código</TableHeadCell>
            <TableHeadCell>Média da Turma</TableHeadCell>
            <TableHeadCell>Frequência Média</TableHeadCell>
            <TableHeadCell>Ações</TableHeadCell>
          </TableHead>
          <TableBody>
            {disciplinas.map((d, i) => (
              <TableRow key={i}>
                <TableCell>{d.nome}</TableCell>
                <TableCell>{d.codigo}</TableCell>
                <TableCell>{d.mediaTurma?.toFixed(1) ?? "—"}</TableCell>
                <TableCell>{d.frequenciaMedia?.toFixed(1) ?? "—"}%</TableCell>
                <TableCell>
                  <Button color="failure" size="xs" onClick={() => excluirDisciplina(d.id)}>Excluir</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
