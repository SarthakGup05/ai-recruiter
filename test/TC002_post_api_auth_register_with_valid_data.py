import requests
import uuid

BASE_URL = "http://localhost:3000"
REGISTER_ENDPOINT = "/api/auth/register"
TIMEOUT = 30

def test_post_api_auth_register_with_valid_data():
    # Unique email to avoid conflicts
    unique_email = f"testuser_{uuid.uuid4().hex[:8]}@example.com"
    payload = {
        "email": unique_email,
        "password": "SafePassw0rd!",
        "name": "Test User"
    }
    headers = {
        "Content-Type": "application/json"
    }
    session = requests.Session()
    try:
        response = session.post(
            BASE_URL + REGISTER_ENDPOINT,
            json=payload,
            headers=headers,
            timeout=TIMEOUT,
        )
        # Check status code
        assert response.status_code == 201, f"Expected 201, got {response.status_code}"
        # Check if 'hireai-token' cookie is set
        cookies = response.cookies.get_dict()
        assert "hireai-token" in cookies, "'hireai-token' cookie not set"
    finally:
        # Cleanup: no explicit delete endpoint described, so no cleanup step included
        pass

test_post_api_auth_register_with_valid_data()