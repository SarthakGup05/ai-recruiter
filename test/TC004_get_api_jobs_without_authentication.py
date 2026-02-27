import requests

BASE_URL = "http://localhost:3000"
TIMEOUT = 30

def test_get_api_jobs_without_authentication():
    url = f"{BASE_URL}/api/jobs"
    try:
        response = requests.get(url, timeout=TIMEOUT)
        assert response.status_code == 401, f"Expected status code 401, got {response.status_code}"
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

test_get_api_jobs_without_authentication()