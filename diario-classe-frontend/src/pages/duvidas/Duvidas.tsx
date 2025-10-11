import {useState} from "react";
import {Roles} from "../../enums/Roles.ts";
import DuvidasResponsavel from "./duvidasResponsavel/DuvidasResponsavel.tsx";
import DuvidasProfessor from "./duvidasProfessor/DuvidasProfessor.tsx";
import DuvidasCoordenador from "./duvidasCoordenador/DuvidasCoordenador.tsx";

function Duvidas() {
  const [usuarioTipo, setUsuarioTipo] = useState<Roles>();

  const tipos: Roles[] = [Roles.COORDENADOR, Roles.PROFESSOR, Roles.RESPONSAVEL];


  return (
    <div className="pt-32 md:pl-80 md:pr-20 pb-10 px-10">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 text-center mb-10">
        Dúvidas & Tutoriais
      </h1>

      {/* Seleção de tipo de usuário */}
      <div className="flex flex-col md:flex-row justify-center gap-4 ">
        {tipos.map((tipo) => (
          <button
            key={tipo}
            onClick={() => setUsuarioTipo(tipo as Roles)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              usuarioTipo === tipo
                ? "bg-green-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
          </button>
        ))}
      </div>

      <DuvidasCoordenador usuarioTipo={usuarioTipo} />
      <DuvidasProfessor usuarioTipo={usuarioTipo} />
      <DuvidasResponsavel usuarioTipo={usuarioTipo} />

    </div>
  );
}

export default Duvidas;