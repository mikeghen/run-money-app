import logging
from flask import Flask, request, jsonify
from web3 import Web3
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize web3 with environment variables
infura_url = os.getenv("INFURA_URL")
web3 = Web3(Web3.HTTPProvider(infura_url))
private_key = os.getenv("PRIVATE_KEY")
from_address = os.getenv("FROM_ADDRESS")
to_address = os.getenv("TO_ADDRESS")
value = web3.to_wei(0.001, 'ether')

@app.route('/webhook', methods=['POST'])
def webhook_post():
    data = request.json
    logger.info("webhook event received! args: %s, json: %s", request.args, data)
    
    if data and data.get("aspect_type") in ["create", "update", "delete"] and data.get("object_type") == "activity":
        # Create the transaction
        nonce = web3.eth.get_transaction_count(from_address)
        message = f"{data.get('aspect_type')}:{data.get('object_type')}"
        tx = {
            'nonce': nonce,
            'to': to_address,
            'value': value,
            'gas': 2000000,
            'gasPrice': web3.to_wei('50', 'gwei'),
            'data': web3.to_hex(text=message)
        }
        
        # Sign the transaction
        signed_tx = web3.eth.account.sign_transaction(tx, private_key)
        
        # Send the transaction
        tx_hash = web3.eth.send_raw_transaction(signed_tx.rawTransaction)
        logger.info(f"Transaction sent with hash: {tx_hash.hex()}")
        
    return 'EVENT_RECEIVED', 200

@app.route('/webhook', methods=['GET'])
def webhook_get():
    VERIFY_TOKEN = "STRAVA"
    mode = request.args.get('hub.mode')
    token = request.args.get('hub.verify_token')
    challenge = request.args.get('hub.challenge')

    if mode and token:
        if mode == 'subscribe' and token == VERIFY_TOKEN:
            logger.info('WEBHOOK_VERIFIED')
            return jsonify({"hub.challenge": challenge})
        else:
            return 'Forbidden', 403
    return 'Bad Request', 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
