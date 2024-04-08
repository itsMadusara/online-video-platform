# flask run -h 192.168.56.1 -p 3000

import cv2
import base64
import io
from PIL import Image
import numpy as np
from flask_socketio import emit, SocketIO
from flask import Flask, render_template

from scipy.spatial import distance
from imutils import face_utils
import imutils
import dlib
import cv2

from tensorflow.keras.models import load_model
import numpy as np


app = Flask(__name__, template_folder="templates")
sio = SocketIO(app, cors_allowed_origins="*")

@sio.on('image')
def image(data_image):
    image = data_image['base64Data']
    print(data_image['identify'])
    base64_data = image.split(',')[1]
    sbuf = io.StringIO()
    sbuf.write(base64_data)
    b = io.BytesIO(base64.b64decode(base64_data))
    pimg = Image.open(b)
    frame = cv2.cvtColor(np.array(pimg), cv2.COLOR_RGB2BGR)

    model = load_model('drowsiness_model.h5')
    frame_resized = cv2.resize(frame, (64, 64))
    frame_normalized = frame_resized / 255.0
    frame_expanded = np.expand_dims(frame_normalized, axis=0)

    prediction = model.predict(frame_expanded)
    drowsy = prediction[0][0] > 0.5

    if drowsy:
        emit('response_back', data_image['identify'])


# @sio.on('image')
# def image(data_image):
#     flag=0

#     def eye_aspect_ratio(eye):
#         A = distance.euclidean(eye[1], eye[5])
#         B = distance.euclidean(eye[2], eye[4])
#         C = distance.euclidean(eye[0], eye[3])
#         ear = (A + B) / (2.0 * C)
#         return ear
	
#     thresh = 0.25
#     detect = dlib.get_frontal_face_detector()
#     predict = dlib.shape_predictor("./model/shape_predictor_68_face_landmarks.dat")

#     (lStart, lEnd) = face_utils.FACIAL_LANDMARKS_68_IDXS["left_eye"]
#     (rStart, rEnd) = face_utils.FACIAL_LANDMARKS_68_IDXS["right_eye"]

#     base64_data = data_image.split(',')[1]
#     sbuf = io.StringIO()
#     sbuf.write(base64_data)
#     b = io.BytesIO(base64.b64decode(base64_data))
#     pimg = Image.open(b)

#     # # DO WHATEVER IMAGE PROCESSING HERE{
#     frame = cv2.cvtColor(np.array(pimg), cv2.COLOR_RGB2BGR)
#     frame = imutils.resize(frame, width=450)
#     gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#     subjects = detect(gray, 0)
#     for subject in subjects:
#         shape = predict(gray, subject)
#         shape = face_utils.shape_to_np(shape)
#         leftEye = shape[lStart:lEnd]
#         rightEye = shape[rStart:rEnd]
#         leftEAR = eye_aspect_ratio(leftEye)
#         rightEAR = eye_aspect_ratio(rightEye)
#         ear = (leftEAR + rightEAR) / 2.0
#         if ear < thresh:
#             flag += 1
#             print(flag)
#             emit('response_back', flag)
#         else:
#             flag = 0
    

@app.route("/")
def index():
    return {"hello": "world"}


if __name__ == "__main__":
    sio.run(app, debug=True)