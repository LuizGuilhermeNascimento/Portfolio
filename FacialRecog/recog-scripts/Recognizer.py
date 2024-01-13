import cv2
import dlib
import numpy as np
import os
from enum import Enum


class Recognizer:
    
    detector = dlib.get_frontal_face_detector()
    predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")
    
    def __init__(self, model_path = None, threshold = 0.5):
        
        self.database_path = 'database/'
        self.record_path = 'records/'
        self.test_path = 'tests/'
        self.threshold = threshold
        
        if model_path is not None:
            Recognizer.predictor = dlib.shape_predictor(model_path)
    
    
    class Status(Enum):
        NOT_REGISTERED = 0
        IDENTIFIED = 1
        NOT_IDENTIFIED = 2


    def extract_facial_points(self, img):
        gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = self.detector(gray_img)
        
        if len(faces) > 0:
            return None
        
        shape = self.predictor(gray_img, faces[0])
        return np.array(shape)


    def euclidean_distance(self, img_base_array, img_test_array):
        
        if img_base_array is None or img_test_array is None:
            return False
        
        # calculate euclidean distance
        squares_sum = np.sum((img_base_array - img_test_array) ** 2)
        euclidean_dist = np.sqrt(squares_sum)
        
        return euclidean_dist
    
    
    def is_registered(self, username):
        record_path = self.database_path + username + self.record_path
        return os.path.exists(record_path)
    
    
    def recognize(self, username):
        
        if (Recognizer.is_registered(username) == False):
            return Recognizer.Status.NOT_REGISTERED
        
        path_base = self.database_path + username
        
        path_img_base = path_base + self.test_path + "test.jpg"
        path_img_records = path_base + self.record_path
        
        img_base = cv2.imread(path_img_base)
        img_base_array = Recognizer.extract_facial_points(img_base)
        
        for file in os.listdir(path_img_records):
            if file.endswith(".jpg") or file.endswith(".png"):
                path_img_test = os.path.join(path_img_records, file)
                
                img_test = cv2.imread(path_img_test)
                img_test_array = Recognizer.extract_facial_points(img_test)
                
                dist = Recognizer.euclidean_distance(img_base_array, img_test_array)
                
                if (dist < self.threshold):
                    return Recognizer.Status.IDENTIFIED
                
        return Recognizer.Status.NOT_IDENTIFIED
                