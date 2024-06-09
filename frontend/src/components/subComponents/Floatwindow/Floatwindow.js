import React, { useState, useEffect } from "react";
import "./Floatwindow.css";


function Floatwindow({ htmlContent }) {
    var nombreAmostrar = "#";
    // estados -------------------
    const [visible, setVisible] = useState(true);

    // funciones -------------------------------------

    const cambiarNombre = (nuevoNombre) => {
        nombreAmostrar = nuevoNombre;
    }
    // efectos ---------------------------------------

    setInterval(() => {
        nombreAmostrar += "#";
    }, 2000);

    return (
        <div className={"floating-window-container" + (setVisible ? " floating-window-container-visible" : "")}>
            <div className="floating-window">
                <button onClick={close} className="close-button">X</button>
                <div className="floating-window-content">
                    { nombreAmostrar }
                </div>
            </div>
        </div>
    );
}

export default Floatwindow;
