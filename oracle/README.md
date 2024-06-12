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

## Test
```sh
python -m unittest discover test
```