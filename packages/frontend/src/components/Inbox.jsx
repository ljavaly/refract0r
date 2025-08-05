import '../styles/Inbox.css';

import React, { useState, useEffect } from 'react'; // Added useEffect import

function Inbox() {
    const [activeTab, setActiveTab] = useState('inbox'); // 'inbox' or 'other'
    const [activeConversation, setActiveConversation] = useState(null); // Stores the ID of the active conversation

    // Mock data for conversations
    const conversations = [
        { id: 'cirno', name: 'Cirno_tv', lastMessage: 'sounds good to me', time: '5:45pm', unread: 2, new: true },
        { id: 'main-menu-group', name: 'Main Menu Group Ro...', lastMessage: 'Time for the new emotes to come...', time: '5:44pm', participants: 12 },
        { id: 'omgisle', name: 'OMGEisIe', lastMessage: 'LOL', time: '3:45pm' },
        { id: 'shark', name: 'Shark', lastMessage: 'Thanks buddy.', time: '8:26am' },
        { id: 'geoff', name: 'Geoff', lastMessage: 'hope to see you in the cast friend', time: 'yesterday' },
        { id: 'misskaddyjins', name: 'MissKaddyjins', lastMessage: '', time: 'Jan 9' },
    ];

    // Mock data for messages in the active conversation (Main Menu Group Room)
    const messages = [
        { id: 1, user: 'iKasperr', time: '4:45pm', text: 'and bryan with the wasabi...' },
        { id: 2, user: 'iKasperr', time: '4:45pm', text: 'Topic: Darkest Dungeon Keys' },
        { id: 3, user: 'Brotatoe', time: '5:40pm', text: 'PHEW.' },
        { id: 4, user: 'tehMorag', time: '5:41pm', text: 'you put my worries to REST hardcore', avatar: 'https://placehold.co/20x20/FF0000/FFFFFF?text=T' }, // Example avatar
        { id: 5, type: 'date', date: 'Thursday. February 5th' },
        { id: 6, user: 'Brotatoe', time: '5:41pm', text: 'That was worrying' },
        { id: 7, user: 'Brotatoe', time: '5:41pm', text: 'Was getting scared we would be like "TIME TO DRAW IT ON PAPER"' },
        { id: 8, user: 'Thundercast', time: '5:42pm', text: 'So yeah, game night was fun. Pitchford\'s house is crazy. Big home theater and a game room with like every board board game and lego set ever.' },
        { id: 9, user: 'HJTanchi', time: '5:44pm', text: 'Nice!', emoji: '🎉' },
        { id: 10, user: 'tehMorag', time: '5:45pm', text: 'so, what job were you offered this time?', avatar: 'https://placehold.co/20x20/FF0000/FFFFFF?text=T' }, // Example avatar
    ];

    // Set 'Main Menu Group Room' as the default active conversation
    useEffect(() => {
        setActiveConversation('main-menu-group');
    }, []);

    return (
        <>
            <div className="inbox-container">
                {/* Sidebar */}
                <div className="sidebar">
                    <div>
                        <button className="tab-button">New Message</button>
                    </div>
                    <div className="tabs-container grid grid-cols-2">
                        <button
                            className={`tab-button col-span-2 ${activeTab === 'inbox' ? 'active' : ''}`}
                            onClick={() => setActiveTab('inbox')}
                        >
                            Inbox ({conversations.filter(c => c.unread).length})
                        </button>
                        <button
                            className={`tab-button col-span-2 ${activeTab === 'other' ? 'active' : ''}`}
                            onClick={() => setActiveTab('other')}
                        >
                            Other (15)
                        </button>
                    </div>

                    <div className="conversation-list">
                        {conversations.map((conv) => (
                            <div
                                key={conv.id}
                                className={`conversation-item ${activeConversation === conv.id ? 'active' : ''}`}
                                onClick={() => setActiveConversation(conv.id)}
                            >
                                {conv.new && <div className="conversation-unread-indicator"></div>}
                                <div className="conversation-avatar">
                                    {conv.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="conversation-details">
                                    <div className="conversation-name">{conv.name}</div>
                                    <div className="conversation-last-message">{conv.lastMessage}</div>
                                </div>
                                <div className="conversation-time">{conv.time}</div>
                                <div className="conversation-actions">
                                    {conv.new && (
                                        <svg className="conversation-action-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path></svg>
                                    )}
                                    <svg className="conversation-action-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="main-content">
                    <div className="main-content-header">
                        <div>
                            <span className="main-content-title">Main Menu Group Room</span>
                            <span className="main-content-subtitle">12 participants</span>
                        </div>
                        {/* Removed the settings icon here */}
                    </div>

                    <div className="chat-messages">
                        {messages.map((message) => (
                            message.type === 'date' ? (
                                <div key={message.id} className="date-separator">
                                    {message.date}
                                </div>
                            ) : (
                                <div key={message.id} className="message-item">
                                    {message.avatar ? (
                                        <img src={message.avatar} alt="User Avatar" className="message-avatar-small" />
                                    ) : (
                                        <div className="message-avatar-small" style={{ backgroundColor: '#4b4b50', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                                            {message.user.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="message-content-wrapper">
                                        <div className="message-header">
                                            <span className={`message-username username-color-${(message.id % 3) + 1}`}>
                                                {message.user}
                                            </span>
                                            <span className="message-time">{message.time}</span>
                                        </div>
                                        <div className="message-text">
                                            {message.text} {message.emoji && <span className="emoji">{message.emoji}</span>}
                                        </div>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>

                    <div className="message-input-area">
                        <textarea
                            className="message-input"
                            placeholder="Send a message"
                            rows="1" // Start with one row
                        ></textarea>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Inbox;
