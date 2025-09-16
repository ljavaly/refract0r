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
            height="150"
            viewBox="0 -10 120 160"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-labelledby="title desc"
            preserveAspectRatio="xMidYMin meet"
          >
            <title id="title">
              Monocle with Chain's Right Edge Aligned to Rim
            </title>
            <desc id="desc">
              Monocle rim with the eye near center, and chain's right edge
              aligned with the rim's outermost pixel.
            </desc>
            <rect x="0" y="-10" width="120" height="160" fill="none" />
            <circle
              cx="60"
              cy="30"
              r="30"
              stroke="var(--color-highlight)"
              stroke-width="14"
              fill="none"
            />
            <circle cx="57" cy="30" r="14" fill="var(--color-highlight)" />
            <line
              x1="91"
              y1="30"
              x2="91"
              y2="110"
              stroke="var(--color-highlight)"
              stroke-width="12"
              stroke-linecap="round"
            />
            <circle cx="91" cy="110" r="8" fill="var(--color-highlight)" />{" "}
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
          <div className="nav-link col-span-1">
            <a href="#" onClick={() => onPageChange("inbox")}>
              <img src={mailIcon} alt="Mail" className="nav-icon" />
            </a>
          </div>
          <div className="nav-link inbox-icon col-span-1">
            <a href="#">
              <img src={gearIcon} alt="Settings" className="nav-icon" />
            </a>
          </div>
          <div className="nav-link profile-avatar col-span-1">
            <a href="#" onClick={() => onPageChange("admin")}>
              TR
            </a>
          </div>
        </div>
      </header>
    </>
  );
}

export default TopNavBar;
