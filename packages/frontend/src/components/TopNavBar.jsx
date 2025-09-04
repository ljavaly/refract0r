import "../styles/TopNavBar.css";
import ghostIcon from "../assets/ghost-svgrepo-com.svg";

function TopNavBar({ onPageChange }) {
  return (
    <>
      <header className="header-main">
        <div className="flex gap-4">
          <a href="#" className="" onClick={() => onPageChange("stream")}>
            <img src={ghostIcon} alt="Ghost" className="ghost-icon block" />
          </a>
          <div className="nav-links-container grid grid-cols-3">
            <a
              href="#"
              className="nav-link col-span-1"
              onClick={() => onPageChange("stream")}
            >
              Stream 🔽
            </a>
            <a
              href="#"
              className="nav-link col-span-1"
              onClick={() => onPageChange("browse")}
            >
              Browse 🔍
            </a>
            <a
              href="#"
              className="nav-link col-span-1"
              onClick={() => onPageChange("inbox")}
            >
              Inbox 📨
            </a>
          </div>
        </div>
        <div className="search-section flex-grow">
          <input
            id="search"
            type="text"
            placeholder="Search"
            className="search-input"
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="profile-avatar">
            <a href="#" className="col-span-1" onClick={() => onPageChange("admin")}>
              TR
            </a>
          </div>
        </div>
      </header>
    </>
  );
}

export default TopNavBar;
