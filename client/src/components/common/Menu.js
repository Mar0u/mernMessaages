import React, { useRef } from 'react';
import './Menu.css';
import { Link } from 'react-router-dom';

const Menu = () => {
  const menuRef = useRef(null);



 
  return (
    <div className={`menu ${1 ? 'open' : ''}`} ref={menuRef}>

      <ul className="menu-list">
        <li>
          <Link to={`/`}>
            <button className="menu-btn">
              <img src={process.env.PUBLIC_URL + "/menu.svg"} alt="SVG logo image" />MAIN PAGE
            </button>
          </Link>
        </li>
        <li>
          <Link to={`/Profile`}>
            <button className="menu-btn">
              <img src={process.env.PUBLIC_URL + "/menu.svg"} alt="SVG logo image" />PROFILE
            </button>
          </Link>
        </li>
        <li>
          <Link to={`/Statistics`}>
            <button className="menu-btn">
              <img src={process.env.PUBLIC_URL + "/menu.svg"} alt="SVG logo image" />STATISTICS
            </button>
          </Link>
        </li>
        <li>
        <Link to={`/Community`}>
          <button className="menu-btn">
            <img src={process.env.PUBLIC_URL + "/menu.svg"} alt="SVG logo image" />COMMUNITY
          </button>
          </Link>
          <hr></hr>
          <button className="menu-btn" >
            <img src={process.env.PUBLIC_URL + "/menu.svg"} alt="SVG logo image" /> DELETE ACC.
          </button>
        </li>
        <li>
          <button className="menu-btn">
          <img src={process.env.PUBLIC_URL + "/menu.svg"} alt="SVG logo image" /> LOGOUT
          </button>
        </li>
      </ul>

    </div>
  );
};

export default Menu;