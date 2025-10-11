import {useAuth} from "../../contexts/UseAuth.ts";
import HomePublica from "./homePublica/HomePublica.tsx";
import {Roles} from "../../enums/Roles.ts";
import HomeCoordenador from "./homeCoordenador/HomeCoordenador.tsx";
import HomeResponsavel from "./homeResponsavel/HomeResponsavel.tsx";
import HomeProfessor from "./homeProfessor/HomeProfessor.tsx";

export default function Home() {
  const {usuario, isAuthenticated} = useAuth();

  if (!isAuthenticated || !usuario) {
    return <HomePublica/>
  }

  // ✅ A partir daqui, temos certeza de que usuario existe
  if (usuario.roles.includes(Roles.COORDENADOR)) {
    return <HomeCoordenador/>
  }

  if (usuario.roles.includes(Roles.PROFESSOR)) {
    return <HomeProfessor/>
  }

  if (usuario.roles.includes(Roles.RESPONSAVEL)) {
    return <HomeResponsavel/>
  }

  return <HomePublica />
}