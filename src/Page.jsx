import React from 'react'
import { NavLink } from 'react-router-dom'
import Contents from './Contents.jsx'

function NavBar() {
    const Seperator = () => <span> | </span>
    return (
        <nav class="navBar">   
            <NavLink end to='/'>Home</NavLink>
            <Seperator />
            <NavLink to='/employees'>Display Employees</NavLink>
            <Seperator />
            <NavLink to='/report'>Reports</NavLink>
        </nav>
    )
}

export default function Page() {
    return (
        <div>
            <NavBar />
            <Contents />
        </div>
    )
}