from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS
import numpy as np
import os
import warnings
import joblib
from sklearn.impute import KNNImputer
from model import train_models
import traceback


# -----------------------------
# Setup
# -----------------------------
warnings.filterwarnings("ignore")
os.environ["LOKY_MAX_CPU_COUNT"] = "4"

app = Flask(__name__)
CORS(app)

# -----------------------------
# Load Models
# -----------------------------
MODEL_FOLDER = "models"
MODEL_NAMES = ["stacking", "catboost", "extra_trees", "lightgbm", "xgboost"]

models = {}

for name in MODEL_NAMES:
    path = f"{MODEL_FOLDER}/{name}.pkl"
    if os.path.exists(path):
        try:
            models[name] = joblib.load(path)
            print(f"✅ Loaded {name}")
        except Exception as e:
            print(f"❌ Failed to load {name}:", e)

current_model = models.get("stacking", None)


# -----------------------------
# Route: Health Check
# -----------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "API running",
        "model_loaded": current_model is not None
    })


# -----------------------------
# Route: Train Model
# -----------------------------
@app.route("/train", methods=["POST"])
def train():
    try:
        train_models()

        # Reload models after training
        for name in MODEL_NAMES:
            path = f"{MODEL_FOLDER}/{name}.pkl"
            if os.path.exists(path):
                models[name] = joblib.load(path)

        return jsonify({"message": "✅ Models trained successfully!"})

    except Exception as e:
        print("Training error:", e)
        return jsonify({"error": str(e)}), 500


# -----------------------------
# Route: Switch Model
# -----------------------------
@app.route("/switch_model", methods=["POST"])
def switch_model():
    global current_model

    try:
        data = request.json
        model_name = data.get("model", "stacking")

        if model_name not in models:
            return jsonify({"error": f"Model '{model_name}' not found"}), 400

        current_model = models[model_name]

        return jsonify({
            "message": f"✅ Switched to {model_name}"
        })

    except Exception as e:
        print("Switch error:", e)
        return jsonify({"error": str(e)}), 500


# -----------------------------
# Route: Predict
# -----------------------------
@app.route("/predict", methods=["POST"])
def predict():
    global current_model

    print("👉 /predict called")

    if current_model is None:
        print("❌ Model is None")
        return jsonify({"error": "Model not loaded"}), 500

    try:
        data = request.json or {}
        print("📥 Incoming data:", data)

        # SIMPLE INPUT (no feature engineering for now)
        values = [
            float(data.get("Pregnancies", 0)),
            float(data.get("Glucose", 0)),
            float(data.get("BloodPressure", 0)),
            float(data.get("SkinThickness", 0)),
            float(data.get("Insulin", 0)),
            float(data.get("BMI", 0)),
            float(data.get("DiabetesPedigreeFunction", 0)),
            float(data.get("Age", 0))
        ]

        import pandas as pd
        df = pd.DataFrame([values])

        print("📊 Input DataFrame:", df)

        # 🔥 FORCE SAFE SHAPE MATCH
        try:
            df = df.reindex(columns=current_model.feature_names_in_, fill_value=0)
        except:
            print("⚠️ feature_names_in_ not available")

        print("🧠 Predicting...")

        if hasattr(current_model, "predict_proba"):
            prob = current_model.predict_proba(df)[0][1]
        else:
            prob = float(current_model.predict(df)[0])

        print("✅ Prediction success:", prob)

        return jsonify({
            "result": "Positive" if prob >= 0.5 else "Negative",
            "probability": float(prob)
        })

    except Exception as e:
        import traceback
        print("🔥 CRASH:")
        traceback.print_exc()

        return jsonify({
            "error": str(e)
        }), 500

# -----------------------------
# Run Server
# -----------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)