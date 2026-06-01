from flask import Flask, request, jsonify
from flask_cors import CORS

from chatbot import get_response

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True)
    if not data or "message" not in data:
        return jsonify({"error": "Mensagem ausente"}), 400

    message = data["message"]
    history = data.get("history", [])
    if not isinstance(history, list):
        history = []

    try:
        reply = get_response(message, history)
        return jsonify({"reply": reply})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
