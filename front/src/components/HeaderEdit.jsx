import Logo from '../assets/logo.png';
import Img from '../assets/image1.png';

export const HeaderEdit = () => {
  return (
    <div className="header-edit">
        <div className="loguito">
            <img src={Logo} alt="logo-colegio" />
        </div>
        <div className="encabezado">
            REPÚBLICA BOLIVARIANA DE VENEZUELA MINISTERIO DEL PODER POPULAR PARA LA EDUCACIÓN CENTRO DE
            EDUCACIÓN 
            INICIAL BOLIVARIANO ‘’TUMEREMO’’ PUERTO ORDAZ, 
            ESTADO BOLÍVAR COD.DEA: 17100701 COD. EST:072279 COD. DEP: 004109330
        </div>
        <div className="logo-2">
            <img src={Img} alt="logo-2" />
        </div>
    </div>
  )
}
