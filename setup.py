import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import anthropic

app = Flask(__name__)
CORS(app)

# Initialize the Anthropic client
client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

@app.route('/get_completion', methods=['POST'])
def get_completion():
    data = request.json
    user_message = data['message']
    
    try:
        # Call Claude's API to get the completion
        completion = client.completions.create(
            model="claude-2.1",
            max_tokens_to_sample=350,
            prompt=f"{anthropic.HUMAN_PROMPT} {user_message}{anthropic.AI_PROMPT}",
        )
        
        # Extract the completion text from the response
        response_text = completion.completion

        return jsonify({'completion': response_text})
    except Exception as e:
        # Handle any errors
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)