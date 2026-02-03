const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = messageInput.value.trim();

    if (userMessage) {
        displayMessage(userMessage, 'user');
        messageInput.value = '';
        toggleInput(false);
        showTypingIndicator();

        try {
            // Send the user's message to YOUR backend server
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'The server responded with an error.');
            }

            const data = await response.json();
            displayMessage(data.reply, 'bot');

        } catch (error) {
            console.error("Error communicating with the server:", error);
            displayMessage(`Error: ${error.message}`, 'bot');
        } finally {
            hideTypingIndicator();
            toggleInput(true);
        }
    }
});

function displayMessage(message, sender) {
    const bubbleWrapper = document.createElement('div');
    bubbleWrapper.className = `chat-bubble ${sender}-bubble`;
    const messageElement = document.createElement('div');
    messageElement.className = `p-3 rounded-lg ${sender === 'user' ? 'bg-cyan-600' : 'bg-gray-700'}`;
    messageElement.textContent = message;
    bubbleWrapper.appendChild(messageElement);
    chatWindow.appendChild(bubbleWrapper);
    scrollToBottom();
}

// --- UI & Utility Functions ---
function toggleInput(enabled) {
    messageInput.disabled = !enabled;
    sendButton.disabled = !enabled;
    if (enabled) messageInput.focus();
}

function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'typing-indicator';
    indicator.className = 'chat-bubble bot-bubble';
    indicator.innerHTML = `<div class="bg-gray-700 p-3 rounded-lg typing-indicator"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`;
    chatWindow.appendChild(indicator);
    scrollToBottom();
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

function scrollToBottom() {
    chatWindow.scrollTop = chatWindow.scrollHeight;
}
