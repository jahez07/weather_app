from flask import Flask, render_template, request, redirect
import anthropic as ant

#model = tf.keras.models.load_model('/Users/jahezabrahamjohny/Documents/GitHub/CoreAxon/autoencoder_model.h5')


app = Flask(__name__)

@app.route('/data', methods=['GET'])
def hello_word():
    return render_template('index.html')

@app.route('/pi', methods=['POST'])
def predict():
    file= request.files['image']
    
    
            # Render the template with prediction results and plot
    return

if __name__ == "__main__":
    app.run(port=5000, debug=True)