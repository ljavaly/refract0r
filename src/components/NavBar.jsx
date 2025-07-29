import '../styles/NavBar.css';

function NavBar({onPageChange}) {
  return (
      <header className="header-main">
          <div className="flex items-center space-x-6">
              {/* Added onClick handlers to navigate */}
              <a href="#" className="nav-link" onClick={() => onPageChange('video')}>Discover</a>
              <a href="#" className="nav-link" onClick={() => onPageChange('following')}>Following</a>
              <a href="#" className="nav-link" onClick={() => onPageChange('browse')}>Browse</a>
              <a href="#" className="nav-link" onClick={() => onPageChange('inbox')}>Messages</a> {/* New Messages link */}
          </div>

          <div className="flex-grow max-w-md mx-4">
              <div className="relative">
                  <input type="text" placeholder="Search" className="search-input"/>
                  <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
          </div>

          <div className="flex items-center space-x-4">
              <div className="profile-avatar">
                  JD
              </div>
          </div>
      </header>
  );
}

export default NavBar;
