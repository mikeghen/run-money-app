import logging
from flask import Flask, request, jsonify

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/webhook', methods=['POST'])
def webhook_post():
    logger.info("webhook event received! args: %s, json: %s", request.args, request.json)
    return 'EVENT_RECEIVED', 200

@app.route('/webhook', methods=['GET'])
def webhook_get():
    VERIFY_TOKEN = "STRAVA"
    mode = request.args.get('hub.mode')
    token = request.args.get('hub.verify_token')
    challenge = request.args.get('hub.challenge')
    logger.info("webhook verification request received! mode: %s, token: %s, challenge: %s", mode, token, challenge)

    if mode and token:
        if mode == 'subscribe' and token == VERIFY_TOKEN:
            logger.info('WEBHOOK_VERIFIED')
            return jsonify({"hub.challenge": challenge})
        else:
            logger.error('WEBHOOK_VERIFICATION_FAILED with mode: %s and token: %s', mode, token)
            return 'Forbidden', 403
    logger.error('BAD_REQUEST')
    return 'Bad Request', 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
