import logo from '../../assets/logo.png';
import './LoginRegister.css';
import React, {useState} from 'react';
import background from '../../assets/background.svg';

function LoginRegister(){
    let token = localStorage.getItem('token');

    const [isLoggin, setState] = useState(true);
    const [errors, setErrors] = useState([]);

    const setRegistering = () => {
        setErrors([]);
        setState(false);
    }

    const setLoggin = () => {
        setErrors([]);
        setState(true);
    }

    const setError = (errores) => {
        setErrors(errores);
    }

    const goHome = () => {
        document.querySelector('.login-container').classList.add('out-slide');
        setTimeout(() => {
            window.location.href = '/';
        }, 500);
    }

    setTimeout(() => {
        if(token){
            goHome();
        }
    }, 500);

    const login = (e) => {
        e.preventDefault();
        const loginForm = document.getElementById("login-form");
        const email = loginForm.email.value;
        const password = loginForm.password.value;

        setError([]);

        const errores = [];
        if(email === ""){
            errores.push("El campo email es requerido");
        }
        if(password === ""){
            errores.push("El campo password es requerido");
        }
        if(errores.length > 0){
            setError(errores);
            return;
        }

        /* Aquí va el código para hacer login */
        // se usa email y password en la petición
        fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                localStorage.setItem('token', data.access_token);
                goHome();
            } else {
                setError(data.errors);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            setError(["Error en la petición: algo salió mal"]);
        });
    }


    const register = (e) => {
        e.preventDefault();
        const registerForm = document.getElementById("register-form");
        const email = registerForm.email.value;
        const password = registerForm.password.value;
        const password2 = registerForm.password2.value;

        setError([]);

        const errores = [];
        if(email === ""){
            errores.push("El campo email es requerido");
        }
        if(password === ""){
            errores.push("El campo password es requerido");
        }
        if(password2 === ""){
            errores.push("Verificar contraseña es requerido");
        } else if (password !== password2){
            errores.push("Las contraseñas no coinciden");
        }
        if(errores.length > 0){
            setError(errores);
            return;
        }

        /* Aquí va el código para hacer registro */
        // se usa email y password en la petición
        fetch('http://127.0.0.1:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                localStorage.setItem('token', data.access_token);
                goHome();
            } else {
                setError(data.errors);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            setError(["Error en la petición: algo salió mal"]); 
        });
    }

    return (
        <div class="LoginRegister-container">
            <div class="background-container">
                <svg className='back-svg'>
                    <image href={background} width="100%" height="100%"/>
                </svg>
            </div>
            <div class="login-container">
                <div class="title">
                    <img src={logo} alt="logo" />
                    <h2>BenjiOr Fin</h2>
                </div>
                
                { isLoggin && (
                <form id="login-form">
                    <div class="form-group">
                        <input type="text" id="email" name="email" required />
                        <label for="email">Correo</label>
                    </div>
                    <div class="form-group">
                        <input type="password" id="password" name="password" required/>
                        <label for="password">Contraseña</label>
                    </div>
                    {
                        errors.length > 0 && (
                            <div class="errors">
                            {errors.map((error, index) => (
                                <div class="error">
                                    <p key={index}>{error}</p>  
                                </div>
                            ))}
                            </div>
                        )
                    }
                    {/* <a href="/">¿Olvidaste tu contraseña?</a> */}
                    <button type="submit" onClick={login}>Login</button>
                    <button type="button" onClick={setRegistering}>Registrarse</button>
                </form>
                )}

                { !isLoggin && (
                <form id="register-form">
                    <div class="form-group">
                        <input type="text" id="email" name="email" required />
                        <label for="email">Correo</label>
                    </div>
                    <div class="form-group">
                        <input type="password" id="password" name="password" required/>
                        <label for="password">Contraseña</label>
                    </div>
                    <div class="form-group">
                        <input type="password" id="password2" name="password2" required/>
                        <label for="password2">Verificar Contraseña</label>
                    </div>
                    {
                        errors.length > 0 && (
                            <div class="errors">
                            {errors.map((error, index) => (
                                <div class="error">
                                    <p key={index}>{error}</p>  
                                </div>
                            ))}
                            </div>
                        )
                    }
                    <button type="submit" onClick={register}>Registrarse</button>
                    <button type="button" onClick={setLoggin}>Login</button>
                </form>
                )}
            </div>
        </div>
    );
}

export default LoginRegister;