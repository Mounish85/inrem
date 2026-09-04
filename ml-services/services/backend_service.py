import os
import requests
from dotenv import load_dotenv

load_dotenv()

BACKEND_URL = os.getenv(
    "BACKEND_URL",
    "http://localhost:3000"
)


def make_request(endpoint: str):
    """
    Send a GET request to the Node.js backend.
    """

    url = f"{BACKEND_URL}{endpoint}"

    response = requests.get(
        url,
        headers={"x-internal-service": "ml-service"},
        timeout=10
    )

    response.raise_for_status()

    return response.json()


# --------------------------------------------------
# USER
# --------------------------------------------------

def get_user(user_id: str):
    return make_request(
        f"/api/users/{user_id}"
    )


# --------------------------------------------------
# ENROLLMENT
# --------------------------------------------------

def get_user_enrollments(user_id: str):
    return make_request(
        f"/api/enrollments/user/{user_id}"
    )


# --------------------------------------------------
# PROGRESS
# --------------------------------------------------

def get_user_progress(user_id: str):
    return make_request(
        f"/api/progress/user/{user_id}"
    )


# --------------------------------------------------
# ENGAGEMENT
# --------------------------------------------------

def get_user_engagements(user_id: str):
    return make_request(
        f"/api/engagements/user/{user_id}"
    )


# --------------------------------------------------
# ASSESSMENT RESULTS
# --------------------------------------------------

def get_user_assessment_results(user_id: str):
    return make_request(
        f"/api/assessments/results/user/{user_id}"
    )


# --------------------------------------------------
# COMPLETE WQC DATA
# --------------------------------------------------

def get_wqc_data(user_id: str):
    """
    Retrieve all available WQC data from the
    Node.js backend.

    No mock or synthetic data is used.
    """

    data = {
        "user": None,
        "enrollments": [],
        "progress": [],
        "engagements": [],
        "assessment_results": []
    }

    # User
    try:
        data["user"] = get_user(user_id)
    except requests.RequestException as error:
        print(f"User request failed: {error}")

    # Enrollments
    try:
        data["enrollments"] = get_user_enrollments(user_id)
    except requests.RequestException as error:
        print(f"Enrollment request failed: {error}")

    # Progress
    try:
        data["progress"] = get_user_progress(user_id)
    except requests.RequestException as error:
        print(f"Progress request failed: {error}")

    # Engagements
    try:
        data["engagements"] = get_user_engagements(user_id)
    except requests.RequestException as error:
        print(f"Engagement request failed: {error}")

    # Assessment results
    try:
        data["assessment_results"] = (
            get_user_assessment_results(user_id)
        )
    except requests.RequestException as error:
        print(
            f"Assessment result request failed: {error}"
        )

    return data