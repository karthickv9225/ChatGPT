const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const messagesContainer = document.getElementById('messages');
const chatContainer = document.getElementById('chatContainer');
const welcomeScreen = document.getElementById('welcomeScreen');
const newChatBtn = document.getElementById('newChatBtn');
const recentChatsContainer = document.getElementById('recentChats');

let chatHistory = [];
let currentChatTitle = '';
let conversations = loadConversations();

// Load conversations from localStorage
function loadConversations() {
    const saved = localStorage.getItem('conversations');
    return saved ? JSON.parse(saved) : [];
}

// Save conversations to localStorage
function saveConversations() {
    localStorage.setItem('conversations', JSON.stringify(conversations));
    updateSidebar();
}

// Update sidebar with conversations
function updateSidebar() {
    if (conversations.length === 0) {
        recentChatsContainer.innerHTML = '<p class="empty-text">No previous conversations</p>';
    } else {
        recentChatsContainer.innerHTML = conversations.map((conv, index) => `
            <a href="#" class="nav-item chat-item" data-index="${index}">
                ${conv.title}
            </a>
        `).join('');

        // Add click handlers
        document.querySelectorAll('.chat-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                loadConversation(parseInt(e.target.dataset.index));
            });
        });
    }
}

// Load a conversation
function loadConversation(index) {
    const conv = conversations[index];
    chatHistory = conv.messages;
    currentChatTitle = conv.title;
    
    welcomeScreen.style.display = 'none';
    messagesContainer.innerHTML = '';
    
    chatHistory.forEach(msg => {
        addMessage(msg.content, msg.role);
    });
}

// Save current conversation
function saveCurrentConversation() {
    if (chatHistory.length === 0) return;

    // Generate title from first message
    if (!currentChatTitle) {
        const firstMessage = chatHistory[0].content;
        currentChatTitle = firstMessage.substring(0, 50) + (firstMessage.length > 50 ? '...' : '');
    }

    // Check if conversation already exists
    const existingIndex = conversations.findIndex(c => c.title === currentChatTitle);
    
    const conversationData = {
        title: currentChatTitle,
        messages: chatHistory,
        timestamp: new Date().toISOString()
    };

    if (existingIndex >= 0) {
        conversations[existingIndex] = conversationData;
    } else {
        conversations.unshift(conversationData);
    }

    // Keep only last 20 conversations
    if (conversations.length > 20) {
        conversations = conversations.slice(0, 20);
    }

    saveConversations();
}

// Send message on button click
sendBtn.addEventListener('click', sendMessage);

// Send message on Enter key
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// New chat button
newChatBtn.addEventListener('click', () => {
    saveCurrentConversation();
    chatHistory = [];
    currentChatTitle = '';
    messagesContainer.innerHTML = '';
    welcomeScreen.style.display = 'flex';
    messageInput.focus();
});

async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message) return;

    // Hide welcome screen
    welcomeScreen.style.display = 'none';

    // Add user message to UI
    addMessage(message, 'user');
    
    // Clear input
    messageInput.value = '';
    
    // Disable send button
    sendBtn.disabled = true;

    // Show typing indicator
    const typingId = showTypingIndicator();

    try {
        // Send to backend
        const response = await fetch('http://localhost:5000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });

        if (!response.ok) {
            throw new Error('Failed to get response');
        }

        const data = await response.json();
        
        // Remove typing indicator
        removeTypingIndicator(typingId);
        
        // Add AI response to UI
        addMessage(data.response, 'ai');

        // Save to chat history
        chatHistory.push({ role: 'user', content: message });
        chatHistory.push({ role: 'ai', content: data.response });
        
        // Save conversation
        saveCurrentConversation();

    } catch (error) {
        console.error('Error:', error);
        removeTypingIndicator(typingId);
        addMessage('Sorry, I encountered an error. Please make sure the backend server is running.', 'ai');
    } finally {
        sendBtn.disabled = false;
        messageInput.focus();
    }
}

function addMessage(content, role) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}-message`;
    
    const avatar = role === 'user' ? 'K' : 'AI';
    const roleName = role === 'user' ? 'You' : 'ChatGPT';
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <div class="message-avatar">${avatar}</div>
            <span class="message-role">${roleName}</span>
        </div>
        <div class="message-content">
            <p>${formatMessage(content)}</p>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function formatMessage(text) {
    // Basic markdown-like formatting
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/`(.*?)`/g, '<code>$1</code>');
    text = text.replace(/\n/g, '<br>');
    return text;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message';
    typingDiv.id = 'typing-indicator';
    
    typingDiv.innerHTML = `
        <div class="message-header">
            <div class="message-avatar">AI</div>
            <span class="message-role">ChatGPT</span>
        </div>
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    return 'typing-indicator';
}

function removeTypingIndicator(id) {
    const typingDiv = document.getElementById(id);
    if (typingDiv) {
        typingDiv.remove();
    }
}

// Focus input on load
messageInput.focus();

// Initialize sidebar
updateSidebar();
