import PropTypes from 'prop-types'
import Button from './Button';
import { useLocation } from 'react-router-dom';


const Header = ({title, onAdd, showTask}) => {
    const location = useLocation()


    return ( 
        <div className="header">
            <h1>{title}</h1>
            { location.pathname === '/' && <Button text={showTask ? 'Close' : 'Add'} color={showTask ? 'red' : 'green'} onAdd={onAdd}/>}
        </div>
    );
}

Header.propTypes = {
    title: PropTypes.string.isRequired
}

export default Header;