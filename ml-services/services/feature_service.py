from utils.preprocessing import extract_data, ensure_list


def build_features(wqc_data: dict):
    """
    Convert actual backend data into features.

    No mock or synthetic data is created here.
    """

    user = wqc_data.get("user")

    enrollments = ensure_list(
        extract_data(wqc_data.get("enrollments"))
    )

    progress = ensure_list(
        extract_data(wqc_data.get("progress"))
    )

    engagements = ensure_list(
        extract_data(wqc_data.get("engagements"))
    )

    assessment_results = ensure_list(
        extract_data(wqc_data.get("assessment_results"))
    )

    features = {
        "has_user": 1 if user else 0,
        "enrollment_count": len(enrollments),
        "sessions_completed": count_completed_sessions(progress),
        "attestations_completed": 0,
        "assessment_count": len(assessment_results),
        "engagement_count": len(engagements)
    }

    return features


def count_completed_sessions(progress):
    """
    Count completed sessions from actual progress records.
    """

    completed = 0

    for item in progress:

        if not isinstance(item, dict):
            continue

        status = item.get("status")

        if isinstance(status, str):
            if status.lower() == "completed":
                completed += 1

        # Supports a possible boolean representation
        elif item.get("completed") is True:
            completed += 1

    return completed