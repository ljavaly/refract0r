import React, { useState } from 'react';
import NavBar from './components/NavBar';
import VideoStream from './components/VideoStream';
import Inbox from './components/Inbox';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('video'); // Default to 'video' page

  // Function to handle page navigation
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <NavBar onPageChange={handlePageChange} />
      <main className="flex-grow">
        {/* Conditional rendering based on currentPage state */}
        {currentPage === 'video' && <VideoStream />}
        {currentPage === 'inbox' && <Inbox />}
      </main>
    </>
  )
}

export default App
