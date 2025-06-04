# AI Assistant Hub

A web application built with Google's ADK (AI Development Kit) framework that features multiple AI agents for different tasks. The application organizes AI agents by category and provides a user-friendly interface for interacting with them.

## Features

- Multiple specialized AI agents categorized by function
- User-friendly and elegant interface
- Real-time chat with AI assistants
- Responsive design for all device sizes
- Python Flask backend for API integration
- Fallback to demo mode when API is unavailable

## Categories of AI Agents

1. **Productivity**
   - Task Manager
   - Email Assistant
   - Meeting Facilitator

2. **Creative**
   - Content Creator
   - Design Assistant
   - Brainstorm Buddy

3. **Research**
   - Research Analyst
   - Market Researcher
   - Academic Assistant

4. **Development**
   - Code Helper
   - DevOps Assistant
   - Documentation Writer

## Getting Started

### Prerequisites

- Python 3.8 or higher
- Google ADK API key (optional - the app will run in demo mode without it)

### Installation

1. Clone this repository
   ```
   git clone <repository-url>
   cd ai-assistant-hub
   ```

2. Install Python dependencies
   ```
   pip install -r requirements.txt
   ```

3. Set up your environment variables
   - Create a `.env` file in the root directory (or rename the existing `.env.example`)
   - Add your Google ADK API key:
     ```
     GOOGLE_ADK_API_KEY=your_api_key_here
     ```

### Running the Application

#### Using the Startup Scripts (Recommended)

**For Linux/Mac users:**
```
chmod +x start.sh
./start.sh
```

**For Windows users:**
```
start.bat
```

The startup scripts will:
- Create a virtual environment if it doesn't exist
- Install all required dependencies
- Start the Flask application

#### Manual Setup

If you prefer to set up manually:

1. Create and activate a virtual environment (optional but recommended)
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies
   ```
   pip install -r requirements.txt
   ```

3. Start the Flask backend
   ```
   python app.py
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

5. Select a category and choose an AI assistant
6. Start chatting with your selected assistant

## Implementation Details

- Frontend: HTML, CSS, and JavaScript
- Backend: Python Flask
- AI Integration: Google's ADK framework
- Visual Elements: Material Icons
- Responsive Design: Works on all device sizes

## Deployment

For production deployment, consider:

1. Using a production WSGI server like Gunicorn
   ```
   gunicorn app:app
   ```

2. Setting up a reverse proxy with Nginx or Apache
3. Deploying to a cloud platform like Heroku, AWS, or Google Cloud

## Note

This is a demonstration project. In a production environment, you would need to:

1. Implement proper authentication and security measures
2. Add comprehensive error handling and logging
3. Optimize for performance and accessibility
4. Set up proper CORS policies
5. Implement rate limiting and other API protections

## License

This project is licensed under the MIT License - see the LICENSE file for details.