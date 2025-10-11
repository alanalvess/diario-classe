import {useState} from 'react';
import {Button, Drawer, DrawerHeader, DrawerItems} from 'flowbite-react';
import InputField from "../form/InputField.tsx";

export function Calculadora({open, onClose}) {
  const [notas, setNotas] = useState([{ valor: "", peso: "" }]);
  const [mediaMinima, setMediaMinima] = useState(7);
  const [pesoRestante, setPesoRestante] = useState("");
  const [resultado, setResultado] = useState<null | { media: number; falta: number }>(null);

  function adicionarNota() {
    setNotas([...notas, { valor: "", peso: "" }]);
  }

  function atualizarNota(index: number, campo: "valor" | "peso", valor: string) {
    const novasNotas = [...notas];
    novasNotas[index][campo] = valor;
    setNotas(novasNotas);
  }

  function calcular() {
    const valores = notas.map((n) => parseFloat(n.valor) || 0);
    const pesos = notas.map((n) => parseFloat(n.peso) || 0);
    const somaPesos = pesos.reduce((a, b) => a + b, 0);
    const somaNotas = valores.reduce((acc, nota, i) => acc + nota * pesos[i], 0);
    const media = somaPesos ? somaNotas / somaPesos : 0;

    const pesoRest = parseFloat(pesoRestante) || 0;
    const notaNecessaria = pesoRest
      ? ((mediaMinima * (somaPesos + pesoRest)) - somaNotas) / pesoRest
      : 0;

    setResultado({ media, falta: notaNecessaria });
  }

  function novoCalculo() {
    setNotas([{ valor: "", peso: "" }]);
    setMediaMinima(7);
    setPesoRestante("");
    setResultado(null);
  }

  return (
    <Drawer open={open} onClose={onClose} position="right">
      <DrawerHeader title="Calculadora de Notas" />
      <DrawerItems>
        <div className="flex flex-col gap-4 p-4 pt-20">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Insira suas notas e pesos para ver sua média atual e quanto falta para atingir a média mínima.
          </p>

          {notas.map((nota, index) => (
            <div key={index} className="flex gap-2 items-center">
              <InputField
                name="valor"
                label={`Nota ${index + 1}`}
                type="number"
                value={nota.valor}
                onChange={(e) => atualizarNota(index, "valor", e.target.value)}
                placeholder="Ex: 8.5"
              />
              <InputField
                name="peso"
                label="Peso"
                type="number"
                value={nota.peso}
                onChange={(e) => atualizarNota(index, "peso", e.target.value)}
                placeholder="Ex: 2"
              />
            </div>
          ))}

          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white w-fit"
            onClick={adicionarNota}
          >
            + Adicionar Nota
          </Button>

          <InputField
            name="mediaMinima"
            label="Média mínima para aprovação"
            type="number"
            value={mediaMinima}
            onChange={(e) => setMediaMinima(parseFloat(e.target.value))}
            placeholder="Ex: 7.0"
          />

          <InputField
            name="pesoRestante"
            label="Peso restante (próxima avaliação)"
            type="number"
            value={pesoRestante}
            onChange={(e) => setPesoRestante(e.target.value)}
            placeholder="Ex: 2"
          />

          <Button
            className="bg-green-600 hover:bg-green-700 text-white focus:outline-none focus:ring-0 cursor-pointer"
            onClick={calcular}
          >
            Calcular
          </Button>

          {resultado && (
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200 text-lg">
              <p>📊 Média atual: <strong>{resultado.media.toFixed(2)}</strong></p>
              <p>🎯 Nota necessária para atingir {mediaMinima}: <strong>{resultado.falta.toFixed(2)}</strong></p>

              <Button
                className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white focus:outline-none focus:ring-0 cursor-pointer"
                onClick={novoCalculo}
              >
                Novo Cálculo
              </Button>
            </div>
          )}

          <Button
            className="bg-gray-500 hover:bg-gray-600 text-white focus:outline-none focus:ring-0 cursor-pointer"
            onClick={onClose}
          >
            Fechar
          </Button>
        </div>
      </DrawerItems>
    </Drawer>
  );
}
