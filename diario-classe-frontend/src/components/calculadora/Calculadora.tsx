import {useState} from 'react';
import {Button, Drawer, DrawerHeader, DrawerItems, Label, TextInput} from 'flowbite-react';
import {FaCalculator} from "react-icons/fa6";

export function Calculadora({open, onClose}) {
  const [notas, setNotas] = useState([{valor: "", peso: ""}]);
  const [mediaMinima, setMediaMinima] = useState(6);
  const [pesoRestante, setPesoRestante] = useState("");
  const [resultado, setResultado] = useState<null | { media: number; falta: number }>(null);

  function adicionarNota() {
    setNotas([...notas, {valor: "", peso: ""}]);
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

    setResultado({media, falta: notaNecessaria});
  }

  function novoCalculo() {
    setNotas([{valor: "", peso: ""}]);
    setMediaMinima(6);
    setPesoRestante("");
    setResultado(null);
  }

  return (

    <Drawer open={open} onClose={onClose} position="right" className="mt-[10vh]">
      <DrawerHeader title="Calculadora de Notas" titleIcon={FaCalculator}/>
      <DrawerItems>
        <div className="max-h-[80vh] overflow-y-auto p-4 flex flex-col gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Insira suas notas e pesos para ver sua média atual e quanto falta para atingir a média mínima.
          </p>

          {notas.map((nota, index) => (
            <div key={index} className="flex gap-2 items-center">
              <div className="flex flex-col">
                <Label>{`Nota ${index + 1}`}</Label>

                <TextInput
                  name="valor"
                  type="number"
                  value={nota.valor}
                  onChange={(e) => atualizarNota(index, "valor", e.target.value)}
                  placeholder="Ex: 8.5"
                />
              </div>

              <div className="flex flex-col">
                <Label>{`Peso ${index + 1}`}</Label>

                <TextInput
                  name="peso"
                  type="number"
                  value={nota.peso}
                  onChange={(e) => atualizarNota(index, "peso", e.target.value)}
                  placeholder="Ex: 2"
                />
              </div>
            </div>
          ))}

          <Button
            className="cursor-pointer focus:outline-none focus:ring-0"
            color="light"
            onClick={adicionarNota}
          >
            + Adicionar Nota
          </Button>

          <div className="flex flex-col mt-5">
            <Label>Média mínima para aprovação</Label>
            <TextInput
              name="mediaMinima"
              type="number"
              value={mediaMinima}
              onChange={(e) => setMediaMinima(parseFloat(e.target.value))}
              placeholder="Ex: 7.0"
            />
          </div>

          <div className="flex flex-col mt-5">
            <Label>Peso restante</Label>
            <TextInput
              name="pesoRestante"
              type="number"
              value={pesoRestante}
              onChange={(e) => setPesoRestante(e.target.value)}
              placeholder="Ex: 2"
            />
          </div>

          <Button
            color="green"
            className="focus:outline-none focus:ring-0 cursor-pointer"
            onClick={calcular}
          >
            Calcular
          </Button>

          {resultado && (
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200 text-lg">
              <p>📊 Média atual: <strong>{resultado.media.toFixed(2)}</strong></p>
              <p>🎯 Nota necessária para atingir {mediaMinima}: <strong>{resultado.falta.toFixed(2)}</strong></p>

              <Button
                color="yellow"
                className="mt-3 focus:outline-none focus:ring-0 cursor-pointer"
                onClick={novoCalculo}
              >
                Novo Cálculo
              </Button>
            </div>
          )}

          <Button
            color="gray"
            className="focus:outline-none focus:ring-0 cursor-pointer"
            onClick={onClose}
          >
            Fechar
          </Button>
        </div>
      </DrawerItems>
    </Drawer>
  );
}
