import React, {useEffect, useState} from "react";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Modal,
  ModalBody,
  ModalHeader,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput
} from "flowbite-react";
import {buscar, cadastrar, deletar, registrarPresencaQRCode} from "../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import type {Presenca, Professor, Turma} from "../../../models";
import QRCodeScanner from "../../../components/qrCodeScanner/QrCodeScanner.tsx";
import {useAuth} from "../../../contexts/UseAuth.ts";
import {FaCamera} from "react-icons/fa";
import {Roles} from "../../../enums/Roles.ts";
import {useNavigate} from "react-router-dom";

export default function RegistroPresencaPage() {
  const {usuario, handleLogout, isHydrated, isAuthenticated} = useAuth();

  const navigate = useNavigate();

  const [presencas, setPresencas] = useState<Presenca[]>([]);
  const [qrOpen, setQrOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [turmas, setTurmas] = useState<Turma[]>([]); // lista de turmas do professor
  const [turmaSelecionada, setTurmaSelecionada] = useState<number | null>(null);
  const [dataChamada, setDataChamada] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const [professor, setProfessor] = useState<Professor>();

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated || !usuario?.roles.includes(Roles.PROFESSOR)) {
      ToastAlerta("Você precisa estar autenticado como Professor", Toast.Info);
      navigate("/login");
    }
  }, [isHydrated, isAuthenticated, usuario]);

  async function buscarProfessorPorEmail() {
    try {
      await buscar(`/professores/email/${usuario.email}`, setProfessor,
        {headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"}}
      );
    } catch (err) {
      console.log(err);
    }
  }

  async function buscarTurmasPorProfessor() {
    try {
      await buscar(`/turmas/professor/${professor.id}`, setTurmas,
        {headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"}}
      )
      ;
    } catch (error) {
      console.error("Erro ao carregar turmas do professor", error);
    }
  }


  useEffect(() => {
    if (usuario?.email) {
      buscarProfessorPorEmail();
    }
  }, [usuario?.email]);

  useEffect(() => {
    if (professor?.id) {
      buscarTurmasPorProfessor();
    }
  }, [professor]);

  async function buscarPresencas() {
    if (!turmaSelecionada || !dataChamada) {
      ToastAlerta("Selecione uma turma e uma data", Toast.Error);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      await buscar(
        `/presencas/turmas/${turmaSelecionada}?data=${dataChamada}`,
        setPresencas,
        {headers: {Authorization: `Bearer ${usuario.token}`}}
      );
    } catch (error) {
      if (error.toString().includes("403")) {
        ToastAlerta("O token expirou, favor logar novamente", Toast.Error);
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  }


  useEffect(() => {
    if (isHydrated && isAuthenticated && turmaSelecionada && dataChamada) {
      buscarPresencas();
    }
  }, [isAuthenticated, isHydrated, turmaSelecionada, dataChamada]);


  async function salvarPresenca(presenca: Presenca) {
    try {
      if (presenca.presente) {
        // criar ou atualizar presença
        await cadastrar(
          "/presencas",
          {
            data: dataChamada,
            presente: true,
            alunoId: presenca.alunoId,
            turmaId: presenca.turmaId,
            metodoChamada: "MANUAL",
          },
          () => {
          },
          {headers: {Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/json"}}
        );
      } else {
        // deletar presença se existir
        await deletar(
          `/presencas/turma/${presenca.turmaId}/aluno/${presenca.alunoId}?data=${dataChamada}`,
          {headers: {Authorization: `Bearer ${usuario.token}`}}
        );
      }

      ToastAlerta(`✅ Presença de ${presenca.alunoNome} atualizada`, Toast.Success);

      // Recarrega lista para refletir alterações
      await buscarPresencas();
    } catch (error) {
      console.error(error);
      ToastAlerta("Erro ao atualizar presença", Toast.Error);
    }
  }

  const handleScanQRCode = async (base64Text: string) => {
    setQrOpen(false);
    setIsLoading(true);

    try {
      const decoded = atob(base64Text);
      const qrData = JSON.parse(decoded);
      const {nome} = qrData;

      await registrarPresencaQRCode(
        `/presencas/presenca/scan?qrData=${encodeURIComponent(base64Text)}`, {}, {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      ToastAlerta(`✅ Presença registrada via QR Code para ${nome}`, Toast.Success);
      await buscarPresencas();
    } catch (error) {
      console.error("❌ Erro ao processar QR Code:", error);
      ToastAlerta("Erro ao processar ou registrar presença via QR Code", Toast.Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10">

      <Card className="mb-10 p-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Registro de Presença
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Marque diariamente a frequência dos alunos, via QR Code ou de modo manual.
        </p>
      </Card>

      <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between mt-8 mb-6 gap-4 md:gap-6">
        {/* lado esquerdo: selects */}
        <div className="flex flex-col md:flex-row gap-4 flex-grow md:max-w-[60%] w-full">
          <Select
            className="w-full"
            value={turmaSelecionada ?? ""}
            onChange={(e) => setTurmaSelecionada(Number(e.target.value))}
          >
            <option value="">Selecione a turma</option>
            {turmas.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nome} ({t.anoLetivo})
              </option>
            ))}
          </Select>

          <TextInput
            className="w-full"
            type="date"
            value={dataChamada}
            onChange={(e) => setDataChamada(e.target.value)}
          />
        </div>

        {/* lado direito: botão QR */}
        <Button
          onClick={() => setQrOpen(true)}
          color="green"
          className="cursor-pointer w-full md:w-auto md:min-w-[10%] flex items-center justify-center focus:outline-none focus:ring-0"
        >
          <FaCamera className="mr-2"/>
          QR Code
        </Button>
      </div>


      {!turmaSelecionada ? (
        <Alert color="info" className="mt-10 text-center">
          <span className="font-medium">Selecione os filtros:</span> escolha uma turma e uma data para registrar a frequência dos alunos.
        </Alert>

      ) : presencas.length > 0 && (
        <Table className="text-sm text-gray-700 dark:text-gray-300">
          <TableHead className="bg-gray-100 dark:bg-gray-700">
            <TableHeadCell className="text-center font-semibold">Aluno</TableHeadCell>
            <TableHeadCell className="text-center font-semibold">Presente</TableHeadCell>
            <TableHeadCell className="text-center font-semibold">Ações</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y divide-gray-200 dark:divide-gray-600">
            {presencas.map((p) => (
              <TableRow
                key={p.alunoId}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-150"
              >
                <TableCell
                  className="text-center font-medium text-gray-900 dark:text-gray-100">{p.alunoNome}</TableCell>
                <TableCell className="text-center">
                  <Checkbox
                    className="focus:ring-0 dark:ring-offset-0 dark:focus:ring-0 focus:ring-offset-0 focus:outline-none"
                    color="dark"
                    checked={p.presente}
                    onChange={(e) => {
                      setPresencas((prev) =>
                        prev.map((x) =>
                          x.alunoId === p.alunoId ? {...x, presente: e.target.checked} : x
                        )
                      );
                    }}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2 flex-wrap">
                    <Button
                      className="cursor-pointer focus:outline-none focus:ring-0"
                      size="xs"
                      color="alternative"
                      onClick={() => salvarPresenca(p)}
                    >
                      Salvar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal show={qrOpen} onClose={() => setQrOpen(false)} size={"xl"} popup>
        <ModalHeader />
        <ModalBody>

          <Card className="mb-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              QR Code Scanner
            </h2>
          </Card>
          {/*<QRCodeScanner*/}
          {/*  onScan={async (base64Text) => {*/}
          {/*    setQrOpen(false);*/}
          {/*    setIsLoading(true);*/}

          {/*    try {*/}
          {/*      // 🔹 Opcional: decodificar só para exibir nome no toast*/}
          {/*      const decoded = atob(base64Text);*/}
          {/*      const qrData = JSON.parse(decoded);*/}
          {/*      const { nome } = qrData;*/}

          {/*      // 🔹 Envia Base64 para o backend via query param*/}
          {/*      await registrarPresencaQRCode(*/}
          {/*        `/presencas/presenca/scan?qrData=${encodeURIComponent(base64Text)}`,*/}
          {/*        {}, // corpo vazio*/}
          {/*        {*/}
          {/*          headers: {*/}
          {/*            Authorization: `Bearer ${usuario.token}`,*/}
          {/*            "Content-Type": "application/x-www-form-urlencoded",*/}
          {/*          },*/}
          {/*        }*/}
          {/*      );*/}

          {/*      ToastAlerta(*/}
          {/*        `✅ Presença registrada via QR Code para ${nome}`,*/}
          {/*        Toast.Success*/}
          {/*      );*/}

          {/*      await buscarPresencas();*/}
          {/*    } catch (error) {*/}
          {/*      console.error("❌ Erro ao processar QR Code:", error);*/}
          {/*      ToastAlerta(*/}
          {/*        "Erro ao processar ou registrar presença via QR Code",*/}
          {/*        Toast.Error*/}
          {/*      );*/}
          {/*    } finally {*/}
          {/*      setIsLoading(false);*/}
          {/*    }*/}
          {/*  }}*/}
          {/*/>*/}

          <QRCodeScanner onScan={handleScanQRCode}/>
        </ModalBody>
      </Modal>

    </div>
  );
}
