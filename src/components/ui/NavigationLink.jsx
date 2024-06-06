import React from 'react';
import { Link, useLocation } from '../../Router';

// eslint-disable-next-line id-length
const NavLink = ({ path, text, styles, id }) => {
    const location = useLocation();
    const isActive = location.pathname === path;

    return (
        <Link 
            to={path}
            style={{
                ...styles.navigationLink,
                ...(isActive ? styles.activeNavigationLink : {})
            }}
            id={id}
        >
            {text}
        </Link>
    );
};

export default NavLink;
