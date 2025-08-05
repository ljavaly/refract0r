const express = require('express');
const router = express.Router();

// Mock data for conversations
const conversations = [
    { 
        id: 'cirno', 
        name: 'Cirno_tv', 
        lastMessage: 'sounds good to me', 
        time: '5:45pm', 
        unread: 2, 
        new: true,
        isGroup: false,
        status: 'online'
    },
    { 
        id: 'main-menu-group', 
        name: 'Main Menu Group Room', 
        lastMessage: 'Time for the new emotes to come...', 
        time: '5:44pm', 
        participants: 12,
        isGroup: true,
        status: 'active'
    },
    { 
        id: 'omgisle', 
        name: 'OMGEisIe', 
        lastMessage: 'LOL', 
        time: '3:45pm',
        isGroup: false,
        status: 'away'
    },
    { 
        id: 'shark', 
        name: 'Shark', 
        lastMessage: 'Thanks buddy.', 
        time: '8:26am',
        isGroup: false,
        status: 'offline'
    },
    { 
        id: 'geoff', 
        name: 'Geoff', 
        lastMessage: 'hope to see you in the cast friend', 
        time: 'yesterday',
        isGroup: false,
        status: 'offline'
    },
];

// Mock data for users
const users = {
    'iKasperr': {
        id: 'user1',
        username: 'iKasperr',
        email: 'ikasperr@example.com',
        avatar: null,
        createdAt: '2024-01-01'
    },
    'Brotatoe': {
        id: 'user2',
        username: 'Brotatoe',
        email: 'brotatoe@example.com',
        avatar: null,
        createdAt: '2024-01-02'
    },
    'tehMorag': {
        id: 'user3',
        username: 'tehMorag',
        email: 'tehmorag@example.com',
        avatar: 'https://placehold.co/20x20/FF0000/FFFFFF?text=T',
        createdAt: '2024-01-03'
    },
    'Thundercast': {
        id: 'user4',
        username: 'Thundercast',
        email: 'thundercast@example.com',
        avatar: null,
        createdAt: '2024-01-04'
    },
    'HJTanchi': {
        id: 'user5',
        username: 'HJTanchi',
        email: 'hjtanchi@example.com',
        avatar: null,
        createdAt: '2024-01-05'
    }
};

// Mock data for messages by conversation
const messagesByConversation = {
    'main-menu-group': [
        { 
            id: 1, 
            user: 'iKasperr', 
            time: '4:45pm', 
            text: 'and bryan with the wasabi...',
            avatar: null,
            emoji: null
        },
        { 
            id: 2, 
            user: 'iKasperr', 
            time: '4:45pm', 
            text: 'Topic: Darkest Dungeon Keys',
            avatar: null,
            emoji: null
        },
        { 
            id: 3, 
            user: 'Brotatoe', 
            time: '5:40pm', 
            text: 'PHEW.',
            avatar: null,
            emoji: null
        },
        { 
            id: 4, 
            user: 'tehMorag', 
            time: '5:41pm', 
            text: 'you put my worries to REST hardcore', 
            avatar: 'https://placehold.co/20x20/FF0000/FFFFFF?text=T',
            emoji: null
        },
        { id: 5, type: 'date', date: 'Thursday. February 5th' },
        { 
            id: 6, 
            user: 'Brotatoe', 
            time: '5:41pm', 
            text: 'That was worrying',
            avatar: null,
            emoji: null
        },
        { 
            id: 7, 
            user: 'Brotatoe', 
            time: '5:41pm', 
            text: 'Was getting scared we would be like "TIME TO DRAW IT ON PAPER"',
            avatar: null,
            emoji: null
        },
        { 
            id: 8, 
            user: 'Thundercast', 
            time: '5:42pm', 
            text: 'So yeah, game night was fun. Pitchford\'s house is crazy. Big home theater and a game room with like every board board game and lego set ever.',
            avatar: null,
            emoji: null
        },
        { 
            id: 9, 
            user: 'HJTanchi', 
            time: '5:44pm', 
            text: 'Nice!', 
            avatar: null,
            emoji: '🎉'
        },
        { 
            id: 10, 
            user: 'tehMorag', 
            time: '5:45pm', 
            text: 'so, what job were you offered this time?', 
            avatar: 'https://placehold.co/20x20/FF0000/FFFFFF?text=T',
            emoji: null
        },
    ],
    'cirno': [
        { 
            id: 1, 
            user: 'Cirno_tv', 
            time: '5:45pm', 
            text: 'sounds good to me',
            avatar: null,
            emoji: null
        }
    ],
    'omgisle': [
        { 
            id: 1, 
            user: 'OMGEisIe', 
            time: '3:45pm', 
            text: 'LOL',
            avatar: null,
            emoji: null
        }
    ],
    'shark': [
        { 
            id: 1, 
            user: 'Shark', 
            time: '8:26am', 
            text: 'Thanks buddy.',
            avatar: null,
            emoji: null
        }
    ],
    'geoff': [
        { 
            id: 1, 
            user: 'Geoff', 
            time: 'yesterday', 
            text: 'hope to see you in the cast friend',
            avatar: null,
            emoji: null
        }
    ]
};

// GET /api/conversations - Get all conversations
router.get('/', (req, res) => {
    res.json(conversations);
});

// GET /api/conversations/:id - Get conversation details and messages
router.get('/:id', (req, res) => {
    const conversationId = req.params.id;
    
    // Find the conversation
    const conversation = conversations.find(conv => conv.id === conversationId);
    
    if (!conversation) {
        return res.status(404).json({ 
            error: 'Conversation not found',
            message: `Conversation with id ${conversationId} does not exist`
        });
    }
    
    // Get messages for this conversation
    const messages = messagesByConversation[conversationId] || [];
    
    // Return conversation details with messages
    res.json({
        conversation,
        messages,
        users
    });
});

module.exports = router; 