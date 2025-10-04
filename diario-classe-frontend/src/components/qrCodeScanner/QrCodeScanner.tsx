import {useZxing} from "react-zxing";
import {useEffect} from "react";

export default function QRCodeScanner({ onScan }: { onScan: (text: string) => void }) {

  useEffect(() => {
    async function pedirPermissaoCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop()); // libera imediatamente
        console.log("✅ Permissão da câmera concedida!");
      } catch (err) {
        console.error("❌ Permissão da câmera negada:", err);
      }
    }

    pedirPermissaoCamera();
  }, []);

  const { ref } = useZxing({
    onDecodeResult(result) {
      const text = result.getText();
      if (text) {
        onScan(text); // ← aqui chamamos sua função handleScan
      }
    },
    onError(err) {
      console.error("Erro ao acessar câmera:", err);
      alert("❌ Erro ao acessar câmera: " + err);
    },
    constraints: {
      video: { facingMode: "environment", width: 1280, height: 720 },
    },
  });

  return <video ref={ref} style={{ width: "100%", borderRadius: "8px" }} />;
}
