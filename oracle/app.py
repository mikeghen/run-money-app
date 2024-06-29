import logging
from flask import Flask, request, jsonify
from web3 import Web3
import os
import requests

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize web3 with environment variables
infura_url = os.getenv("INFURA_URL")
chain_id = os.getenv("CHAIN_ID")
web3 = Web3(Web3.HTTPProvider(infura_url))
private_key = os.getenv("PRIVATE_KEY")
from_address = os.getenv("FROM_ADDRESS")
contract_address = os.getenv("CONTRACT_ADDRESS")
contract_abi = [
    {
        "constant": False,
        "inputs": [
            {"name": "userId", "type": "uint256"},
            {"name": "activityId", "type": "uint256"},
            {"name": "distance", "type": "uint256"},
            {"name": "time", "type": "uint256"}
        ],
        "name": "recordRun",
        "outputs": [],
        "payable": False,
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

# Strava user ids to access tokens
strava_user_ids = {
    "40279420": os.getenv("USER1_ACCESS_TOKEN"),
    "52616211": os.getenv("USER2_ACCESS_TOKEN"),
}

def get_activity_details(activity_id, access_token):
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    response = requests.get(f"https://www.strava.com/api/v3/activities/{activity_id}", headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        logger.error(f"Failed to fetch activity details: {response.status_code} {response.text}")
        return None

@app.route('/')
def index():
    return 'Hello, World!'

@app.route('/webhook', methods=['POST'])
def webhook_post():
    data = request.json
    logger.info("webhook event received! args: %s, json: %s", request.args, data)

    if data and data.get("aspect_type") in ["create", "update", "delete"] and data.get("object_type") == "activity":
        user_id = str(data.get("owner_id"))
        activity_id = data.get("object_id")
        access_token = strava_user_ids[user_id]
        
        if not access_token:
            logger.error(f"Access token not found for user_id: {user_id}")
            return 'Forbidden', 403
        
        activity_details = get_activity_details(activity_id, access_token)
        if activity_details:
            app.logger.info(f"Activity details: {activity_details}")
            distance = activity_details.get("distance", 0)
            moving_time = activity_details.get("moving_time", 0)
            nonce = web3.eth.get_transaction_count(from_address)

            contract = web3.eth.contract(address=contract_address, abi=contract_abi)
            tx = contract.functions.recordRun(
                int(user_id), 
                activity_id, 
                int(distance), 
                int(moving_time)
            ).build_transaction({
                'chainId': int(chain_id),
                'nonce': nonce
            })

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
