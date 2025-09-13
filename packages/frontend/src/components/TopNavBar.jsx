import "../styles/TopNavBar.css";
import eyeIcon from "../assets/eye-icon.svg";
import mailIcon from "../assets/mail-icon.svg";
import gearIcon from "../assets/gear-icon.svg";

function TopNavBar({ onPageChange }) {
  return (
    <>
      <header className="header-main">
        <div className="logo-icon flex">
          <svg
            width="120"
            height="130"
            viewBox="0 -10 120 120"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-labelledby="title desc"
            preserveAspectRatio="xMidYMin meet"
          >
            <title id="title">
              Monocle with Left‑Shifted Eye, White Background, and Straight
              Chain
            </title>
            <desc id="desc">
              Monocle rim with the “eye” shifted left, straight-down chain from
              the right, and white background for visibility.
            </desc>
            <rect x="0" y="-10" width="120" height="120" fill="none" />
            <circle
              cx="60"
              cy="30"
              r="30"
              stroke="var(--color-highlight)"
              stroke-width="4"
              fill="none"
            />
            <circle cx="50" cy="30" r="10" fill="var(--color-highlight)" />
            <line
              x1="90"
              y1="30"
              x2="90"
              y2="110"
              stroke="var(--color-highlight)"
              stroke-width="3"
              stroke-linecap="round"
            />
            <circle cx="90" cy="110" r="3" fill="var(--color-highlight)" />
          </svg>
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
            <a href="#" className="nav-link">
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
