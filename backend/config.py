from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)


mongo_client = MongoClient('mongodb+srv://janulvw:if9WMX8yDJWT5RIn@cluster0.qvia3.mongodb.net/OnlineLibrary?retryWrites=true&w=majority&appName=Cluster0')
mongo_db = mongo_client['OnlineLibrary']  # Database name: OnlineLibrary


