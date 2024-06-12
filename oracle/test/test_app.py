import unittest
from unittest.mock import patch, MagicMock
from app import app
import json
import os

class FlaskAppTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    @patch.dict(os.environ, {
        "INFURA_URL": os.getenv("INFURA_URL"),
        "PRIVATE_KEY": os.getenv("PRIVATE_KEY"),
        "FROM_ADDRESS": os.getenv("FROM_ADDRESS"),
        "TO_ADDRESS": os.getenv("TO_ADDRESS")
    })
    @patch('app.web3.eth.get_transaction_count', return_value=1)
    @patch('app.web3.eth.send_raw_transaction', return_value=MagicMock(hex=lambda: '0xTRANSACTION_HASH'))
    def test_webhook_post_activity_created(self, mock_send_raw_transaction, mock_get_transaction_count):
        data = {
            "aspect_type": "create",
            "event_time": 1622739000,
            "object_id": 1234567890,
            "object_type": "activity",
            "owner_id": 123456,
            "subscription_id": 98765
        }
        response = self.app.post('/webhook', data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, b'EVENT_RECEIVED')
        mock_get_transaction_count.assert_called_once()
        mock_send_raw_transaction.assert_called_once()
        args, _ = mock_send_raw_transaction.call_args
        tx = args[0]
        self.assertIn(f"{data['aspect_type']}:{data['object_type']}".encode(), bytes.fromhex(tx.hex()[2:]))

    @patch.dict(os.environ, {
        "INFURA_URL": "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID",
        "PRIVATE_KEY": "0xABCD",
        "FROM_ADDRESS": "0xYOUR_WALLET_ADDRESS",
        "TO_ADDRESS": "0xAAAA"
    })
    @patch('app.web3.eth.get_transaction_count', return_value=1)
    @patch('app.web3.eth.send_raw_transaction', return_value=MagicMock(hex=lambda: '0xTRANSACTION_HASH'))
    def test_webhook_post_activity_updated(self, mock_send_raw_transaction, mock_get_transaction_count):
        data = {
            "aspect_type": "update",
            "event_time": 1622739000,
            "object_id": 1234567890,
            "object_type": "activity",
            "owner_id": 123456,
            "subscription_id": 98765,
            "updates": {
                "title": "Morning Run",
                "type": "Run"
            }
        }
        response = self.app.post('/webhook', data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, b'EVENT_RECEIVED')
        mock_get_transaction_count.assert_called_once()
        mock_send_raw_transaction.assert_called_once()
        args, _ = mock_send_raw_transaction.call_args
        tx = args[0]
        self.assertIn(f"{data['aspect_type']}:{data['object_type']}".encode(), bytes.fromhex(tx.hex()[2:]))

    @patch.dict(os.environ, {
        "INFURA_URL": "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID",
        "PRIVATE_KEY": "0xABCD",
        "FROM_ADDRESS": "0xYOUR_WALLET_ADDRESS",
        "TO_ADDRESS": "0xAAAA"
    })
    @patch('app.web3.eth.get_transaction_count', return_value=1)
    @patch('app.web3.eth.send_raw_transaction', return_value=MagicMock(hex=lambda: '0xTRANSACTION_HASH'))
    def test_webhook_post_activity_deleted(self, mock_send_raw_transaction, mock_get_transaction_count):
        data = {
            "aspect_type": "delete",
            "event_time": 1622739000,
            "object_id": 1234567890,
            "object_type": "activity",
            "owner_id": 123456,
            "subscription_id": 98765
        }
        response = self.app.post('/webhook', data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, b'EVENT_RECEIVED')
        mock_get_transaction_count.assert_called_once()
        mock_send_raw_transaction.assert_called_once()
        args, _ = mock_send_raw_transaction.call_args
        tx = args[0]
        self.assertIn(f"{data['aspect_type']}:{data['object_type']}".encode(), bytes.fromhex(tx.hex()[2:]))

    def test_webhook_get_verified(self):
        response = self.app.get('/webhook?hub.mode=subscribe&hub.verify_token=STRAVA&hub.challenge=CHALLENGE_ACCEPTED')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'CHALLENGE_ACCEPTED', response.data)

    def test_webhook_get_forbidden(self):
        response = self.app.get('/webhook?hub.mode=subscribe&hub.verify_token=WRONG_TOKEN')
        self.assertEqual(response.status_code, 403)

if __name__ == '__main__':
    unittest.main()
