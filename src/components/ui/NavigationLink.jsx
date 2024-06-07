import React from 'react';
import { Link, useLocation } from '../../Router';

/** Component for navigation bar links.
 * @param {string} path path where the link leads to
 * @param {string} text link name displayed on the nav bar
 * @param {Object} styles styles passed from the global stylesheet
 * @param {string} id preferably in the form 'navigation-[name]'
 * @returns navigation link
 */
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
