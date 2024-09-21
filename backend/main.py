from flask import request, jsonify
from config import app
from models import User, Book , UserHistory
from bson import ObjectId




# User Routes
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



@app.route("/update_user/<string:user_id>", methods=["PATCH"])
def update_user(user_id):
    try:
        # Convert user_id to ObjectId
        user_id = ObjectId(user_id)
    except:
        return jsonify({"message": "Invalid user ID format"}), 400

    # Find the user by user_id
    user = User.find_one({"_id": user_id})

    if not user:
        return jsonify({"message": "User not found"}), 404

    # Get new data from request or keep existing
    first_name = request.json.get("firstName", user["firstName"])
    last_name = request.json.get("lastName", user["lastName"])

    # Update the user data in MongoDB
    User.update_one(
        {"_id": user_id},
        {"$set": {"firstName": first_name, "lastName": last_name}}
    )

    return jsonify({"message": "User updated."}), 200


# Delete User Route
@app.route("/delete_user/<string:user_id>", methods=["DELETE"])
def delete_user(user_id):
    try:
        # Convert user_id to ObjectId
        user_id = ObjectId(user_id)
    except:
        return jsonify({"message": "Invalid user ID format"}), 400

    # Find and delete the user by user_id
    result = User.delete_one({"_id": user_id})

    if result.deleted_count == 0:
        return jsonify({"message": "User not found"}), 404

    return jsonify({"message": "User deleted!"}), 200




# Book Routes
@app.route("/books", methods=["GET"])
def get_books():
    books = list(Book.find({}, {"_id": 0}))  # Exclude MongoDB's _id field from the result
    return jsonify({"books": books}), 200


@app.route("/create_book", methods=["POST"])
def create_book():
    title = request.json.get("title")
    author = request.json.get("author")
    type = request.json.get("type")
    published_year = request.json.get("publishedYear")

    if not title or not author or not type or not published_year:
        return jsonify({"message": "All book details must be provided"}), 400


    new_book = {
        "title": title,
        "author": author,
        "type": type,
        "publishedYear": published_year
    }

    Book.insert(new_book)
    serializable_book = {
        "title": new_book["title"],
        "author": new_book["author"],
        "type": new_book["type"],
        "publishedYear": new_book["publishedYear"]
    }

    return jsonify({"message": "Book created!", "book": serializable_book}), 201


@app.route("/update_book/<string:book_id>", methods=["PATCH"])
def update_book(book_id):
    try:
        # Convert book_id to ObjectId
        book_id = ObjectId(book_id)
    except:
        return jsonify({"message": "Invalid book ID format"}), 400

    book = Book.find_one({"_id": book_id})

    if not book:
        return jsonify({"message": "Book not found"}), 404

    # Update fields, or keep existing if not provided
    title = request.json.get("title", book["title"])
    author = request.json.get("author", book["author"])
    published_year = request.json.get("publishedYear", book["publishedYear"])

    # Update the book in the database
    Book.update_one(
        {"_id": book_id},
        {"$set": {"title": title, "author": author, "publishedYear": published_year}}
    )

    return jsonify({"message": "Book updated."}), 200

# Delete Book Route
@app.route("/delete_book/<string:book_id>", methods=["DELETE"])
def delete_book(book_id):
    try:
        # Convert book_id to ObjectId
        book_id = ObjectId(book_id)
    except:
        return jsonify({"message": "Invalid book ID format"}), 400

    result = Book.delete_one({"_id": book_id})

    if result.deleted_count == 0:
        return jsonify({"message": "Book not found"}), 404

    return jsonify({"message": "Book deleted!"}), 200



# Route to create a new interaction between user and book
@app.route("/create_interaction", methods=["POST"])
def create_interaction():
    user_id = request.json.get("userId")
    book_id = request.json.get("bookId")
    
    try:
        rating = int(request.json.get("rating", None))  # Convert rating to int
    except (TypeError, ValueError):
        rating = None  # Handle if rating is not provided or invalid
    
    has_read = request.json.get("hasRead", "false").lower() == "true"  # Convert to bool

    if not user_id or not book_id:
        return jsonify({"message": "UserID or BookID is missing"}), 400

    try:
        user_id = ObjectId(user_id)
        book_id = ObjectId(book_id)
    except:
        return jsonify({"message": "Invalid user ID or book ID format"}), 400

    interaction = UserHistory.find_one({"userId": user_id, "bookId": book_id})
    # Create updated_data variable outside the if block
    updated_data = {
        "rating": rating,
        "hasRead": has_read
    }

    if interaction:
        # Update existing interaction
        result = UserHistory.update_one(
            {"userId": user_id, "bookId": book_id},
            updated_data
        )

        if result.modified_count > 0:
            interaction["_id"] = str(interaction["_id"])
            interaction["userId"] = str(interaction["userId"])
            interaction["bookId"] = str(interaction["bookId"])
            return jsonify({"message": "Interaction updated.", "interaction": interaction}), 200
    
    else:
        # Create new interaction
        new_interaction = {
            "userId": user_id,
            "bookId": book_id,
            "rating": rating,
            "hasRead": has_read
        }

        inserted_id = UserHistory.insert(new_interaction).inserted_id
        new_interaction["_id"] = str(inserted_id)
        new_interaction["userId"] = str(new_interaction["userId"])
        new_interaction["bookId"] = str(new_interaction["bookId"])

        return jsonify({"message": "Interaction created!", "interaction": new_interaction}), 201


# Route to update an interaction (rating or reading status)
@app.route("/update_interaction/<string:user_id>/<string:book_id>", methods=["PATCH"])
def update_interaction(user_id, book_id):
    interaction = UserHistory.find_one({"userId": user_id, "bookId": book_id})

    if not interaction:
        return jsonify({"message": "Interaction not found"}), 404

    rating = request.json.get("rating", interaction["rating"])
    has_read = request.json.get("hasRead", interaction["hasRead"])

    UserHistory.update_one(
        {"userId": user_id, "bookId": book_id},
        {"rating": rating, "hasRead": has_read}
    )

    return jsonify({"message": "Interaction updated."}), 200


# Route to get all interactions for a user
@app.route("/user_interactions/<string:user_id>", methods=["GET"])
def get_user_interactions(user_id):
    interactions = UserHistory.find({"userId": user_id})
    return jsonify({"interactions": interactions}), 200


# Route to delete an interaction
@app.route("/delete_interaction/<string:user_id>/<string:book_id>", methods=["DELETE"])
def delete_interaction(user_id, book_id):
    result = UserHistory.delete_one({"userId": user_id, "bookId": book_id})

    if result.deleted_count == 0:
        return jsonify({"message": "Interaction not found"}), 404

    return jsonify({"message": "Interaction deleted!"}), 200





if __name__ == "__main__":
    app.run(debug=True)
