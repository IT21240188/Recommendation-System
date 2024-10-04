import pandas as pd
from sklearn.neighbors import NearestNeighbors
from config import mongo_db
from bson import ObjectId
from flask import jsonify

def get_collaborative_recommendations(user_id):
    # Fetch user history from MongoDB
    user_history = list(mongo_db['UserHistory'].find({}, {"userId": 1, "bookId": 1, "rating": 1}))
    data = pd.DataFrame(user_history)

    # Convert ratings to binary and pivot the data
    data['binary_rating'] = data['rating'].apply(lambda x: 1 if x >= 3 else 0)
    B = data.pivot(index='userId', columns='bookId', values='binary_rating').fillna(0)

    # Ensure user_id is an ObjectId
    try:
        user_id_obj = ObjectId(user_id)
    except Exception as e:
        return {"error": f"Invalid user ID format: {str(e)}"}

    # Check if user_id exists in the DataFrame
    if user_id_obj not in B.index:
        return {"error": f"User ID {user_id} not found in user history."}

    # Get the index of the user_id
    user_index = list(B.index).index(user_id_obj)

    # KNN model
    n_neighbors = min(10, B.shape[0])  # Set n_neighbors to the smaller of 10 or the number of users
    knn_model = NearestNeighbors(metric='cosine', algorithm='brute', n_neighbors=n_neighbors, n_jobs=-1)
    knn_model.fit(B)

    # Use user_id_obj to get recommendations
    distances, indices = knn_model.kneighbors(B.iloc[user_index].values.reshape(1, -1))
    similar_users = indices.flatten()[1:]

    books_to_recommend = []
    for similar_user in similar_users:
        user_books = B.iloc[similar_user]
        unread_books = user_books[user_books > 0]
        books_to_recommend.extend(unread_books.index.tolist())

    # Convert ObjectId to string if necessary
    books_to_recommend = [str(book_id) for book_id in books_to_recommend]
    

    # Fetch detailed book information from MongoDB
    recommended_books = list(mongo_db['Book'].find({"_id": {"$in": [ObjectId(book_id) for book_id in books_to_recommend]}}))

    # Convert ObjectId fields to strings in recommended_books
    for book in recommended_books:
        book["_id"] = str(book["_id"])  # Convert the ObjectId to string
        # If there are any other ObjectId fields, convert them as needed

    return {"recommended_books": recommended_books}
