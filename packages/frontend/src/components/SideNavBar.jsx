import homeIcon from "../assets/home-icon.svg";
import channelIcon from "../assets/channel-icon.svg";
import trendingIcon from "../assets/trending-icon.svg";
import subscriptionsIcon from "../assets/subscriptions-icon.svg";
import premiumIcon from "../assets/premium-icon.svg";
import tvIcon from "../assets/tv-icon.svg";
import historyIcon from "../assets/history-icon.svg";
import watchLaterIcon from "../assets/watch-later-icon.svg";
import likedVideosIcon from "../assets/liked-videos-icon.svg";
import showMoreIcon from "../assets/show-more-icon.svg";

import "../styles/SideNavBar.css";

function SideNavBar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-section flex-grow">
        <div className="sidebar-item active">
          <div className="sidebar-icon">
            <img src={homeIcon} alt="Home" />
          </div>
          <span>Home</span>
        </div>
        <div className="sidebar-item">
          <div className="sidebar-icon">
            <img src={channelIcon} alt="My Channel" />
          </div>
          <span>My Channel</span>
        </div>
        <div className="sidebar-item">
          <div className="sidebar-icon">
            <img src={trendingIcon} alt="Trending" />
          </div>
          <span>Trending</span>
        </div>
        <div className="sidebar-item">
          <div className="sidebar-icon">
            <img src={subscriptionsIcon} alt="Subscriptions" />
          </div>
          <span>Subscriptions</span>
        </div>
        <div className="sidebar-item">
          <div className="sidebar-icon">
            <img src={premiumIcon} alt="Premium" />
          </div>
          <span>Premium</span>
        </div>
        <div className="sidebar-item">
          <div className="sidebar-icon">
            <img src={tvIcon} alt="TV" />
          </div>
          <span>TV</span>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="section-title">Library</div>
        <div className="sidebar-item">
          <div className="sidebar-icon">
            <img src={historyIcon} alt="History" />
          </div>
          <span>History</span>
        </div>
        <div className="sidebar-item">
          <div className="sidebar-icon">
            <img src={watchLaterIcon} alt="Watch Later" />
          </div>
          <span>Watch Later</span>
        </div>
        <div className="sidebar-item">
          <div className="sidebar-icon">
            <img src={likedVideosIcon} alt="Liked Videos" />
          </div>
          <span>Liked Videos</span>
        </div>
        <div className="sidebar-item">
          <div className="sidebar-icon">
            <img src={showMoreIcon} alt="Show More" />
          </div>
          <span>Show More</span>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="section-title">Subscriptions</div>
        <div className="sidebar-item">
          <div className="channel-avatar"></div>
          <span>Channel 1</span>
        </div>
        <div className="sidebar-item">
          <div className="channel-avatar"></div>
          <span>Channel 2</span>
        </div>
        <div className="sidebar-item">
          <div className="channel-avatar"></div>
          <span>Channel 3</span>
        </div>
        <div className="sidebar-item">
          <div className="channel-avatar"></div>
          <span>Channel 4</span>
        </div>
      </div>
    </aside>
  );
}

export default SideNavBar;
