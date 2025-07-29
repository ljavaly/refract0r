import '../styles/NavBar.css';
import ghostIcon from '../assets/ghost-svgrepo-com.svg';

function NavBar({onPageChange}) {
  return (
      <header className="header-main">
          <div className="flex items-center space-x-6">
              {/* Ghost icon */}
              <img 
                src={ghostIcon} 
                alt="Ghost" 
                className="ghost-icon"
              />
              
              {/* Added onClick handlers to navigate */}
              <a href="#" className="nav-link" onClick={() => onPageChange('video')}>Discover</a>
              <a href="#" className="nav-link" onClick={() => onPageChange('following')}>Following</a>
              <a href="#" className="nav-link" onClick={() => onPageChange('browse')}>Browse</a>
              <a href="#" className="nav-link" onClick={() => onPageChange('inbox')}>Messages</a> {/* New Messages link */}
          </div>

          <div className="flex-grow max-w-md mx-4">
              <div className="relative">
                  <input type="text" placeholder="Search" className="search-input"/>
              </div>
          </div>

          <div className="flex items-center space-x-4">
              <div className="profile-avatar">
                  TR
              </div>
          </div>
      </header>
  );
}

export default NavBar;
