import requests

BASE_URL = "http://localhost:3000"
REGISTER_ENDPOINT = f"{BASE_URL}/api/auth/register"
LOGIN_ENDPOINT = f"{BASE_URL}/api/auth/login"
JOBS_ENDPOINT = f"{BASE_URL}/api/jobs"

def test_post_api_jobs_with_authentication_and_valid_payload():
    # Register a new user for testing
    register_payload = {
        "email": "testuser_tc003@example.com",
        "password": "TestPassword123!",
        "name": "Test User TC003"
    }
    try:
        reg_resp = requests.post(REGISTER_ENDPOINT, json=register_payload, timeout=30)
        assert reg_resp.status_code == 201, f"Registration failed with status {reg_resp.status_code}"
        assert 'hireai-token' in reg_resp.cookies, "Registration response missing 'hireai-token' cookie"

        # Login the user to get authentication cookie
        login_payload = {
            "email": register_payload["email"],
            "password": register_payload["password"]
        }
        login_resp = requests.post(LOGIN_ENDPOINT, json=login_payload, timeout=30)
        assert login_resp.status_code == 200, f"Login failed with status {login_resp.status_code}"
        assert 'hireai-token' in login_resp.cookies, "Login response missing 'hireai-token' cookie"
        token_cookie = login_resp.cookies.get('hireai-token')
        assert token_cookie, "'hireai-token' cookie is empty"

        # Prepare job payload
        job_payload = {
            "title": "Software Engineer",
            "description": "Develop and maintain software applications.",
            "location": "Remote",
            "type": "Full-time",
            "salaryRange": {
                "min": 60000,
                "max": 90000,
                "currency": "USD"
            },
            "requirements": [
                "3+ years experience in software development",
                "Proficiency in Python and JavaScript"
            ],
            "responsibilities": [
                "Write clean, maintainable code",
                "Participate in code reviews"
            ],
            "company": "HireAI Inc."
        }

        # POST /api/jobs with authentication cookie
        cookies = {'hireai-token': token_cookie}
        job_resp = requests.post(JOBS_ENDPOINT, json=job_payload, cookies=cookies, timeout=30)
        assert job_resp.status_code == 201, f"Job creation failed with status {job_resp.status_code}"

        job_resp_json = job_resp.json()
        # Validate response contains job id and slug
        assert "id" in job_resp_json, "'id' not found in the response"
        assert "slug" in job_resp_json, "'slug' not found in the response"
        job_id = job_resp_json["id"]

    finally:
        # Cleanup: Delete created job and user if applicable
        # Attempt deleting job if created
        if 'job_id' in locals():
            try:
                delete_resp = requests.delete(f"{JOBS_ENDPOINT}/{job_id}", cookies=cookies, timeout=30)
                # delete may respond with 200 or 204 or may have soft-delete
                assert delete_resp.status_code in (200, 204), f"Failed to delete job with status {delete_resp.status_code}"
            except Exception:
                pass

        # Attempt deleting user might not be supported by API, so ignoring

test_post_api_jobs_with_authentication_and_valid_payload()