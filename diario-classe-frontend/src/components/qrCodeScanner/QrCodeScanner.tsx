import {useZxing} from "react-zxing";
import { useEffect, useRef, useState } from "react";

interface QRCodeScannerProps {
  onScan: (text: string) => void;
}

export default function QRCodeScanner({ onScan }: QRCodeScannerProps) {
  const [erro, setErro] = useState<string | null>(null);

  // ref de vídeo usada pelo ZXing
  const { ref: zxingRef } = useZxing({
    onDecodeResult(result) {
      const text = result.getText();
      if (text) onScan(text);
    },
    onError(err) {
      console.error("Erro ao acessar câmera:", err);
      setErro(err.toString());
    },
    constraints: {
      video: {
        facingMode: { ideal: "environment" }, // câmera traseira
      },
    },
  });

  // Ref separada para limpar câmera ao desmontar
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <video
        ref={(el) => {
          // ✅ o ref do ZXing é um objeto, não uma função
          zxingRef.current = el;
          videoRef.current = el;
        }}
        style={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: "12px",
          background: "#000",
        }}
        autoPlay
        playsInline
      />

      {erro ? (
        <p className="text-red-500 text-center text-sm">
          ⚠️ Erro ao acessar câmera: {erro} <br />
          Verifique se o navegador tem permissão para usar a câmera.
        </p>
      ) : (
        <p className="text-gray-500 text-sm text-center">
          Aponte a câmera para o QR Code do aluno
        </p>
      )}
    </div>
  );
}

