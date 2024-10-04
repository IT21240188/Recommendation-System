from config import mongo_db
from recommendation.content_based import get_content_based_recommend
from bson import ObjectId

def average_precision_at_k(recommended, relevant, k):
    
    recommended = [str(rec) for rec in recommended]
    relevant = {str(rel) for rel in relevant}

    relevant_set = set(relevant)
    score = 0.0
    num_hits = 0.0

    for i, rec in enumerate(recommended[:k]):
        if rec in relevant_set:
            num_hits += 1.0
            score += num_hits / (i + 1.0)
            print(f"Hit at position {i+1}: num_hits={num_hits}, score={score}")

    return score / min(len(relevant_set), k)


def get_relevant_books(user_id):

    try:
        user_id = ObjectId(user_id)
    except Exception as e:
        return {"error": f"Invalid user ID format: {str(e)}"}
    
    user_preferences = mongo_db['User'].find_one({"_id": user_id}, {"preference1": 1, "preference2": 1})
    
    if not user_preferences:
        print(f"No preferences found for user {user_id}")
        return set()  # Return an empty set of relevant books
    
    preferences = [user_preferences.get('preference1'), user_preferences.get('preference2')]
    preferences = [pref for pref in preferences if pref]  # Remove any None values
    
    relevant_books = set()

    if not preferences:
        return relevant_books

    for preference in preferences:
        
        books = mongo_db['Book'].find({"genre": preference}, {"_id": 1})
        books_list = list(books)

        for book in books_list:
            relevant_books.add(book['_id'])  # Store only the book's ID in the relevant set

    return relevant_books


def evaluate_content_based_recommendations(user_id, k):

    relevant_books = get_relevant_books(user_id)
    

    if not relevant_books:
        return {"error": "No relevant preference books found for this user."}

    # Get content-based recommendations for the user
    content_result = get_content_based_recommend(str(user_id))
    if 'error' in content_result:
        return content_result

    recommended_books = [book["_id"] for book in content_result['recommended_books']]
    
    # Evaluation: Average Precision at K
    avg_precision = average_precision_at_k(recommended_books, relevant_books, k)

    return avg_precision

# Function to evaluate MAP for multiple users
def evaluate_map_for_users(user_ids, k):
    total_avg_precisions = []

    for user_id in user_ids:
        user_id_obj = ObjectId(user_id)
        avg_precision = evaluate_content_based_recommendations(user_id_obj, k)
        if isinstance(avg_precision, float):  # Only add valid average precision results
            total_avg_precisions.append(avg_precision)

    if not total_avg_precisions:
        return 0.0

    return sum(total_avg_precisions) / len(total_avg_precisions)
