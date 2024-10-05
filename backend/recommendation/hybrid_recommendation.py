from bson import ObjectId
from recommendation.collaborative import get_collaborative_recommendations
from recommendation.content_based import get_content_based_recommend
from config import mongo_db

def get_hybrid_recommendations(user_id, collaborative_weight, content_weight):
    try:
        user_id = ObjectId(user_id)
    except Exception as e:
        return {"error": f"Invalid user ID format: {str(e)}"}

    # Step 1: Get recommendations from collaborative filtering
    collaborative_recommendations = get_collaborative_recommendations(user_id)
    if "error" in collaborative_recommendations:
        return collaborative_recommendations
    
    # Extract only the _id from collaborative recommendations
    collaborative_recommendations = [book["_id"] for book in collaborative_recommendations.get("recommended_books", [])]

    # Step 2: Get recommendations from content-based filtering
    content_recommendations = get_content_based_recommend(user_id)
    if "error" in content_recommendations:
        return content_recommendations
    
    # Extract only the _id from content-based recommendations
    content_recommendations = [book["_id"] for book in content_recommendations.get("recommended_books", [])]


    # Step 3: Combine recommendations using weighted average
    # Convert both lists to sets for easy combination
    collaborative_set = set(collaborative_recommendations)
    content_set = set(content_recommendations)
    
    # Use a weighted approach to combine recommendations
    hybrid_recommendations = {}
    
    for book in collaborative_set:
        hybrid_recommendations[book] = collaborative_weight
    
    for book in content_set:
        if book in hybrid_recommendations:
            hybrid_recommendations[book] += content_weight  # Increase weight if common
        else:
            hybrid_recommendations[book] = content_weight

    # Sort by weighted scores in descending order
    sorted_recommendations = sorted(hybrid_recommendations.items(), key=lambda x: x[1], reverse=True)
    

    # Get only the book IDs, sorted by combined score
    books_to_recommend = [book[0] for book in sorted_recommendations]

    # Fetch detailed book information from MongoDB
    recommended_books = list(mongo_db['Book'].find({"_id": {"$in": [ObjectId(book_id) for book_id in books_to_recommend]}}))

    # Convert ObjectId fields to strings in recommended_books
    for book in recommended_books:
        book["_id"] = str(book["_id"])  # Convert the ObjectId to string
        book["id"] = book["_id"]
        # If there are any other ObjectId fields, convert them as needed
        
    return {"recommended_books": recommended_books}
