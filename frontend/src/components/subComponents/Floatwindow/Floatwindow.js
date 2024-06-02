import React, { useState, useEffect } from "react";
import "./Floatwindow.css";


function Floatwindow({ htmlContent }) {
    // estados -------------------
    const [visible, setVisible] = useState(true);

    // funciones -------------------------------------


    // efectos ---------------------------------------

    return (
        <div className={"floating-window-container" + (setVisible ? " floating-window-container-visible" : "")}>
            <div className="floating-window">
                <button onClick={close} className="close-button">X</button>
                <div className="floating-window-content">
                    {htmlContent}
                </div>
            </div>
        </div>
    );
}

export default Clientes
