import './Navbar.css';
import './NavBarMobile.css';
import { useState, useEffect as UseEffect } from 'react';
import { serverUrl } from '../../utils/config';

function Navbar({ setSection }) {

  const [invitationCode, setInvitationCode] = useState('');

  UseEffect(() => {
    fetch(serverUrl + '/codigo-invitacion', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setInvitationCode(data.invitation_code);
      })
      .catch((error) => {
        console.error('Error:', error);
      }
      );
  }, []);


  const copyToClipboard = (str) => {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  const copyCode = (e) => {
    copyToClipboard(invitationCode);

    //cambiar el html del boton
    e.target.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>';  
    e.target.disabled = true;

    setTimeout(() => {
      e.target.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2" ry="2" /><line x1="12" y1="9" x2="12" y2="15" /><line x1="9" y1="12" x2="15" y2="12" /></svg>';
      e.target.disabled = false;
    }, 1000);

  }

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.setItem('espectador', false);
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
      <h1 className="hideMobile navbar__title">SITEL Gestor Finanzas</h1>
      <button className="logout_button_mobile showMobile" onClick={logout}>Cerrar sesión</button>
      <button className="navbar__button" onClick={(e) => { selectThis(e); setSection('resumen') }}>Resumen</button>
      <button className="navbar__button" onClick={(e) => { selectThis(e); setSection('fijos') }}>Fijos</button>
      <button className="navbar__button" onClick={(e) => { selectThis(e); setSection('esporadicos') }}>Esporádicos</button>
      <button className="navbar__button" onClick={(e) => { selectThis(e); setSection('clientes') }}>Clientes</button>
      <div className="white__space hideMobile"></div>
      <div className='invitation-code hideMobile'>
        <button className='invitation-code-btn' onClick={(e) => { copyCode(e) }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="5" y="3" width="14" height="18" rx="2" ry="2" />
          <line x1="12" y1="9" x2="12" y2="15" />
          <line x1="9" y1="12" x2="15" y2="12" />
        </svg>
        </button>
        <input type="text" value={invitationCode} readOnly />
      </div>
      <button className="navbar__button logout__button hideMobile" onClick={logout}>Cerrar sesión</button>
    </nav>
  );
}

export default Navbar;