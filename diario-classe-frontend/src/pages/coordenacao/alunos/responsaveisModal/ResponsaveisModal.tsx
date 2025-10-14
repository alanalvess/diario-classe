import {useEffect, useState} from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput
} from "flowbite-react";
import {FaTrashAlt} from "react-icons/fa";
import {buscar, cadastrar, deletar} from "../../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../../utils/ToastAlerta.ts";
import {useAuth} from "../../../../contexts/UseAuth.ts";
import type {Responsavel} from "../../../../models";

interface ResponsaveisModalProps {
  show: boolean;
  onClose: () => void;
  alunoId: number;
  alunoNome: string;
}

export default function ResponsaveisModal({ show, onClose, alunoId, alunoNome }: ResponsaveisModalProps) {
  const {usuario} = useAuth();
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Buscar responsáveis do aluno
  async function listarResponsaveis() {
    try {
      setLoading(true);
      await buscar(`/alunos/${alunoId}/responsaveis`, setResponsaveis, {
        headers: {authorization: `Bearer ${usuario.token}`},
      });
    } catch {
      ToastAlerta("Erro ao carregar responsáveis", Toast.Error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (show) {
      listarResponsaveis();
    }
  }, [show]);

  // 🔹 Adicionar responsável
  async function salvarResponsavel() {
    if (!nome || !email || !telefone) {
      ToastAlerta("Preencha todos os campos", Toast.Error);
      return;
    }

    const body = { nome, email, telefone };

    try {
      await cadastrar(`/responsaveis/aluno/${alunoId}`, body, (novo: Responsavel) => {
        setResponsaveis(prev => [...prev, novo]);
        setNome("");
        setEmail("");
        setTelefone("");
        ToastAlerta("Responsável adicionado com sucesso", Toast.Success);
        listarResponsaveis();
      }, {headers: {Authorization: `Bearer ${usuario.token}`}});
    } catch {
      ToastAlerta("Erro ao adicionar responsável", Toast.Error);
    }
  }

  // 🔹 Excluir responsável
  async function removerResponsavel(id: number) {
    try {
      await deletar(`/responsaveis/${id}`, {headers: {Authorization: `Bearer ${usuario.token}`}});
      setResponsaveis(prev => prev.filter(r => r.id !== id));
      ToastAlerta("Responsável removido", Toast.Success);
    } catch {
      ToastAlerta("Erro ao remover responsável", Toast.Error);
    }
  }

  return (
    <Modal show={show} onClose={onClose}>
      <ModalHeader>Responsáveis do(a) Aluno(a) {alunoNome}</ModalHeader>
      <ModalBody>
        <div className="flex flex-col gap-3 mb-4">
          <TextInput placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
          <TextInput placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <TextInput placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} />
          <Button onClick={salvarResponsavel}>Adicionar</Button>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>Nome</TableHeadCell>
              <TableHeadCell>Email</TableHeadCell>
              <TableHeadCell>Telefone</TableHeadCell>
              <TableHeadCell>Ações</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {responsaveis.map(r => (
              <TableRow key={r.id}>
                <TableCell>{r.nome}</TableCell>
                <TableCell>{r.email}</TableCell>
                <TableCell>{r.telefone}</TableCell>
                <TableCell>
                  <Button color="failure" size="xs" onClick={() => removerResponsavel(r.id)}>
                    <FaTrashAlt size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ModalBody>
    </Modal>
  );
}
