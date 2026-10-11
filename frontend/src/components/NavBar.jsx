import React from "react";
import './NavBar.css'

function NavBar() {
    return(
        <nav className="navbar">
            <img src="/lotus.svg" alt="Lotus logo" className="logo" />
            <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">Books</a></li>
                <li><a href="#">Borrow</a></li>
                <li><a href="#">Return</a></li>
            </ul>
        </nav>
    )
}

export default NavBar;