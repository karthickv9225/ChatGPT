# ChatGPT Clone

A modern ChatGPT-like interface with a Python backend powered by Groq AI.

## Features

- Clean, modern UI matching ChatGPT's design
- Real-time chat interface
- Typing indicators
- Message history
- Responsive design
- Powered by Groq's fast LLM inference

## Setup Instructions

### 1. Backend Setup

The backend is already configured. Make sure you have your `.env` file with:

```
GROQ_API_KEY=your_api_key_here
```

### 2. Start the Backend Server

Run the Flask server:

```bash
python app.py
```

The server will start on `http://localhost:5000`

### 3. Open the Frontend

Simply open `index.html` in your web browser:

- Double-click on `index.html`, or
- Right-click → Open with → Your Browser, or
- Use VS Code Live Server extension

## Usage

1. Start the backend server (`python app.py`)
2. Open `index.html` in your browser
3. Type your message in the input box
4. Press Enter or click the send button
5. The AI will respond to your message

## Project Structure

```
├── index.html          # Main HTML file
├── style.css           # Styling
├── script.js           # Frontend JavaScript
├── app.py             # Flask backend server
├── main.py            # Original CLI chatbot
├── .env               # Environment variables
└── README.md          # This file
```

## Technologies Used

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- Fetch API for HTTP requests

### Backend
- Python 3
- Flask (Web framework)
- LangChain (LLM orchestration)
- Groq (Fast LLM inference)
- Flask-CORS (Cross-origin requests)

## Troubleshooting

**Error: Backend server not running**
- Make sure `python app.py` is running
- Check that port 5000 is not being used by another application

**Error: CORS issues**
- Make sure Flask-CORS is installed: `pip install flask-cors`
- Check that the backend URL in `script.js` matches your server

**Error: No API key**
- Ensure your `.env` file has a valid `GROQ_API_KEY`

## Customization

### Change the AI Model
Edit `app.py` and change the model parameter:
```python
llm = ChatGroq(
    model="openai/gpt-oss-20b",  # Change this
    api_key=os.getenv("GROQ_API_KEY")
)
```

### Modify the UI Theme
Edit `style.css` to customize colors, fonts, and layout.

### Add Features
- Message persistence: Add database integration
- User authentication: Add login/signup
- Conversation history: Store and load previous chats
- File uploads: Handle image/document inputs

## License

MIT License - feel free to use and modify!
