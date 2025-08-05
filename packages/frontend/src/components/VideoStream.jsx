import React, { useEffect, useRef, useState } from 'react';
import '../styles/VideoStream.css';

function VideoStream() {
    // Ref for the user's video element
    const userVideoRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);

    useEffect(() => {
        const startLocalCamera = async () => {
            if (isCameraOn) { // Only try to get media if camera is meant to be on
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        audio: false,
                        video: { width: 640, height: 480 },
                    });

                    if (userVideoRef.current) {
                        userVideoRef.current.srcObject = stream;
                        userVideoRef.current.onloadedmetadata = () => {
                            userVideoRef.current.play();
                        };
                    }
                } catch (err) {
                    console.error("Error accessing user media:", err);
                    // Handle user denying camera access or other errors
                    setIsCameraOn(false); // Turn off the toggle if access fails
                }
            } else {
                // If camera is off, stop any existing stream
                if (userVideoRef.current && userVideoRef.current.srcObject) {
                    const stream = userVideoRef.current.srcObject;
                    const tracks = stream.getTracks();
                    tracks.forEach(track => track.stop());
                    userVideoRef.current.srcObject = null; // Clear the video source
                }
            }
        };

        startLocalCamera();

        // Cleanup function: stop the camera stream when the component unmounts
        // or when isCameraOn becomes false
        return () => {
            if (userVideoRef.current && userVideoRef.current.srcObject) {
                const stream = userVideoRef.current.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, [isCameraOn]); // Add isCameraOn to the dependency array

    return (
        <>
            <div className="video-container">
                <div className="video-box">
                    <video id="user-video" ref={userVideoRef} autoPlay muted className="video-element"></video>
                    <div className="stream-label">Your Stream</div>
                </div>

                {/* Button to toggle camera */}
                <button
                    onClick={() => setIsCameraOn(prev => !prev)}
                    className="camera-toggle-button" // Applied the new CSS class
                >
                    {isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
                </button>
            </div>
        </>
    );
}

export default VideoStream;
