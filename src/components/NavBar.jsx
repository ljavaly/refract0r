import '../styles/NavBar.css';
import ghostIcon from '../assets/ghost-svgrepo-com.svg';

function NavBar({onPageChange}) {
  return (
    <>
        <header className="header-main">
            <div className="grid grid-cols-4">
                <a href="#" className="nav-link col-span-1" onClick={() => onPageChange('stream')}>
                    <img 
                        src={ghostIcon} 
                        alt="Ghost" 
                        className="ghost-icon block h-6 w-6"
                    />
                </a>   
                <a href="#" className="nav-link col-span-1" onClick={() => onPageChange('stream')}>Stream</a>
                <a href="#" className="nav-link col-span-1" onClick={() => onPageChange('browse')}>Browse</a>
                <a href="#" className="nav-link col-span-1" onClick={() => onPageChange('inbox')}>Inbox</a>
            </div>

            <div className="flex-grow max-w-md mx-4">
                <input type="text" placeholder="Search" className="search-input"/>
            </div>

            <div className="flex items-center space-x-4">
                <div className="profile-avatar">
                    TR
                </div>
            </div>
        </header>
    </>
  );
}

export default NavBar;
