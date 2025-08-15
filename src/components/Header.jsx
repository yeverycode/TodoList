import { NavLink } from 'react-router-dom';


export default function Header() {
return (
<div className="row" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
<div style={{ fontWeight: 700 }}>PlanIt</div>
<nav className="nav">
<NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>To‑Do</NavLink>
<NavLink to="/schedule" className={({isActive}) => isActive ? 'active' : ''}>Schedule</NavLink>
</nav>
</div>
);
}