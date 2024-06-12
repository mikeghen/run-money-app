import unittest
from app import app
import json

class FlaskAppTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_webhook_get_verified(self):
        response = self.app.get('/webhook?hub.mode=subscribe&hub.verify_token=STRAVA&hub.challenge=CHALLENGE_ACCEPTED')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'CHALLENGE_ACCEPTED', response.data)

    def test_webhook_get_forbidden(self):
        response = self.app.get('/webhook?hub.mode=subscribe&hub.verify_token=WRONG_TOKEN')
        self.assertEqual(response.status_code, 403)

    def test_webhook_post_activity_created(self):
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

    def test_webhook_post_activity_updated(self):
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

    def test_webhook_post_activity_deleted(self):
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

if __name__ == '__main__':
    unittest.main()
