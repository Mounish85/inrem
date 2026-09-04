from fastapi import FastAPI, HTTPException

from services.backend_service import get_wqc_data
from services.feature_service import build_features
from services.recommendation_service import recommend_journey


app = FastAPI(
    title="INREM WQC ML Service",
    description="Recommendation service for Water Quality Champions",
    version="1.0.0"
)


@app.get("/")
def root():

    return {
        "message": "INREM WQC ML Service is running"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


@app.get("/recommend/{user_id}")
def get_recommendation(user_id: str):

    try:

        # Get actual data from Node.js backend
        wqc_data = get_wqc_data(user_id)

        # Convert backend data into features
        features = build_features(wqc_data)

        # Generate pathway recommendation
        recommendation = recommend_journey(
            features
        )

        return {
            "user_id": user_id,
            "features": features,
            "recommendation": recommendation
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )