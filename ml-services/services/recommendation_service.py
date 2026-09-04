from models.journey_model import JourneyModel


def recommend_journey(features: dict):

    model = JourneyModel()

    pathway = model.predict(features)

    return {
        "pathway": pathway,
        "reason": get_reason(
            pathway,
            features
        )
    }


def get_reason(pathway: str, features: dict):

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

    if pathway == "trainer":

        return (
            "The WQC shows strong course completion "
            "and continued engagement."
        )

    if pathway == "guided_mentoring":

        return (
            "The WQC has demonstrated course participation "
            "and assessment activity and may benefit from "
            "continued guidance."
        )

    return (
        "The WQC can continue engagement through the "
        "Saathi pathway and peer/alumni interaction."
    )