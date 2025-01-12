import { Link, useNavigate } from "react-router-dom";
import { Home01Icon } from 'hugeicons-react';
import { Film01Icon } from "hugeicons-react";
import { useLogout } from "../hooks/useLogout";
import { Search01Icon } from "hugeicons-react";
import { useState } from "react";

const Navbar = () => {
  const { logout } = useLogout();
  const [searchBarActive, setSearchBarActive] = useState(false);
  

  const handleLogout = async () => {
    logout();
  };

  const toggleSearchBar = () => {
    setSearchBarActive((prev) => !prev);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setSearchBarActive(false);
      window.location.reload();
    }
  };

  return (
    <div className="navbarContainer">
      <nav>
        <div className="leftNavbarContainer">
          <div className="navLinkContainer">
            <Home01Icon />
            <Link to="/">Home</Link>
          </div>
          <div className="navLinkContainer">
            <Film01Icon />
            <Link to="/watchlist">Watchlist</Link>
          </div>
        </div>
        <div className="rightNavbarContainer">
          <div className="navLinkContainer" onClick={toggleSearchBar}>
            <Search01Icon />
          </div>
          <div className="logoutContainer">
            <button onClick={handleLogout}> Logout </button>
          </div>
        </div>
      </nav>

      {searchBarActive && (
        <div className="searchBarContainer">
         <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search..."
              className="searchBar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      )}

      <div className="bottomNavbar"><span></span></div>
    </div>
  );
};

export default Navbar;
