import sys
import json
import joblib
import numpy as np
import os
import warnings

warnings.filterwarnings("ignore")

current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, "model.pkl")

model = joblib.load(model_path)

input_data = json.loads(sys.argv[1])

features = np.array([[
    input_data["dayOfWeek"],
    input_data["month"],
    input_data["isFestival"],
    input_data["temperature"],
    input_data["rainfall"]
]])

prediction = model.predict(features)

print(json.dumps({
    "prediction": float(prediction[0])
}))
