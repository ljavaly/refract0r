import React, { useState } from 'react';
import NavBar from './components/NavBar';
import VideoStream from './components/VideoStream';
import Inbox from './components/Inbox';
import './App.css';
import VideoFeed from './components/VideoFeed';

function App() {
  const [currentPage, setCurrentPage] = useState('stream'); // Default to 'video' page

  // Function to handle page navigation
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <NavBar onPageChange={handlePageChange} />
      <main className="flex-1 overflow-hidden">
        {currentPage === 'stream' && <VideoStream />}
        {currentPage === 'browse' && <VideoFeed />}
        {currentPage === 'inbox' && <Inbox />}
      </main>
    </div>
  )
}

export default App
