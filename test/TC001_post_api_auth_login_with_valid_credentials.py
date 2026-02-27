import requests

BASE_URL = "http://localhost:3000"
LOGIN_ENDPOINT = "/api/auth/login"
TIMEOUT = 30

def test_post_api_auth_login_with_valid_credentials():
    url = BASE_URL + LOGIN_ENDPOINT
    valid_credentials = {
        "email": "testuser@example.com",
        "password": "TestPassword123!"
    }

    try:
        response = requests.post(url, json=valid_credentials, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    # Assert status code is 200
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"

    # Assert 'hireai-token' cookie is set
    cookies = response.cookies
    assert 'hireai-token' in cookies, "'hireai-token' cookie not found in response"

test_post_api_auth_login_with_valid_credentials()