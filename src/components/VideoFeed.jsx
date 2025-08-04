import React from 'react';
import '../styles/VideoFeed.css';

function VideoFeed() {
    return (
        <div className="video-feed-container">
            {/* Top Navigation Bar */}
            <header className="top-nav">
                <div className="nav-left">
                    <div className="hamburger-menu">
                        <div className="hamburger-line"></div>
                        <div className="hamburger-line"></div>
                        <div className="hamburger-line"></div>
                    </div>
                    <div className="logo-placeholder">
                        <div className="logo-icon"></div>
                        <span className="logo-text">LOGO</span>
                    </div>
                </div>
                
                <div className="nav-center">
                    <div className="search-container">
                        <input type="text" placeholder="Search" className="search-input" />
                        <div className="search-icon"></div>
                    </div>
                </div>
                
                <div className="nav-right">
                    <div className="nav-links">
                        <span className="nav-link">Home</span>
                        <span className="nav-link">Trending</span>
                        <span className="nav-link">Subscriptions</span>
                    </div>
                </div>
            </header>

            <div className="main-layout">
                {/* Left Sidebar */}
                <aside className="sidebar">
                    <div className="sidebar-section">
                        <div className="sidebar-item active">
                            <div className="sidebar-icon"></div>
                            <span>Home</span>
                        </div>
                        <div className="sidebar-item">
                            <div className="sidebar-icon"></div>
                            <span>My Channel</span>
                        </div>
                        <div className="sidebar-item">
                            <div className="sidebar-icon"></div>
                            <span>Trending</span>
                        </div>
                        <div className="sidebar-item">
                            <div className="sidebar-icon"></div>
                            <span>Subscriptions</span>
                        </div>
                        <div className="sidebar-item">
                            <div className="sidebar-icon"></div>
                            <span>Premium</span>
                        </div>
                        <div className="sidebar-item">
                            <div className="sidebar-icon"></div>
                            <span>TV</span>
                        </div>
                    </div>

                    <div className="sidebar-section">
                        <div className="section-title">Library</div>
                        <div className="sidebar-item">
                            <div className="sidebar-icon"></div>
                            <span>History</span>
                        </div>
                        <div className="sidebar-item">
                            <div className="sidebar-icon"></div>
                            <span>Watch Later</span>
                        </div>
                        <div className="sidebar-item">
                            <div className="sidebar-icon"></div>
                            <span>Liked Videos</span>
                        </div>
                        <div className="sidebar-item">
                            <div className="sidebar-icon"></div>
                            <span>Playlist 1</span>
                        </div>
                        <div className="sidebar-item">
                            <div className="sidebar-icon"></div>
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

                {/* Main Content Area */}
                <main className="main-content">
                    <div className="content-section">
                        <h2 className="section-header">Recommended</h2>
                        <div className="video-grid">
                            {[...Array(6)].map((_, index) => (
                                <div key={index} className="video-card">
                                    <div className="video-thumbnail"></div>
                                    <div className="video-info">
                                        <div className="video-title">Video Title {index + 1}</div>
                                        <div className="video-meta">
                                            <span className="channel-name">Channel Name</span>
                                            <span className="video-stats">Views • Time</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="content-section">
                        <div className="section-header-with-link">
                            <h2 className="section-header">From your subscriptions</h2>
                            <span className="see-all-link">See all</span>
                        </div>
                        <div className="video-grid">
                            {[...Array(3)].map((_, index) => (
                                <div key={index} className="video-card">
                                    <div className="video-thumbnail"></div>
                                    <div className="video-info">
                                        <div className="video-title">Subscription Video {index + 1}</div>
                                        <div className="video-meta">
                                            <span className="channel-name">Subscribed Channel</span>
                                            <span className="video-stats">Views • Time</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="content-section">
                        <h2 className="section-header">Recommended</h2>
                        <div className="video-grid">
                            {[...Array(6)].map((_, index) => (
                                <div key={index} className="video-card">
                                    <div className="video-thumbnail"></div>
                                    <div className="video-info">
                                        <div className="video-title">Recommended Video {index + 1}</div>
                                        <div className="video-meta">
                                            <span className="channel-name">Channel Name</span>
                                            <span className="video-stats">Views • Time</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default VideoFeed; 