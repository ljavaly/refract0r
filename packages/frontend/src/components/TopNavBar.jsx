import "../styles/TopNavBar.css";
import eyeIcon from "../assets/eye-icon.svg";
import mailIcon from "../assets/mail-icon.svg";
import gearIcon from "../assets/gear-icon.svg";

function TopNavBar({ onPageChange }) {
  return (
    <>
      <header className="header-main">
        <div className="flex gap-4">
          <img src={eyeIcon} className="logo-icon block" />
        </div>
        <div className="search-section flex-grow">
          <input
            id="search"
            type="text"
            placeholder="Search"
            className="search-input"
          />
        </div>
        <div className="nav-link-container grid grid-cols-3">
          <div className="col-span-1">
            <a
              href="#"
              className="nav-link"
              onClick={() => onPageChange("inbox")}
            >
              <img src={mailIcon} alt="Mail" className="nav-icon" />
            </a>
          </div>
          <div className="inbox-icon col-span-1">
            <a
              href="#"
              className="nav-link"
            >
              <img src={gearIcon} alt="Settings" className="nav-icon" />
            </a>
          </div>
          <div className="profile-avatar col-span-1">
            <a
              href="#"
              className="col-span-1"
              onClick={() => onPageChange("admin")}
            >
              TR
            </a>
          </div>
        </div>
      </header>
    </>
  );
}

export default TopNavBar;
