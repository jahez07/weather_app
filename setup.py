from flask import Flask, render_template, request, redirect, jsonify
import anthropic as ant
from anthropic import HUMAN_PROMPT, AI_PROMPT
from flask_cors import CORS

#model = tf.keras.models.load_model('/Users/jahezabrahamjohny/Documents/GitHub/CoreAxon/autoencoder_model.h5')


app = Flask(__name__)

CORS(app)  # This allows your React app to make requests to your Flask app

@app.route('/get_completion', methods=['POST'])
def get_completion():
    data = request.json
    user_message = data['message']
    
    # Here you would call Claude's API to get the completion
    # For now, let's just echo the message
    completion = f"Claude's response to: {user_message}"
    
    return jsonify({'completion': completion})

if __name__ == "__main__":
    app.run(port=5000, debug=True)