import {useContext, useEffect, useState} from "react";
import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow
} from "flowbite-react";
// import {QrReader} from "react-qr-reader";
import {buscar, cadastrar, deletar, registrarPresencaQRCode} from "../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../utils/ToastAlerta.ts";
import {AuthContext} from "../../../contexts/AuthContext.tsx";
import type {Presenca, Turma} from "../../../models";
import {RotatingLines} from "react-loader-spinner";
import QRCodeScanner from "../../../components/qrCodeScanner/QrCodeScanner.tsx";

export default function RegistroPresencaPage() {
  const {usuario, handleLogout, isHydrated, isAuthenticated} = useContext(AuthContext);

  const [presencas, setPresencas] = useState<Presenca[]>([]);
  const [qrOpen, setQrOpen] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [turmas, setTurmas] = useState<Turma[]>([]); // lista de turmas do professor
  const [turmaSelecionada, setTurmaSelecionada] = useState<number | null>(null);
  const [dataChamada, setDataChamada] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      buscar("/turmas", setTurmas, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
    }
  }, [isAuthenticated, isHydrated]);


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
        { headers: { Authorization: `Bearer ${usuario.token}` } }
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

  // Quando ler o QR Code
  const handleScan = async (result) => {
    if (result?.text) {
      setScanResult(result.text);
      setQrOpen(false);

      const [alunoId, nome, turmaId] = result.text.split(";");

      try {
          await registrarPresencaQRCode(
            "/presencas/presenca/scan",
            { alunoId: String(alunoId), turmaId: String(turmaId), metodoChamada: "QR_CODE" },
            { headers: { Authorization: `Bearer ${usuario.token}`, "Content-Type": "application/x-www-form-urlencoded" } }
          );

        // ✅ Exibir confirmação amigável
        ToastAlerta(`✅ Presença registrada via QR Code para ${nome}`, Toast.Success);

        await buscarPresencas();
      } catch (error) {
        if (error instanceof Error) {
          ToastAlerta("❌ Erro ao registrar presença via QR Code", Toast.Error);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };


  return (
    <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10">

      <h1 className="text-2xl font-bold mb-6">Registro de Presença</h1>

      <div className="flex flex-wrap md:flex-nowrap justify-between items-center mb-6 gap-4">
        {/* Esquerda: selects e botão carregar */}
        <div className="flex flex-wrap gap-4">
          <select
            className="border rounded p-2"
            value={turmaSelecionada ?? ""}
            onChange={(e) => setTurmaSelecionada(Number(e.target.value))}
          >
            <option value="">Selecione a turma</option>
            {turmas.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nome} ({t.anoLetivo})
              </option>
            ))}
          </select>

          <input
            type="date"
            className="border rounded p-2"
            value={dataChamada}
            onChange={(e) => setDataChamada(e.target.value)}
          />

          <Button
            onClick={buscarPresencas}
            disabled={!turmaSelecionada || !dataChamada || isLoading}
            className="w-full md:w-auto"
          >
            {isLoading ? (
              <RotatingLines
                strokeColor="white"
                strokeWidth="5"
                animationDuration="0.75"
                width="24"
                visible={true}
              />
            ) : (
              <span>Carregar alunos</span>
            )}
          </Button>

        </div>

        {/* Direita: botão QR Code */}
        <Button
          // color="success"
          onClick={() => setQrOpen(true)}
          className="w-full md:w-auto"
        >
          📷 Ler QR Code
        </Button>
      </div>


      <Modal show={qrOpen} onClose={() => setQrOpen(false)}>
        <ModalHeader>Ler QR Code</ModalHeader>
        {/*<ModalBody>*/}
        {/*  /!*<QrReader*!/*/}
        {/*  /!*  constraints={{facingMode: "environment"}}*!/*/}
        {/*  /!*  onResult={handleScan}*!/*/}
        {/*  /!*  style={{width: "100%"}}*!/*/}

        {/*    <p className="text-red-500 mt-2">*/}
        {/*      ⚠️ Erro ao acessar câmera: {error.message || "Verifique as permissões do navegador."}*/}
        {/*    </p>*/}
        {/*  )}*/}
        {/*  <video ref={ref} style={{ width: "100%", borderRadius: "8px" }} />*/}

        {/*</ModalBody>*/}
        <ModalBody>
          {qrOpen && (
            <Modal show={qrOpen} onClose={() => setQrOpen(false)}>
              <ModalHeader>Ler QR Code</ModalHeader>
              <ModalBody>
                <QRCodeScanner onScan={handleScan}/>
              </ModalBody>
            </Modal>
          )}
        </ModalBody>

      </Modal>

      {presencas.length > 0 && (
        <Table className="mt-6">
          <TableHead>
            <TableHeadCell>Aluno</TableHeadCell>
            <TableHeadCell>Presente</TableHeadCell>
            <TableHeadCell>Ações</TableHeadCell>
          </TableHead>
          <TableBody>
            {presencas.map((p) => (
              <TableRow key={p.alunoId}>
                <TableCell>{p.alunoNome}</TableCell>
                <TableCell>
                  <Checkbox
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
                <TableCell>
                  <Button size="xs" color="blue" onClick={() => salvarPresenca(p)}>
                    Salvar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
