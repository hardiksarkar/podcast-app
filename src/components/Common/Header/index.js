import React from 'react'
import "./styles.css"
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../../../firebase';

function Header() {
  const location = useLocation();
  const currPath = location.pathname;

  function activeLinkFunc(path){
    if(path===currPath){
      return "link-active";
    }
    return "";
  }

  return (
    <div className='navbar'>
      <div className="gradient"></div>
      <div className='links'>
      {!auth.currentUser  && <Link to="/" className={activeLinkFunc("/")}>SignUp</Link>}
      <Link to="/podcasts" className={activeLinkFunc("/podcasts")}>Podcasts</Link>
      <Link to="/create-a-podcast" className={activeLinkFunc("/create-a-podcast")}>Start A Podcast</Link>
      <Link to="/profile" className={activeLinkFunc("/profile")}>Profile</Link>
      </div>
    </div>
  )
}

export default Header;
