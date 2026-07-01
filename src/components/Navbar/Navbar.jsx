import "./Navbar.css";

export const Navbar = () => {
  return (
    <>
      <nav className="navbar bg-body-tertiary" >
        <div className="container-fluid">
          <form className="d-flex" role="search">
            <a className="navbar-brand">Buscar ofertas en: </a>
            <input className="form-control me-2" type= "search" placeholder="Ingresá tu destino" aria-label="" />
            <a className="navbar-brand">Desde: </a>
            <input className="form-control me-2" type="date" placeholder="Desde..." aria-label="Search" />
            <a className="navbar-brand">Hasta: </a>
            <input className="form-control me-2" type="date" placeholder="Hasta..." aria-label="Search" />
            <button className="btn btn-outline-success" type="submit">Buscar</button>
          </form>
        </div>
      </nav>
    </>
  )
}
