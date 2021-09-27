import React from 'react'
import './navbar.css'
import { Link } from 'react-router-dom'

export default function Navbar() {
    return (
        <div>
            <nav className="navbar-dark bg-dark">
                <ul className="nav justify-content-center" id="navbar-nav">
                    <li className="nav-item">
                        <Link to='/' className='nav-link'>
                            Home
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to='/charts' className='nav-link'>
                            Chart
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to='/datatable' className='nav-link'>
                            Data Table
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to='/map' className='nav-link'>
                            Map
                        </Link>
                    </li>
                </ul>
            </nav>    
        </div>
    )
}
