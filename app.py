from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_groq import ChatGroq
from dotenv import load_dotenv
import os

load_dotenv(override=True)

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Initialize the LLM
llm = ChatGroq(
    model="openai/gpt-oss-20b",
    api_key=os.getenv("GROQ_API_KEY")
)

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Get response from LLM
        response = llm.invoke(user_message)
        
        return jsonify({
            'response': response.content,
            'status': 'success'
        })
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    print("Starting ChatGPT server...")
    print("Frontend: Open index.html in your browser")
    print("Backend: Running on http://localhost:5000")
    app.run(debug=True, port=5000)
