from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
import os
from dotenv import load_dotenv
from functools import wraps
from bson import ObjectId
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", os.urandom(32).hex())

# Initialize MongoDB Collections
mongo = PyMongo(app)
users_collection = mongo.db["user-info"]
timeline_collection = mongo.db["active-timelines"]
file_versions_collection = mongo.db["file-versions"]
capsules_collection = mongo.db["capsules"]            # For Chrono Capsules (full system state)
eb_snapshots_collection = mongo.db["ebs-snapshots"]
ec2_instances_collection = mongo.db["ec2-instances"]

def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])  # convert ObjectId to string
    return doc

# Auth decorator to extract username from JWT
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"message": "Token is missing"}), 401

        try:
            token = token.split(" ")[1]  # Bearer <token>
            data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
            current_user = data["username"]
        except:
            return jsonify({"message": "Token is invalid or expired"}), 401

        return f(current_user, *args, **kwargs)
    return decorated

@app.route("/chrono/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if users_collection.find_one({"username": username}):
        return jsonify({"message": "User already exists"}), 409

    hashed_password = generate_password_hash(password)
    users_collection.insert_one({"username": username, "password": hashed_password})
    return jsonify({"message": "User created successfully"}), 201

@app.route("/chrono/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    print("The usernmae is: ", username)
    print("The password is: ", password)

    user = users_collection.find_one({"username": username})
    if not user or not check_password_hash(user["password"], password):
        return jsonify({"message": "Invalid username or password"}), 401

    token = jwt.encode({
        "username": username,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=6)
    }, app.config["SECRET_KEY"], algorithm="HS256")

    return jsonify({"token": token}), 200

# View only user’s active timelines
@app.route('/chrono/view/timelines', methods=['GET'])
@token_required
def view_timelines(current_user):
    timelines = [serialize_doc(t) for t in timeline_collection.find({"username": current_user})]
    return jsonify(timelines), 200

# View only user’s file versions
@app.route('/chrono/view/file-versions', methods=['GET'])
@token_required
def view_file_versions(current_user):
    versions = [serialize_doc(v) for v in file_versions_collection.find({"username": current_user})]
    return jsonify(versions), 200

# View only user’s capsules
@app.route('/chrono/view/capsules', methods=['GET'])
@token_required
def view_capsules(current_user):
    capsules = [serialize_doc(c) for c in capsules_collection.find({"username": current_user})]
    return jsonify(capsules), 200

# View only user’s EBS snapshots
@app.route('/chrono/view/ebs-snapshots', methods=['GET'])
@token_required
def view_snapshots(current_user):
    snapshots = [serialize_doc(s) for s in eb_snapshots_collection.find({"username": current_user})]
    return jsonify(snapshots), 200

# View only user’s EC2 instance status
@app.route('/chrono/view/ec2-instances', methods=['GET'])
@token_required
def view_ec2_instances(current_user):
    instances = [serialize_doc(e) for e in ec2_instances_collection.find({"username": current_user})]
    return jsonify(instances), 200

if __name__ == "__main__":
    app.run(debug=True, port=5001)
    CORS(app, resources={r"/chrono/*": {"origins": "http://localhost:8080"}})