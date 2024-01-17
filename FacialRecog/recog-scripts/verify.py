import os
from recognizer import Recognizer

def verify(username):
    recog = Recognizer()
    result = recog.recognize(username)
    return result

