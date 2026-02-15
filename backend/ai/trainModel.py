import pandas as pd
import joblib
import json
import os
from sklearn.ensemble import RandomForestRegressor

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_PATH = os.path.join(BASE_DIR, "trainingData.json")
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")

with open(DATA_PATH) as f:
    data = json.load(f)

df = pd.DataFrame(data)

if df.empty:
    print("No training data found")
    exit()

X = df.drop("accidents", axis=1)
y = df["accidents"]

model = RandomForestRegressor(
    n_estimators=200,
    random_state=42
)

model.fit(X, y)

joblib.dump(model, MODEL_PATH)

print("Model retrained from DB successfully!")
