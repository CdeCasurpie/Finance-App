import Navbar from '../../components/Navbar/Navbar';
import './Home.css';
import './HomeMobile.css';
import background from '../../assets/background.svg';

import Resumen from '../../components/Resumen/Resumen';
import Fijos from '../../components/Fijos/Fijos';
import Esporadicos from '../../components/Esporadicos/Esporadicos';

import React from 'react';
import Clientes from '../../components/Clientes/Clientes';

function Home () {

  const [spectator, setSpectator] = React.useState(false);

  //ejecutado 200ms despues de cargar la pagina
  setTimeout(() => {
    console.log(localStorage.getItem('espectador'));
    if (localStorage.getItem('espectador') === 'true') {
      setSpectator(true);
    } else {
      setSpectator(false);
    }
  }, 200);


  let token = localStorage.getItem('token');
  if(!token){
      window.location.href = '/login-register';
  }

  const selectSection = (section) => {
    let sections = document.querySelectorAll('section');
    sections.forEach((s) => {
      if (s.id !== section) {
        s.classList.remove('slide-in');
        s.classList.add('slide-out');
        setTimeout(() => {
          s.style.display = 'none';
        }, 500);
      } else {
        setTimeout(() => {
          s.classList.remove('slide-out');
          s.classList.add('slide-in');
          s.style.display = 'block';
        }, 500);
      }
    });
  }

  return (
    <div className="home">
      <div className="background-container-home">
          <svg className='back-svg2'>
              <image href={background} width="100%" height="100%"/>
          </svg>
      </div>

      <main>
        <section id="resumen" className='slide-out' style={{display: 'none'}}>
          <Resumen spectator={spectator}/>
        </section>
        <section id="fijos" className='slide-out' style={{display: 'none'}}>
          <Fijos spectator={spectator}/>
        </section>
        <section id="esporadicos" className='slide-out' style={{display: 'none'}}>
          <Esporadicos spectator={spectator}/>
        </section>
        <section id="clientes" className='slide-out' style={{display: 'none'}}>
          <Clientes spectator={spectator}/>
        </section>
      </main>

      <Navbar setSection={selectSection}/>
    </div>
  );
}

export default Home;