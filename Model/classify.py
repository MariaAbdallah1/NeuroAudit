import tensorflow as tf
import numpy as np
import subprocess
import base64
import json
from json2ast import traverse_json
import sys
import base64

encoded_php = sys.argv[1]

result = subprocess.run(
    ["php", "gp.php", encoded_php],
    capture_output=True,
    text=True
)

parsed = result.stdout

encoded_parsed = base64.b64encode(parsed.encode())

result = subprocess.run(
    ["python", "json2ast.py", encoded_parsed],
    capture_output=True,
    text=True
)

ast = result.stdout

class F1Score(tf.keras.metrics.Metric):
    def __init__(self, name='f1_score', **kwargs):
        super(F1Score, self).__init__(name=name, **kwargs)
        self.precision = tf.keras.metrics.Precision()
        self.recall = tf.keras.metrics.Recall()

    def update_state(self, y_true, y_pred, sample_weight=None):
        self.precision.update_state(y_true, y_pred, sample_weight)
        self.recall.update_state(y_true, y_pred, sample_weight)

    def result(self):
        precision = self.precision.result()
        recall = self.recall.result()
        return 2 * (precision * recall) / (precision + recall + K.epsilon())

    def reset_states(self):
        self.precision.reset_states()
        self.recall.reset_states()

model = tf.keras.models.load_model('SQLI&XSS_vul_det.keras', custom_objects={"F1Score": F1Score})

with open("tokenizer.json", "r", encoding='utf-8') as f:
    tokenizer_json = f.read()

tokenizer = tf.keras.preprocessing.text.tokenizer_from_json(tokenizer_json)

input_string = ast
sequence = tokenizer.texts_to_sequences([input_string])
prediction = model.predict(np.array(sequence), verbose=1)
predicted_label = np.argmax(prediction, axis=1)[0]

label_map = {
    0: "Non-vulnerable",
    1: "SQL Injection (SQLI)",
    2: "Cross-Site Scripting (XSS)"
}

print("Prediction is: " + label_map[predicted_label])
