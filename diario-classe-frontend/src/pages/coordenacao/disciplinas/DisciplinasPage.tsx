import { useEffect, useState, useContext } from "react";
import { Button, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from "flowbite-react";
import {AuthContext} from "../../../contexts/AuthContext.tsx";
import {Disciplina} from "../../../models";
import {buscar, cadastrar, deletar} from "../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";

export default function DisciplinasPage() {
  const { usuario, isHydrated } = useContext(AuthContext);
  const token = usuario.token;

  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");

  // 🔹 Buscar disciplinas
  useEffect(() => {
    if (!isHydrated || !token) return;
    buscar("/disciplinas", setDisciplinas, { headers: { Authorization: `Bearer ${token}` } });
  }, [isHydrated, token]);

  // 🔹 Criar disciplina
  async function salvarDisciplina() {
    if (!nome || !codigo) {
      ToastAlerta("⚠️ Nome e código são obrigatórios", Toast.Error);
      return;
    }

    const body = { nome, codigo };

    try {
      await cadastrar("/disciplinas", body, (novaDisciplina: Disciplina) => {
        setDisciplinas(prev => [...prev, novaDisciplina]);
        setNome("");
        setCodigo("");
        ToastAlerta("✅ Disciplina criada com sucesso", Toast.Success);
      }, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      });
    } catch (err) {
      ToastAlerta("Erro ao criar disciplina", Toast.Error);
    }
  }

  // 🔹 Excluir disciplina
  async function excluirDisciplina(id: number) {
    try {
      await deletar(`/disciplinas/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setDisciplinas(prev => prev.filter(d => d.id !== id));
      ToastAlerta("✅ Disciplina excluída", Toast.Success);
    } catch (err) {
      ToastAlerta("Erro ao excluir disciplina", Toast.Error);
    }
  }

  return (
    <div className="p-6 pt-28">
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
        <Button color="success" onClick={salvarDisciplina}>Adicionar Disciplina</Button>
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
