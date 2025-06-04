// Initialize variables
let activeAgent = null;
let apiStatus = {
    online: false,
    apiAvailable: false
};

// Check API status
async function checkApiStatus() {
    try {
        const response = await fetch('/api/status');
        if (response.ok) {
            const data = await response.json();
            apiStatus.online = true;
            apiStatus.apiAvailable = data.api_available;
            
            if (!data.api_available) {
                showErrorMessage("Running in demo mode. AI responses are simulated.");
            }
            
            console.log("API Status:", apiStatus);
        } else {
            throw new Error("API status check failed");
        }
    } catch (error) {
        console.error("Error checking API status:", error);
        apiStatus.online = false;
        apiStatus.apiAvailable = false;
        showErrorMessage("Backend API is not available. Running in offline mode.");
    }
}

// AI Agent definitions
const agents = [
    // Productivity Category
    {
        id: 1,
        name: "Task Manager",
        description: "Helps you organize tasks, set priorities, and manage deadlines efficiently.",
        icon: "schedule",
        category: "productivity",
        tags: ["Organization", "Planning", "Reminders"],
        systemPrompt: "You are a Task Manager AI assistant. Help the user organize tasks, set priorities, and manage deadlines efficiently."
    },
    {
        id: 2,
        name: "Email Assistant",
        description: "Drafts, summarizes, and organizes emails to save you time and improve communication.",
        icon: "email",
        category: "productivity",
        tags: ["Email", "Communication", "Drafting"],
        systemPrompt: "You are an Email Assistant AI. Help the user draft, summarize, and organize emails to save time and improve communication."
    },
    {
        id: 3,
        name: "Meeting Facilitator",
        description: "Takes notes during meetings, creates summaries, and helps track action items.",
        icon: "groups",
        category: "productivity",
        tags: ["Meetings", "Notes", "Action Items"],
        systemPrompt: "You are a Meeting Facilitator AI. Help the user take notes during meetings, create summaries, and track action items."
    },
    
    // Creative Category
    {
        id: 4,
        name: "Content Creator",
        description: "Generates creative content for blogs, social media, and marketing materials.",
        icon: "edit",
        category: "creative",
        tags: ["Writing", "Marketing", "Social Media"],
        systemPrompt: "You are a Content Creator AI. Help the user generate creative content for blogs, social media, and marketing materials."
    },
    {
        id: 5,
        name: "Design Assistant",
        description: "Provides design suggestions, color palettes, and layout ideas for various projects.",
        icon: "brush",
        category: "creative",
        tags: ["Design", "UI/UX", "Graphics"],
        systemPrompt: "You are a Design Assistant AI. Help the user with design suggestions, color palettes, and layout ideas for various projects."
    },
    {
        id: 6,
        name: "Brainstorm Buddy",
        description: "Helps generate ideas, overcome creative blocks, and expand on concepts.",
        icon: "lightbulb",
        category: "creative",
        tags: ["Ideation", "Creativity", "Problem Solving"],
        systemPrompt: "You are a Brainstorm Buddy AI. Help the user generate ideas, overcome creative blocks, and expand on concepts."
    },
    
    // Research Category
    {
        id: 7,
        name: "Research Analyst",
        description: "Gathers and analyzes information from various sources to support your research.",
        icon: "analytics",
        category: "research",
        tags: ["Analysis", "Data", "Information"],
        systemPrompt: "You are a Research Analyst AI. Help the user gather and analyze information from various sources to support their research."
    },
    {
        id: 8,
        name: "Market Researcher",
        description: "Provides insights on market trends, competitor analysis, and consumer behavior.",
        icon: "trending_up",
        category: "research",
        tags: ["Market Trends", "Competitors", "Consumer Insights"],
        systemPrompt: "You are a Market Researcher AI. Help the user with insights on market trends, competitor analysis, and consumer behavior."
    },
    {
        id: 9,
        name: "Academic Assistant",
        description: "Helps with literature reviews, citation formatting, and academic writing.",
        icon: "school",
        category: "research",
        tags: ["Academic", "Citations", "Literature"],
        systemPrompt: "You are an Academic Assistant AI. Help the user with literature reviews, citation formatting, and academic writing."
    },
    
    // Development Category
    {
        id: 10,
        name: "Code Helper",
        description: "Assists with coding problems, debugging, and implementing best practices.",
        icon: "code",
        category: "development",
        tags: ["Coding", "Debugging", "Best Practices"],
        systemPrompt: "You are a Code Helper AI. Assist the user with coding problems, debugging, and implementing best practices."
    },
    {
        id: 11,
        name: "DevOps Assistant",
        description: "Helps with deployment, CI/CD pipelines, and infrastructure management.",
        icon: "cloud",
        category: "development",
        tags: ["DevOps", "Deployment", "Infrastructure"],
        systemPrompt: "You are a DevOps Assistant AI. Help the user with deployment, CI/CD pipelines, and infrastructure management."
    },
    {
        id: 12,
        name: "Documentation Writer",
        description: "Creates clear and comprehensive documentation for code and projects.",
        icon: "description",
        category: "development",
        tags: ["Documentation", "Technical Writing", "Guides"],
        systemPrompt: "You are a Documentation Writer AI. Help the user create clear and comprehensive documentation for code and projects."
    }
];

// DOM Elements
let agentsGrid;
let categoryTabs;
let workspace;
let activeAgentName;
let chatMessages;
let userInput;
let sendMessageButton;
let closeWorkspaceButton;
let ctaButton;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize DOM elements
    agentsGrid = document.getElementById('agents-grid');
    categoryTabs = document.querySelectorAll('.tab-button');
    workspace = document.getElementById('workspace');
    activeAgentName = document.getElementById('active-agent-name');
    chatMessages = document.getElementById('chat-messages');
    userInput = document.getElementById('user-input');
    sendMessageButton = document.getElementById('send-message');
    closeWorkspaceButton = document.getElementById('close-workspace');
    ctaButton = document.querySelector('.cta-button');
    
    // Check API status
    checkApiStatus();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load initial agents (default: productivity)
    loadAgentsByCategory('productivity');
});

// Set up event listeners
function setupEventListeners() {
    // Category tab buttons
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            categoryTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Load agents for the selected category
            const category = tab.getAttribute('data-category');
            loadAgentsByCategory(category);
        });
    });
    
    // CTA button
    ctaButton.addEventListener('click', () => {
        // Scroll to agent categories section
        document.querySelector('.agent-categories').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Close workspace button
    closeWorkspaceButton.addEventListener('click', () => {
        closeWorkspace();
    });
    
    // Send message button
    sendMessageButton.addEventListener('click', () => {
        sendMessage();
    });
    
    // User input keypress (Enter to send)
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
}

// Load agents by category
async function loadAgentsByCategory(category) {
    // Clear the agents grid
    agentsGrid.innerHTML = '';
    
    try {
        let agentsToDisplay = [];
        
        // Try to fetch agents from the API if it's online
        if (apiStatus.online) {
            const response = await fetch(`/api/agents?category=${category}`);
            if (response.ok) {
                agentsToDisplay = await response.json();
            } else {
                throw new Error("Failed to fetch agents");
            }
        } else {
            // Fallback to client-side filtering if API is not available
            agentsToDisplay = agents.filter(agent => agent.category === category);
        }
        
        // Create and append agent cards
        agentsToDisplay.forEach(agent => {
            const agentCard = createAgentCard(agent);
            agentsGrid.appendChild(agentCard);
        });
    } catch (error) {
        console.error("Error loading agents:", error);
        // Fallback to client-side filtering
        const filteredAgents = agents.filter(agent => agent.category === category);
        filteredAgents.forEach(agent => {
            const agentCard = createAgentCard(agent);
            agentsGrid.appendChild(agentCard);
        });
    }
}

// Create an agent card
function createAgentCard(agent) {
    const card = document.createElement('div');
    card.className = 'agent-card';
    
    const agentImage = document.createElement('div');
    agentImage.className = 'agent-image';
    agentImage.setAttribute('data-category', agent.category);
    
    const icon = document.createElement('span');
    icon.className = 'material-icons';
    icon.textContent = agent.icon;
    agentImage.appendChild(icon);
    
    const agentInfo = document.createElement('div');
    agentInfo.className = 'agent-info';
    
    const name = document.createElement('h3');
    name.textContent = agent.name;
    
    const description = document.createElement('p');
    description.textContent = agent.description;
    
    const tags = document.createElement('div');
    tags.className = 'agent-tags';
    
    agent.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'agent-tag';
        tagElement.textContent = tag;
        tags.appendChild(tagElement);
    });
    
    const useButton = document.createElement('button');
    useButton.className = 'use-agent-button';
    useButton.textContent = 'Use This Assistant';
    useButton.addEventListener('click', () => {
        openWorkspace(agent);
    });
    
    agentInfo.appendChild(name);
    agentInfo.appendChild(description);
    agentInfo.appendChild(tags);
    agentInfo.appendChild(useButton);
    
    card.appendChild(agentImage);
    card.appendChild(agentInfo);
    
    return card;
}

// Open the workspace with the selected agent
function openWorkspace(agent) {
    // Set the active agent
    activeAgent = agent;
    
    // Update the workspace header
    activeAgentName.textContent = agent.name;
    
    // Clear previous messages
    chatMessages.innerHTML = '';
    
    // Add welcome message
    addAgentMessage(`Hi there! I'm your ${agent.name}. ${agent.description} How can I help you today?`);
    
    // Show the workspace
    workspace.classList.add('active');
    
    // Focus on the input field
    userInput.focus();
}

// Close the workspace
function closeWorkspace() {
    workspace.classList.remove('active');
    activeAgent = null;
}

// Send a message
async function sendMessage() {
    const message = userInput.value.trim();
    
    // Don't send empty messages
    if (!message || !activeAgent) return;
    
    // Add user message to chat
    addUserMessage(message);
    
    // Clear input field
    userInput.value = '';
    
    try {
        // Show typing indicator
        const typingIndicator = addTypingIndicator();
        
        // Generate response using Google ADK
        const response = await generateResponse(message, activeAgent.systemPrompt);
        
        // Remove typing indicator
        typingIndicator.remove();
        
        // Add agent response to chat
        addAgentMessage(response);
    } catch (error) {
        console.error('Error generating response:', error);
        
        // Remove typing indicator if it exists
        const indicator = document.querySelector('.typing-indicator');
        if (indicator) indicator.remove();
        
        // Show error message
        addAgentMessage("I'm sorry, I encountered an error while processing your request. Please try again.");
    }
}

// Generate a response using the backend API
async function generateResponse(message, systemPrompt) {
    try {
        // If the API is online, use it
        if (apiStatus.online) {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    systemPrompt: systemPrompt,
                    category: activeAgent.category
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.response;
            } else {
                throw new Error("API request failed");
            }
        }
        
        // Fallback to client-side simulated responses if API is not available
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate different responses based on the agent type
                const agentType = activeAgent.category;
                let response = "";
                
                switch (agentType) {
                    case "productivity":
                        response = "I've analyzed your request and can help you organize this task efficiently. Let's break it down into manageable steps and set priorities.";
                        break;
                    case "creative":
                        response = "That's an interesting idea! I can help you develop this concept further. Here are some creative directions we could explore...";
                        break;
                    case "research":
                        response = "Based on recent data, I can provide you with comprehensive information on this topic. Let me gather the most relevant insights for you.";
                        break;
                    case "development":
                        response = "I've reviewed your code question. Here's a solution that follows best practices and should resolve the issue you're facing.";
                        break;
                    default:
                        response = "I understand your request and I'm here to help. Let me know what specific assistance you need.";
                }
                
                resolve(response);
            }, 1500); // Simulate a 1.5 second delay for response generation
        });
    } catch (error) {
        console.error("Error generating response:", error);
        return "I'm having trouble processing your request. Please try again.";
    }
}

// Add a user message to the chat
function addUserMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message user-message';
    messageElement.textContent = message;
    
    chatMessages.appendChild(messageElement);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add an agent message to the chat
function addAgentMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message agent-message';
    messageElement.textContent = message;
    
    chatMessages.appendChild(messageElement);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return messageElement;
}

// Add a typing indicator
function addTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'message agent-message typing-indicator';
    indicator.innerHTML = '<span>.</span><span>.</span><span>.</span>';
    
    chatMessages.appendChild(indicator);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return indicator;
}

// Show an error message to the user
function showErrorMessage(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    document.body.appendChild(errorElement);
    
    // Remove after 5 seconds
    setTimeout(() => {
        errorElement.classList.add('fade-out');
        setTimeout(() => {
            errorElement.remove();
        }, 500);
    }, 5000);
}