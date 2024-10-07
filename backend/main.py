from flask import request, jsonify
from config import app
from models import User, Book , UserHistory
from bson import ObjectId
from recommendation.collaborative import get_collaborative_recommendations
from recommendation.content_based import get_content_based_recommend
from recommendation.hybrid_recommendation import get_hybrid_recommendations
from recommendation.evaluate_recommendations import evaluate_map_for_users
from recommendation.Item_based import get_similar_books
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json


# User Routes
@app.route("/users", methods=["GET"])
def get_users():
    # Fetch all users from the MongoDB collection
    users = list(User.find({}))  

     # Rename _id to id in the result
    for user in users:
        user['id'] = str(user['_id'])  # Convert ObjectId to string
        user.pop('_id')  # Remove the original _id field
        
    return jsonify({"users": users}), 200


@app.route("/create_user", methods=["POST"])
def create_user():
    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")
    username = request.json.get("userName")
    email = request.json.get("email")
    dob = request.json.get("dob")
    gender = request.json.get("gender")
    password = request.json.get("password")
    preference1 = request.json.get("preference1")
    preference2 = request.json.get("preference2")
    profileImage = request.json.get("profileImage")

    if not first_name or not last_name or not username or not email or not password or not preference1:
        return jsonify({"message": "You must include a first name, last name, and email and other required feilds"}), 400

    if User.find_one({"email": email}):
        return jsonify({"message": "User with this email already exists"}), 400

    new_user = {
        "firstName": first_name,
        "lastName": last_name,
        "email": email,
        "dob": dob,
        "gender": gender,
        "password": password,
        "preference1": preference1,
        "preference2": preference2,
        "userType": "User",
        "profileImage": profileImage,
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

@app.route("/login_user", methods=["POST"])
def login_user():
    email = request.json.get("email")
    password = request.json.get("password")
    userType = request.json.get("userType")

    if not email or not password:
        return jsonify({"message": "You must include email and other required feilds"}), 500
    user = User.find_one({"email": email})
    print(user)
    if user:
        if user["password"] == password:
            # Convert ObjectId to string
            user["_id"] = str(user["_id"])

            # Remove sensitive data before sending user object in the response
            user.pop("password", None)
            return jsonify({"user":user}), 200  # Return user object
        else:
            return jsonify({"message": "User password incorrect"}), 500
    else:
        return jsonify({"message": "User with this email not exists"}), 500


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

#get all Books
@app.route("/books", methods=["GET"])
def get_books():
    books = list(Book.find({}))  # Find all books without additional arguments
    for book in books:
        book['id'] = str(book.pop("_id", None))  # Rename _id to bookid and convert to string
    return jsonify({"books": books}), 200

#insert a book
@app.route("/create_book", methods=["POST"])
def create_book():
    # Get required fields from request JSON
    title = request.json.get("title")
    description = request.json.get("description")
    author = request.json.get("author")
    ISBN = request.json.get("ISBN")
    genre = request.json.get("genre")
    language = request.json.get("language")
    published_date = request.json.get("publishedDate")
    cover_image = request.json.get("coverImage")

    if not title or not author or not ISBN or not genre or not language or not published_date:
        return jsonify({"message": "All book details must be provided"}), 400

    # Create a new book entry
    new_book = {
        "title": title,
        "description": description,
        "author": author,
        "ISBN": ISBN,
        "genre": genre,
        "language": language,
        "publishedDate": published_date,
        "coverImage": cover_image
    }

    Book.insert(new_book)

    serializable_book = {
        "title": new_book["title"],
        "author": new_book["author"],
        "ISBN": new_book["ISBN"],
        "genre": new_book["genre"],
        "publishedDate": new_book["publishedDate"]
    }

    return jsonify({"message": "Book created!", "book": serializable_book}), 201


@app.route("/books/<book_id>", methods=["GET"])
def get_book(book_id):
    # Attempt to find the book by ID
    try:
        book = Book.find_one({"_id": ObjectId(book_id)})  # Query by ObjectId
    except Exception as e:
        return jsonify({"error": "Invalid ID format"}), 400  # Handle invalid ObjectId format

    if book is None:
        return jsonify({"message": "Book not found"}), 404  # Return 404 if the book doesn't exist

    # Convert the ObjectId to a string before returning
    book["_id"] = str(book["_id"])  # Convert ObjectId to string

    # Return the book as a JSON object
    return jsonify(book), 200  # Return the book data as JSON



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
            updated_interaction = UserHistory.find_one({"userId": user_id, "bookId": book_id})
            updated_interaction["_id"] = str(updated_interaction["_id"])
            updated_interaction["userId"] = str(updated_interaction["userId"])
            updated_interaction["bookId"] = str(updated_interaction["bookId"])

            return jsonify({"message": "Interaction updated.", "interaction": updated_interaction}), 200
        else:
            return jsonify({"message": "No changes made to the interaction."}), 200
    
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




@app.route("/recommend/collaborative/<string:user_id>", methods=["GET"])
def collaborative_recommend(user_id):
    try:
        # Call the function and receive the response
        recommendations = get_collaborative_recommendations(user_id)
        recommendations.rename(columns={'_id': 'id'}, inplace=True)
        # If the function returns a dict with an error, return that directly
        if isinstance(recommendations, dict) and "error" in recommendations:
            return jsonify(recommendations), 400
        
        # Return the recommendations as JSON
        return jsonify(recommendations)  
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Content-based filtering route
@app.route("/recommend/content/<string:user_id>", methods=["GET"])
def content_recommend(user_id):
    try:
        # Call the function and receive the response
        recommendations = get_content_based_recommend(user_id)
        
        # If the function returns a dict with an error, return that directly
        if isinstance(recommendations, dict) and "error" in recommendations:
            return jsonify(recommendations), 400
        
        # Return the recommendations as JSON
        return jsonify(recommendations)  
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
# Content-based item filtering route
@app.route("/recommend/itemcontent/<string:bookId>", methods=["GET"])
def content_item_recommend(bookId):
    try:
        # Call the function and receive the response
        recommendations = get_similar_books(bookId)
        
        # If the function returns a dict with an error, return that directly
        if isinstance(recommendations, dict) and "error" in recommendations:
            return jsonify(recommendations), 400
        
        # Return the recommendations as JSON
        return jsonify(recommendations)  
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
    
# Hybrid recommendation route
@app.route("/recommend/hybrid/<string:user_id>", methods=["GET"])
def hybrid_recommend(user_id):
    try:
        # Call the function and receive the response
        recommendations = get_hybrid_recommendations(user_id,0.5,0.5)
        # If the function returns a dict with an error, return that directly
        if isinstance(recommendations, dict) and "error" in recommendations:
            return jsonify(recommendations), 400
        
        # Return the recommendations as JSON
        return jsonify(recommendations)  
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    


# book filtering route
@app.route("/recommend/contentFirstUser/<string:user_id>", methods=["GET"])
def book_recommend_in_feed(user_id):
    try:
        # Convert user_id to ObjectId
        user_id = ObjectId(user_id)
    except:
        return jsonify({"message": "Invalid user ID format"}), 400

    try:
        interactions = UserHistory.find({"userId": user_id})

        if len(interactions) > 0:
            # If user has interaction history, use hybrid approach
            recommendations = get_hybrid_recommendations(user_id,0.5,0.5)
            return jsonify(recommendations), 200

        else:
            # If no interaction history, use content-based filtering
            books = list(Book.find({}))

            user = User.find_one({"_id": user_id})
            
            # Convert the book list to a DataFrame
            book_df = pd.DataFrame(books)

            # Combine user preferences into a single string
            userPreferences = user['preference1'] + ' ' + user['preference2']
            print(userPreferences)

            # Create a list of documents (book genres + user preferences)
            documents = list(book_df['genre']) + [userPreferences]
            print(documents)

            # Initialize the TF-IDF vectorizer
            tfidf_vectorizer = TfidfVectorizer()

            # Fit and transform the documents into TF-IDF vectors
            tfidf_matrix = tfidf_vectorizer.fit_transform(documents)

            # Compute cosine similarity between the user's profile and the books
            cosine_sim = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1])

            # Convert similarity scores to a flat list
            similarity_scores = cosine_sim.flatten()

            # Add similarity scores to the DataFrame
            book_df['similarity_score'] = similarity_scores

            # Filter out books with a similarity score of 0 or less
            book_df = book_df[book_df['similarity_score'] > 0]

            # Sort remaining books by similarity score in descending order
            recommended_books = book_df.sort_values(by='similarity_score', ascending=False)
            print(recommended_books)

            # Convert ObjectId fields to strings before returning
            recommended_books['_id'] = recommended_books['_id'].apply(str)
            recommended_books.rename(columns={'_id': 'id'}, inplace=True)

            # Convert DataFrame to JSON string with 'records' orientation
            recommended_books_json = recommended_books.to_json(orient='records')

            # Parse the JSON string to a Python list
            recommended_books_list = json.loads(recommended_books_json)

            return jsonify({"recommended_books": recommended_books_list}), 200

    except Exception as e:
        # Log the error to the console and return a 400 error response
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 400
    

@app.route('/recommend/evaluate', methods=['POST'])
def evaluate_recommendations():
    try:
        # Get the list of user IDs from the request body
        user_ids = request.json.get("user_ids", [])
        print(user_ids)
        if not user_ids or not isinstance(user_ids, list):
            return jsonify({"error": "A list of valid user IDs must be provided."}), 400
        
        # Validate user IDs as ObjectId
        try:
            valid_user_ids = [ObjectId(user_id) for user_id in user_ids]
        except Exception as e:
            return jsonify({"error": f"Invalid user ID format: {str(e)}"}), 400

        # Evaluate MAP for the list of users
        map_score = evaluate_map_for_users(valid_user_ids, k=10)  # Use valid_user_ids here

        # Return the MAP evaluation result
        return jsonify({
            "MAP_score": map_score,
            "user_count": len(valid_user_ids)  # Use valid_user_ids for user count
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    app.run(debug=True)
