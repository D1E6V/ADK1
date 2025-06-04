import os
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__, static_folder='.')
CORS(app)  # Enable CORS for all routes

# Configure Google Generative AI with API key
try:
    API_KEY = os.getenv('GOOGLE_ADK_API_KEY')
    if API_KEY:
        genai.configure(api_key=API_KEY)
        print("Google ADK API configured successfully")
    else:
        print("No API key found. Set GOOGLE_ADK_API_KEY in .env file")
except Exception as e:
    print(f"Error configuring Google ADK API: {e}")

# Agent categories and definitions
agents = {
    "productivity": [
        {
            "id": 1,
            "name": "Task Manager",
            "description": "Helps you organize tasks, set priorities, and manage deadlines efficiently.",
            "icon": "schedule",
            "category": "productivity",
            "tags": ["Organization", "Planning", "Reminders"],
            "systemPrompt": "You are a Task Manager AI assistant. Help the user organize tasks, set priorities, and manage deadlines efficiently."
        },
        {
            "id": 2,
            "name": "Email Assistant",
            "description": "Drafts, summarizes, and organizes emails to save you time and improve communication.",
            "icon": "email",
            "category": "productivity",
            "tags": ["Email", "Communication", "Drafting"],
            "systemPrompt": "You are an Email Assistant AI. Help the user draft, summarize, and organize emails to save time and improve communication."
        },
        {
            "id": 3,
            "name": "Meeting Facilitator",
            "description": "Takes notes during meetings, creates summaries, and helps track action items.",
            "icon": "groups",
            "category": "productivity",
            "tags": ["Meetings", "Notes", "Action Items"],
            "systemPrompt": "You are a Meeting Facilitator AI. Help the user take notes during meetings, create summaries, and track action items."
        }
    ],
    "creative": [
        {
            "id": 4,
            "name": "Content Creator",
            "description": "Generates creative content for blogs, social media, and marketing materials.",
            "icon": "edit",
            "category": "creative",
            "tags": ["Writing", "Marketing", "Social Media"],
            "systemPrompt": "You are a Content Creator AI. Help the user generate creative content for blogs, social media, and marketing materials."
        },
        {
            "id": 5,
            "name": "Design Assistant",
            "description": "Provides design suggestions, color palettes, and layout ideas for various projects.",
            "icon": "brush",
            "category": "creative",
            "tags": ["Design", "UI/UX", "Graphics"],
            "systemPrompt": "You are a Design Assistant AI. Help the user with design suggestions, color palettes, and layout ideas for various projects."
        },
        {
            "id": 6,
            "name": "Brainstorm Buddy",
            "description": "Helps generate ideas, overcome creative blocks, and expand on concepts.",
            "icon": "lightbulb",
            "category": "creative",
            "tags": ["Ideation", "Creativity", "Problem Solving"],
            "systemPrompt": "You are a Brainstorm Buddy AI. Help the user generate ideas, overcome creative blocks, and expand on concepts."
        }
    ],
    "research": [
        {
            "id": 7,
            "name": "Research Analyst",
            "description": "Gathers and analyzes information from various sources to support your research.",
            "icon": "analytics",
            "category": "research",
            "tags": ["Analysis", "Data", "Information"],
            "systemPrompt": "You are a Research Analyst AI. Help the user gather and analyze information from various sources to support their research."
        },
        {
            "id": 8,
            "name": "Market Researcher",
            "description": "Provides insights on market trends, competitor analysis, and consumer behavior.",
            "icon": "trending_up",
            "category": "research",
            "tags": ["Market Trends", "Competitors", "Consumer Insights"],
            "systemPrompt": "You are a Market Researcher AI. Help the user with insights on market trends, competitor analysis, and consumer behavior."
        },
        {
            "id": 9,
            "name": "Academic Assistant",
            "description": "Helps with literature reviews, citation formatting, and academic writing.",
            "icon": "school",
            "category": "research",
            "tags": ["Academic", "Citations", "Literature"],
            "systemPrompt": "You are an Academic Assistant AI. Help the user with literature reviews, citation formatting, and academic writing."
        }
    ],
    "development": [
        {
            "id": 10,
            "name": "Code Helper",
            "description": "Assists with coding problems, debugging, and implementing best practices.",
            "icon": "code",
            "category": "development",
            "tags": ["Coding", "Debugging", "Best Practices"],
            "systemPrompt": "You are a Code Helper AI. Assist the user with coding problems, debugging, and implementing best practices."
        },
        {
            "id": 11,
            "name": "DevOps Assistant",
            "description": "Helps with deployment, CI/CD pipelines, and infrastructure management.",
            "icon": "cloud",
            "category": "development",
            "tags": ["DevOps", "Deployment", "Infrastructure"],
            "systemPrompt": "You are a DevOps Assistant AI. Help the user with deployment, CI/CD pipelines, and infrastructure management."
        },
        {
            "id": 12,
            "name": "Documentation Writer",
            "description": "Creates clear and comprehensive documentation for code and projects.",
            "icon": "description",
            "category": "development",
            "tags": ["Documentation", "Technical Writing", "Guides"],
            "systemPrompt": "You are a Documentation Writer AI. Help the user create clear and comprehensive documentation for code and projects."
        }
    ]
}

# Routes
@app.route('/')
def index():
    """Serve the main HTML page"""
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    """Serve static files"""
    return send_from_directory('.', path)

@app.route('/api/agents', methods=['GET'])
def get_agents():
    """Get all agents or agents by category"""
    category = request.args.get('category')
    if category and category in agents:
        return jsonify(agents[category])
    return jsonify(agents)

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat messages and generate responses using Google ADK"""
    data = request.json
    if not data or 'message' not in data or 'systemPrompt' not in data:
        return jsonify({'error': 'Invalid request. Message and systemPrompt are required.'}), 400
    
    message = data['message']
    system_prompt = data['systemPrompt']
    
    try:
        # Check if API key is configured
        if not API_KEY:
            # Return a simulated response if no API key is available
            return jsonify({
                'response': simulate_response(message, system_prompt, data.get('category', 'general'))
            })
        
        # Use Google ADK to generate a response
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(
            f"{system_prompt}\n\nUser: {message}"
        )
        
        return jsonify({
            'response': response.text
        })
    except Exception as e:
        print(f"Error generating response: {e}")
        # Fallback to simulated response
        return jsonify({
            'response': simulate_response(message, system_prompt, data.get('category', 'general')),
            'note': 'Using simulated response due to API error'
        })

def simulate_response(message, system_prompt, category):
    """Generate a simulated response when the API is not available"""
    responses = {
        "productivity": "I've analyzed your request and can help you organize this task efficiently. Let's break it down into manageable steps and set priorities.",
        "creative": "That's an interesting idea! I can help you develop this concept further. Here are some creative directions we could explore...",
        "research": "Based on recent data, I can provide you with comprehensive information on this topic. Let me gather the most relevant insights for you.",
        "development": "I've reviewed your code question. Here's a solution that follows best practices and should resolve the issue you're facing.",
        "general": "I understand your request and I'm here to help. Let me know what specific assistance you need."
    }
    
    return responses.get(category, responses["general"])

@app.route('/api/status', methods=['GET'])
def status():
    """Check API status"""
    api_available = API_KEY is not None
    return jsonify({
        'status': 'online',
        'api_available': api_available
    })

if __name__ == '__main__':
    # Get port from environment variable or use 5000 as default
    port = int(os.environ.get('PORT', 5000))
    # Run the app
    app.run(host='0.0.0.0', port=port, debug=True)