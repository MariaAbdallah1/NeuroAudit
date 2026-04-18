from flask import Flask, request, jsonify
import subprocess

app = Flask(__name__)

API_KEY = "mysecretapikey"

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Welcome to the NeuroAudit API!"})

@app.route('/classify', methods=['POST'])
def classify():
    auth_header = request.headers.get('Authorization')
    if not auth_header or auth_header != f"Bearer {API_KEY}":
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    if not data or 'b64sc' not in data:
        return jsonify({"error": "Missing 'b64sc' parameter"}), 400

    b64sc_param = data['b64sc']

    result = subprocess.run(
        ["python", "classify.py", b64sc_param],
        capture_output=True,
        text=True
    )

    return jsonify({
        "input_b64sc": b64sc_param,
        "result": result.stdout.split("\n")[-2]
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
