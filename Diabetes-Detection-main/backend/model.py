import pandas as pd
import numpy as np
import os
import pickle

from sklearn.impute import KNNImputer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import ExtraTreesClassifier, StackingClassifier
from lightgbm import LGBMClassifier
from catboost import CatBoostClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from imblearn.combine import SMOTEENN
from sklearn.metrics import accuracy_score
from xgboost import XGBClassifier


# ==============================
# 📌 Preprocessing Function
# ==============================
def preprocess_dataset(path="dataset/diabetes.csv"):
    if not os.path.exists(path):
        raise FileNotFoundError(f"Dataset not found at {path}")

    df = pd.read_csv(path)

    # Replace 0 with NaN (medical columns)
    cols = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']
    df[cols] = df[cols].replace(0, np.nan)

    # Impute missing values
    imputer = KNNImputer(n_neighbors=5)
    df = pd.DataFrame(imputer.fit_transform(df), columns=df.columns)

    # -----------------------------
    # Feature Engineering
    # -----------------------------
    df["AgeGroup"] = pd.cut(
        df["Age"], bins=[0, 30, 50, 120], labels=[0, 1, 2]
    ).astype(float)
    df["AgeGroup"].fillna(0, inplace=True)

    df["BMI_Age"] = df["BMI"] * df["Age"]
    df["Glucose_BMI"] = df["Glucose"] / (df["BMI"] + 1)
    df["Insulin_Glucose"] = df["Insulin"] / (df["Glucose"] + 1)

    df["Glucose_Risk"] = (df["Glucose"] > 120).astype(int)
    df["BMI_Risk"] = (df["BMI"] > 25).astype(int)

    return df


# ==============================
# 📌 Train Models
# ==============================
def train_models():
    print("🚀 Starting training...")

    df = preprocess_dataset()

    X = df.drop("Outcome", axis=1)
    y = df["Outcome"]

    # Balance dataset
    smoteenn = SMOTEENN(random_state=42)
    X, y = smoteenn.fit_resample(X, y)

    # Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # -----------------------------
    # Models
    # -----------------------------
    models = {
        "extra_trees": Pipeline([
            ("scaler", StandardScaler()),
            ("model", ExtraTreesClassifier(n_estimators=200, random_state=42))
        ]),

        "lightgbm": Pipeline([
            ("scaler", StandardScaler()),
            ("model", LGBMClassifier(random_state=42))
        ]),

        "catboost": Pipeline([
            ("scaler", StandardScaler()),
            ("model", CatBoostClassifier(verbose=0, random_state=42))
        ]),

        "xgboost": Pipeline([
            ("scaler", StandardScaler()),
            ("model", XGBClassifier(eval_metric="logloss", random_state=42))
        ])
    }

    # -----------------------------
    # Stacking Model
    # -----------------------------
    stacking = StackingClassifier(
        estimators=[(name, model) for name, model in models.items()],
        final_estimator=LGBMClassifier(random_state=42),
        n_jobs=-1
    )

    models["stacking"] = stacking

    # -----------------------------
    # Save Models
    # -----------------------------
    os.makedirs("models", exist_ok=True)

    for name, model in models.items():
        print(f"🔹 Training {name}...")

        model.fit(X_train, y_train)

        # Quick evaluation
        acc = accuracy_score(y_test, model.predict(X_test))
        print(f"   Accuracy: {acc:.4f}")

        with open(f"models/{name}.pkl", "wb") as f:
            pickle.dump(model, f)

        print(f"   ✅ Saved models/{name}.pkl")

    print("🎉 All models trained successfully!")


# ==============================
# 📌 Load Model
# ==============================
def load_model(name="stacking"):
    path = f"models/{name}.pkl"

    if not os.path.exists(path):
        raise FileNotFoundError(f"Model not found: {path}")

    with open(path, "rb") as f:
        return pickle.load(f)


# ==============================
# 📌 Run
# ==============================
if __name__ == "__main__":
    train_models()