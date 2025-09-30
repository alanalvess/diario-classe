import {useContext, useEffect, useState} from "react";
import {
  Table,
  Button,
  Checkbox,
  Modal,
  Label,
  TextInput,
  ModalHeader,
  ModalBody,
  TableHead,
  TableHeadCell, TableBody, TableRow, TableCell
} from "flowbite-react";
import { QrReader } from "react-qr-reader";
import {buscar, cadastrar} from "../services/Service.ts";
import {Toast, ToastAlerta} from "../utils/ToastAlerta.ts";
import {AuthContext} from "../contexts/AuthContext.tsx";
import Aluno from "../models/Aluno.ts"; // precisa instalar: npm install react-qr-reader

export default function RegistroPresencaPage() {
  const {usuario, handleLogout, isHydrated} = useContext(AuthContext);
  const token = usuario.token;

  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [qrOpen, setQrOpen] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function buscarAlunos() {
    try {
      setIsLoading(true);
      await buscar('/presencas/turma/1', setAlunos, {headers: {Authorization: `Bearer ${token}`}});
    } catch (error: any) {
      if (error.toString().includes('403')) {
        ToastAlerta('O token expirou, favor logar novamente', Toast.Error);
        handleLogout();
      } else {
        ToastAlerta("Não há alunos matriculados nesta turma", Toast.Info);
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isHydrated && token !== '') {
      buscarAlunos();
    }
  }, [token, isHydrated]);

  async function registrarPresenca(aluno: Aluno) {
    const body = {
      data: new Date().toISOString().split("T")[0],
      presente: aluno.presente,
      alunoId: aluno.id,
      turmaId: aluno.turmaId,
      metodoChamada: "MANUAL",
    };

    try {
      await cadastrar("/presencas", body, () => {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert(`✅ Presença de ${aluno.nome} salva`);
    } catch (error) {
      console.error("Erro ao registrar presença", error);
    }
  }


  // Quando ler o QR Code
  const handleScan = async (result: any) => {
    if (result?.text) {
      setScanResult(result.text);
      setQrOpen(false);

      // O QR Code vem no formato "id;nome;turmaId"
      const [alunoId, nome, turmaId] = result.text.split(";");

      await fetch("http://localhost:8080/presenca/scan", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          alunoId,
          turmaId,
          metodoChamada: "QR_CODE",
        }),
      });

      alert(`✅ Presença registrada via QR Code para ${nome}`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Registro de Presença</h1>

      {/* Botão para abrir modal do QR Code */}
      <Button color="success" onClick={() => setQrOpen(true)}>
        📷 Ler QR Code
      </Button>

      {/* Modal do leitor de QR Code */}
      <Modal show={qrOpen} onClose={() => setQrOpen(false)}>
        <ModalHeader>Ler QR Code</ModalHeader>
        <ModalBody>
          <QrReader
            constraints={{ facingMode: "environment" }}
            onResult={handleScan}
            style={{ width: "100%" }}
          />
        </ModalBody>
      </Modal>

      {/* Lista de alunos para chamada manual */}
      <Table className="mt-6">
        <TableHead>
          <TableHeadCell>Aluno</TableHeadCell>
          <TableHeadCell>Presente</TableHeadCell>
          <TableHeadCell>Ações</TableHeadCell>
        </TableHead>
        <TableBody>
          {alunos.map((aluno) => (
            <TableRow key={aluno.id}>
              <TableCell>{aluno.alunoNome}</TableCell>
              <TableCell>
                <Checkbox
                  checked={aluno.presente}
                  onChange={(e) => {
                    const updated = alunos.map((a) =>
                      a.id === aluno.id ? { ...a, presente: e.target.checked } : a
                    );
                    setAlunos(updated);
                  }}
                />
              </TableCell>
              <TableCell>
                <Button
                  size="xs"
                  color="blue"
                  onClick={() => registrarPresenca(aluno)}
                >
                  Salvar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}