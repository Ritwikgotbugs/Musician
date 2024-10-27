from flask import Flask, request, jsonify, send_file
import numpy as np
import scipy.io.wavfile
from transformers import pipeline
import torch  # To check for GPU
import io
from pyngrok import ngrok  # Import pyngrok

app = Flask(__name__)

# Check if a GPU is available and get the device index
device = 0 if torch.cuda.is_available() else -1

# Load the model once at startup with GPU support if available
model = pipeline("text-to-audio", model="facebook/musicgen-small", device=device) 

@app.route('/')
def index():
    return '''
        <h1>Symphony Smith Music Generator</h1>
        <p>Send a POST request to /generate_music with a JSON payload containing the "prompt".</p>
        <p>Example: { "prompt": "A chill lo-fi beat with smooth jazz" }</p>
    '''

@app.route('/generate_music', methods=['POST'])
def generate_music():
    try:
        data = request.get_json()
        prompt = data.get("prompt", "")

        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400

        music = model(prompt, forward_params={"do_sample": True})
        audio_data = music.get("audio")
        sampling_rate = music.get("sampling_rate")

        if audio_data is None or sampling_rate is None:
            return jsonify({"error": "Failed to generate audio. Please try a different prompt."}), 500

        if audio_data.dtype == np.float32:
            audio_data = (audio_data * 32767).astype(np.int16)

        audio_file = io.BytesIO()
        scipy.io.wavfile.write(audio_file, rate=sampling_rate, data=audio_data)
        audio_file.seek(0)

        return send_file(audio_file, mimetype="audio/wav", as_attachment=True, download_name="generated_music.wav")

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


if __name__ == '__main__':
    # Open an ngrok tunnel to the app
    public_url = ngrok.connect(8800)
    print(f" * Ngrok tunnel open at {public_url}")
    app.run(port=8800)