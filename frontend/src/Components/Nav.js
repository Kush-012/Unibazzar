import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Nav() {
  const auth = localStorage.getItem("user");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/signup");
  };

  return (
    <nav className="unibazaar-nav">
      <div className="nav-brand">
        <img src="store.png" alt="Cart" className="brand-icon" />
        UniBazaar
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>

        {auth ? (
          <>
            <li>
              <Link to="/finditem">Find Item</Link>
            </li>
            <li>
              <Link to="/reportitem">Report Item</Link>
            </li>
            <li>
              <Link to="/chat">Chat</Link>
            </li>
            <li className="nav-profile">
              <Link to="/profile">
                {JSON.parse(auth).name}
                {JSON.parse(auth).isVerified && (
                  <span className="verified-badge">✓</span>
                )}
              </Link>
            </li>
            <li>
              <button onClick={logout} className="nav-button logout">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/signup" className="nav-button signup">
                Signup
              </Link>
            </li>
            <li>
              <Link to="/login" className="nav-button login">
                Login
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
