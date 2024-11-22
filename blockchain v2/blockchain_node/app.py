from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import time, json, hashlib, os
import logging

app = Flask(__name__)
CORS(app)

LOG_FILE = 'audit_logs.log'
logging.basicConfig(filename=LOG_FILE, level=logging.INFO, format='%(asctime)s - %(message)s')

blockchain = [
    {
        "index": 0,
        "timestamp": time.time(),
        "data": "Initial hash",
        "Hash_Anterior": "0",
        "hash": hashlib.sha256("Initial hash".encode()).hexdigest()
    }
]


def create_block(data):
    last_block = blockchain[-1]
    block = {
        "index": len(blockchain),
        "timestamp": time.time(),
        "data": data,
        "Hash_Anterior": last_block["hash"],
    }
    block["hash"] = hashlib.sha256(json.dumps(block, sort_keys=True).encode()).hexdigest()
    blockchain.append(block)
    logging.info(f"Block added: {block}")
    return block


@app.route('/blocks', methods=['GET'])
def get_blocks():
    return jsonify(blockchain), 200


@app.route('/add_block', methods=['POST'])
def add_block():
    data = request.json.get('data')
    if not data:
        return jsonify({"error": "Data is required"}), 400
    new_block = create_block(data)
    return jsonify(new_block), 201


@app.route('/audit_logs', methods=['GET'])
def download_audit_logs():
    if not os.path.exists(LOG_FILE):
        open(LOG_FILE, 'w').close()
    return send_file(LOG_FILE, as_attachment=True)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
