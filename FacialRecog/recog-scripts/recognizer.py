import cv2
import dlib
import numpy as np
import os
from enum import Enum
from deepface import DeepFace


class Recognizer:
    
    database_path = 'database/'
    record_path = '/records/'
    test_path = '/tests/'
    base_path = '/home/luizg/Documentos/Portfolio/FacialRecog/recog-scripts/'
    
    
    class Status(Enum):
        NOT_REGISTERED = 0
        IDENTIFIED = 1
        NOT_IDENTIFIED = 2

    
    def is_registered(username):
        record_path = Recognizer.database_path + username + Recognizer.record_path
        final_path = Recognizer.base_path + record_path
        return os.path.exists(final_path)
    
    
    def recognize(self, username):
        if (Recognizer.is_registered(username) == False):
            return Recognizer.Status.NOT_REGISTERED
        
        user_path = Recognizer.base_path + Recognizer.database_path + username
        
        path_img_base = user_path + Recognizer.test_path + "test.jpg"
        path_img_records = user_path + Recognizer.record_path

        
        for file in os.listdir(path_img_records):
            if file.endswith(".jpg") or file.endswith(".png"):
                path_img_test = os.path.join(path_img_records, file)
                
                result = DeepFace.verify(img1_path=path_img_base, img2_path=path_img_test, enforce_detection=False)
                print(file, result["verified"])
                print()
                if (result["verified"]):
                    return Recognizer.Status.IDENTIFIED
                
        return Recognizer.Status.NOT_IDENTIFIED
                