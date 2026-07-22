import "../styles/NavBar.css"


interface DashboardData {
    username: string;
}


function NavBar({username}:DashboardData) {
  return(
        <>
                <nav className="navbar">
                    <div className="navbar-icon">
                        <h1>Nile<em>Bank</em></h1>
                    </div>
                    <div className="navbar-logout-id">
                        <div className="login-info">
                            <div className="user-avatar">{username[0]}</div>
                            <h2>{username}</h2>
                        </div>
                    </div>
                </nav>
        </>
    )
};

export default NavBar;