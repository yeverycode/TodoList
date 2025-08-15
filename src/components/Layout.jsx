import Header from './Header';


export default function Layout({ children }) {
return (
<div className="container">
<Header />
{children}
<div className="footer">© {new Date().getFullYear()} PlanIt — Simple To‑Do & Schedule</div>
</div>
);
}