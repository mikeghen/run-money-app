# Proof of Workout Strava Oracle

This oracle uses the Strava API to listen for activities by club members and then sends a transaction to the smart contract to record the user's activity.

## How it works
1. Users approve the Proof of Workout app through Strava.
2. The Proof of Workout app subscribes for activity updates for the club members that approve the app in Strava.
3. When a new activity is detected, the app sends a transaction to the smart contract to record the user's activity.

## How it's built
This keeper is a Python Flask using web3py and the Strava API. 

## Setup
1. Clone the repository
2. Install dependencies
```sh
pip install -r requirements.txt
```
3. Run the Flask app
```sh
python app.py
```

## Helpful Debugging Commands

## Create Subscription
```
curl -X POST https://www.strava.com/api/v3/push_subscriptions \
      -F client_id=$CLIENT_ID \
      -F client_secret=$CLIENT_SECRECT \
      -F callback_url=https://proof-of-workout-oracle.vercel.app/webhook \
      -F verify_token=STRAVA
```

## Check Subscription Webhook
```
curl -X GET 'http://127.0.0.1:5000/webhook?hub.verify_token=STRAVA&hub.challenge=15f7d1a91c1f40f8a748fd134752feb3&hub.mode=subscribe'
```

## Delete Subscription
```

## Simulate Create Activity Webhook
```
curl -X POST http://127.0.0.1:5000/webhook \
      -H "Content-Type: application/json" \
      -d '{"aspect_type":"create","object_id":1234567890,"object_type":"activity","owner_id":12345678,"subscription_id":123456,"updates":{"title":"Morning Run","type":"Run"}}'
```


## Docs
* https://developers.strava.com/docs/webhooks/
* https://developers.strava.com/docs/reference/ 

## Test
```sh
python -m unittest discover test
```