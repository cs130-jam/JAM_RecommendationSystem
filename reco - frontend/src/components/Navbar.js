import React, { useState } from 'react';
import  {Link}  from 'react-router-dom';

//import  SideBarData  from './SideMenuData';

const SideBarData = [
    {
      title: 'Login',
      path: '/login',
      cName: 'nav-text'
    },
    {
      title: 'Reports',
      path: '/reports',
      cName: 'nav-text'
    },
    {
      title: 'Products',
      path: '/products',
      cName: 'nav-text'
    },
  ];

function Navbar() {



  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);



  return (
    <>
        
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className='navbar-toggle'>
 
            </li>
            {SideBarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
    </>
  );
}

export default Navbar;