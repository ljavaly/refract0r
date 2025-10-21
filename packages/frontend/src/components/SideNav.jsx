import homeIcon from "../assets/home-icon.svg";
import channelIcon from "../assets/channel-icon.svg";
import trendingIcon from "../assets/trending-icon.svg";
import subscriptionsIcon from "../assets/subscriptions-icon.svg";
import premiumIcon from "../assets/premium-icon.svg";
import historyIcon from "../assets/history-icon.svg";
import watchLaterIcon from "../assets/watch-later-icon.svg";
import likedVideosIcon from "../assets/liked-videos-icon.svg";
import showMoreIcon from "../assets/show-more-icon.svg";
import dollarIcon from "../assets/dollar-icon.svg";

import { useNavigate, useLocation } from "react-router-dom";
import "../styles/SideNav.css";

function SideNav() {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to determine if a path is active
  const isActive = (path) => location.pathname === path;
  return (
    <aside className="sidebar">
      <div className="sidebar-section flex-grow">
        <div className={`sidebar-item ${isActive("/") ? "active" : ""}`}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            <div className="sidebar-icon">
              <img src={homeIcon} alt="Home" />
            </div>
            <span>Home</span>
          </a>
        </div>
        <div className={`sidebar-item ${isActive("/browse") ? "active" : ""}`}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/browse");
            }}
          >
            <div className="sidebar-icon">
              <img src={channelIcon} alt="My Channel" />
            </div>
            <span>My Channel</span>
          </a>
        </div>
        <div className="sidebar-item">
          <a href="#">
            <div className="sidebar-icon">
              <img src={trendingIcon} alt="Trending" />
            </div>
            <span>Trending</span>
          </a>
        </div>
        <div className="sidebar-item">
          <a href="#">
            <div className="sidebar-icon">
              <img src={subscriptionsIcon} alt="Subscriptions" />
            </div>
            <span>Subscriptions</span>
          </a>
        </div>
        <div className="sidebar-item">
          <a href="#">
            <div className="sidebar-icon">
              <img src={premiumIcon} alt="Premium" />
            </div>
            <span>Premium</span>
          </a>
        </div>
        <div className="sidebar-item">
          <a href="#">
            <div className="sidebar-icon">
              <img src={dollarIcon} alt="Bank" />
            </div>
            <span>Bank</span>
          </a>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="section-title">Library</div>
        <div className="sidebar-item">
          <a href="#">
            <div className="sidebar-icon">
              <img src={historyIcon} alt="History" />
            </div>
            <span>History</span>
          </a>
        </div>
        <div className="sidebar-item">
          <a href="#">
            <div className="sidebar-icon">
              <img src={watchLaterIcon} alt="Watch Later" />
            </div>
            <span>Watch Later</span>
          </a>
        </div>
        <div className="sidebar-item">
          <a href="#">
            <div className="sidebar-icon">
              <img src={likedVideosIcon} alt="Liked Videos" />
            </div>
            <span>Liked Videos</span>
          </a>
        </div>
        <div className="sidebar-item">
          <a href="#">
            <div className="sidebar-icon">
              <img src={showMoreIcon} alt="Show More" />
            </div>
            <span>Show More</span>
          </a>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="section-title">Subscriptions</div>
        <div className="sidebar-item">
          <a href="#">
            <div className="channel-avatar"></div>
            <span>Channel 1</span>
          </a>
        </div>
        <div className="sidebar-item">
          <a href="#">
            <div className="channel-avatar"></div>
            <span>Channel 2</span>
          </a>
        </div>
        <div className="sidebar-item">
          <a href="#">
            <div className="channel-avatar"></div>
            <span>Channel 3</span>
          </a>
        </div>
        <div className="sidebar-item">
          <a href="#">
            <div className="channel-avatar"></div>
            <span>Channel 4</span>
          </a>
        </div>
      </div>
    </aside>
  );
}

export default SideNav;
