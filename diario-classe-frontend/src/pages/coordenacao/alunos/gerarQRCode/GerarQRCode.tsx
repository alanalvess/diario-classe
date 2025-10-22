import {useEffect, useState} from "react";
import {Button, Card, Modal, ModalBody, ModalHeader, Spinner} from "flowbite-react";

import {useAuth} from "../../../../contexts/UseAuth.ts";
import {jsPDF} from "jspdf";
import type {Aluno} from "../../../../models";
import {buscarQrCode} from "../../../../services/Service.ts";
import {Toast, ToastAlerta} from "../../../../utils/ToastAlerta.ts";
import {FaFilePdf} from "react-icons/fa";

interface GerarQRCodeProps {
  open: boolean;
  onClose: () => void;
  aluno: Aluno | null;
}

function GerarQRCode({
                       open,
                       onClose,
                       aluno
                       }: GerarQRCodeProps) {

  const {usuario} = useAuth();

  const [qrImage, setQrImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function gerarQrCode() {
    setIsLoading(true);

    try {
      await buscarQrCode(`/alunos/${aluno.id}/qrcode`, setQrImage, {
        headers: {Authorization: `Bearer ${usuario.token}`},
      });
    } catch (error) {
      console.error(error);
      ToastAlerta("Erro ao gerar QR Code", Toast.Error);
    } finally {
      setIsLoading(false);
    }
  }

  function imprimirQrCode() {
    if (!qrImage || !aluno) return;

    const pdf = new jsPDF();
    pdf.text(`QR Code - ${aluno.nome}`, 10, 10);
    pdf.addImage(qrImage, "PNG", 30, 20, 150, 150);
    pdf.save(`qrcode_${aluno.nome}.pdf`);
  }


  useEffect(() => {
    if (!open || !aluno) return;
    gerarQrCode();
  }, [open, aluno]);

  return (
    <>
      <Modal show={open} onClose={onClose} size="md" popup>
        <ModalHeader/>
        <ModalBody className="flex flex-col items-center gap-4">
          <Card className="mb-6 bg-gray-100 dark:bg-gray-800 text-center shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              QR Code de {aluno?.nome}
            </h2>
          </Card>
          {isLoading ? (
            <p className="text-gray-600 dark:text-gray-400">
              <Spinner size="md" color="success"/><span> Gerando QR Code...</span>
            </p>
          ) : qrImage ? (
            <>
              <img
                src={qrImage}
                alt={`QR Code de ${aluno?.nome}`}
                className="w-48 h-48 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
              />
              <Button
                color="purple"
                className="cursor-pointer flex items-center gap-2 mt-6 rounded-lg shadow hover:shadow-md transition focus:outline-none focus:ring-0"
                onClick={imprimirQrCode}
              >
                <FaFilePdf className="text-lg" />
                Imprimir / Baixar PDF
              </Button>
            </>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              Nenhum QR Code disponível.
            </p>
          )}
        </ModalBody>
      </Modal>
    </>
  )
}

export default GerarQRCode;