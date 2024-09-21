from flask import request, jsonify
from config import app
from models import User 

@app.route("/users", methods=["GET"])
def get_users():
    # Fetch all users from the MongoDB collection
    users = list(User.find({}, {"_id": 0}))  # Exclude MongoDB's _id field from the result
    return jsonify({"users": users}), 200


@app.route("/create_user", methods=["POST"])
def create_user():
    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")
    email = request.json.get("email")

    if not first_name or not last_name or not email:
        return jsonify({"message": "You must include a first name, last name, and email"}), 400

    if User.find_one({"email": email}):
        return jsonify({"message": "User with this email already exists"}), 400

    new_user = {
        "firstName": first_name,
        "lastName": last_name,
        "email": email
    }

    try:
        User.insert(new_user)
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    
    # Convert the new user to a serializable format
    serializable_user = {
        "id": str(new_user.get("_id", "")),  # If you want to include ObjectId
        "firstName": new_user["firstName"],
        "lastName": new_user["lastName"],
        "email": new_user["email"]
    }

    return jsonify({"message": "User created!", "user": serializable_user}), 201



@app.route("/update_user/<string:email>", methods=["PATCH"])
def update_user(email):
    # Find the user by email
    user = User.find_one({"email": email})
    
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Get new data from request
    first_name = request.json.get("firstName", user["firstName"])
    last_name = request.json.get("lastName", user["lastName"])

    # Update the user data in MongoDB
    User.update_one(
        {"email": email},
        {"$set": {"firstName": first_name, "lastName": last_name}}
    )

    return jsonify({"message": "User updated."}), 200


@app.route("/delete_user/<string:email>", methods=["DELETE"])
def delete_user(email):
    # Find and delete the user by email
    result = User.delete_one({"email": email})

    if result.deleted_count == 0:
        return jsonify({"message": "User not found"}), 404

    return jsonify({"message": "User deleted!"}), 200


if __name__ == "__main__":
    app.run(debug=True)
