import './Navbar.css';

function Navbar({ setSection }) {

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login-register';
  }

  const selectThis = (e) => {
    let buttons = document.querySelectorAll('.navbar__button');
    buttons.forEach(button => {
      button.classList.remove('selected');
      button.disabled = true;
      setTimeout(() => {
        button.disabled = false;
      }, 1000);
    });
    e.target.classList.add('selected');
  }

  setTimeout(() => {
    let buttons = document.querySelectorAll('.navbar__button');
    buttons[0].classList.add('selected');
    setSection('resumen');
  }, 1000);

  return (
    <nav className="navbar">
      <h1 className="navbar__title">BenjiOR Finanzas</h1>
      <button className="navbar__button" onClick={(e) => { selectThis(e); setSection('resumen') }}>Resumen</button>
      <button className="navbar__button" onClick={(e) => { selectThis(e); setSection('fijos') }}>Fijos</button>
      <button className="navbar__button" onClick={(e) => { selectThis(e); setSection('esporadicos') }}>Esporádicos</button>
      <div className="white__space"></div>
      <button className="navbar__button logout__button" onClick={logout}>Cerrar sesión</button>
    </nav>
  );
}

export default Navbar;