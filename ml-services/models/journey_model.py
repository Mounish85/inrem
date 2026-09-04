class JourneyModel:
    """
    Initial journey recommendation model.

    This version uses only features extracted from
    actual backend data.

    It does NOT use:
    - mock data
    - synthetic data
    - hard-coded WQC records
    - fake training data
    """

    def predict(self, features: dict):

        sessions_completed = features.get(
            "sessions_completed",
            0
        )

        assessment_count = features.get(
            "assessment_count",
            0
        )

        engagement_count = features.get(
            "engagement_count",
            0
        )

        # Strong course participation and engagement
        if (
            sessions_completed >= 8
            and engagement_count >= 2
        ):
            return "trainer"

        # Active course participation
        if (
            sessions_completed >= 5
            and assessment_count >= 1
        ):
            return "guided_mentoring"

        # Continued alumni/peer engagement
        return "saathi"