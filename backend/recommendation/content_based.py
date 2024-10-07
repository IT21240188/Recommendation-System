import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from config import mongo_db
from bson import ObjectId
from flask import jsonify

def get_content_based_recommend(user_id):

    try:
        user_id = ObjectId(user_id)
    except Exception as e:
        return {"error": f"Invalid user ID format: {str(e)}"}
    
    #Fetch books from the UserHistory collection where hasRead is True for the given user_id
    user_history = list(mongo_db['UserHistory'].find({"userId": user_id, "hasRead": True}, {"bookId": 1}))
    
    if not user_history:
        return []  
    # Extract the bookIds the user has read
    read_book_ids = [str(history['bookId']) for history in user_history]
    
    # Fetch book details from the Book collection
    books = list(mongo_db['Book'].find({}, {"bookId": 1, "title": 1, "description": 1, "author": 1, "genre": 1,"language": 1,"publishedDate": 1}))
    
    df = pd.DataFrame(books)

    # Combine title,description, author, genre,language and publishedYear into a single feature for TF-IDF vectorization
    df['combined'] = df['title'] + ' '+df['description']+' ' + df['author'] + ' ' + df['genre'] + ' '+ df['language'] + ' ' + df['publishedDate'].astype(str)

    # Create a TF-IDF matrix for the combined features
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df['combined'])

    # Compute cosine similarity for all books
    cosine_sim = cosine_similarity(tfidf_matrix)

    # Ensure that both are strings and strip any leading/trailing spaces
    df['_id'] = df['_id'].astype(str).str.strip()
    read_book_ids = [str(book_id).strip() for book_id in read_book_ids]

    read_indices = df[df['_id'].isin(read_book_ids)].index.tolist()

    # Create a set to store recommended book indices
    recommended_books = set()

    # For each book the user has read, find similar books and add to the recommendations
    for idx in read_indices:
        sim_scores = list(enumerate(cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        
        # Get top 10 most similar books, excluding the book itself (hence starting from 1, not 0)
        similar_books = sim_scores[1:11]

        # Add the indices of similar books to the recommendation set
        recommended_books.update([i[0] for i in similar_books])

    # Exclude books the user has already read from the recommendations
    recommended_books = [i for i in recommended_books if df.iloc[i]['_id'] not in read_book_ids]
    
    # Get the Ids of recommended_books
    books_to_recommend = df['_id'].iloc[recommended_books].tolist()

    # Fetch detailed book information from MongoDB
    recommended_books = list(mongo_db['Book'].find({"_id": {"$in": [ObjectId(book_id) for book_id in books_to_recommend]}}))

    # Convert ObjectId fields to strings in recommended_books
    for book in recommended_books:
        book["_id"] = str(book["_id"]) 
        book["id"] = str(book["_id"]) # Convert the ObjectId to string
        
    return {"recommended_books": recommended_books}


def get_similar_books(book_id):

    book_id = ObjectId(book_id)

    books_data = list(mongo_db['Book'].find({}, {"title": 1, "description": 1, "author": 1, "genre": 1, "language": 1, "coverImage":1, "_id": 1}))
    books = list(books_data)

    # Convert books data into a DataFrame
    df = pd.DataFrame(books)
  
    # Combine description and genre into a single feature for similarity
    df['combined_features'] = df['title'] + " " + df['description'] + " " + df['author'] + " " + df['genre'] + " " + df['language']
    
    # Use TF-IDF Vectorizer to transform text into feature vectors
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df['combined_features'])

    # Calculate cosine similarity
    similarity_matrix = cosine_similarity(tfidf_matrix)

    # Get the index of the input book
    # Find the index using the book_id in the DataFrame
    book_index = df[df['_id'] == book_id].index

    if book_index.empty:
        raise ValueError(f"Book with ID {book_id} not found.")

    book_index = book_index[0]  # Get the first matching index

    # Get the similarity scores for the input book
    similarity_scores = list(enumerate(similarity_matrix[book_index]))

    # Sort books based on similarity scores
    sorted_books = sorted(similarity_scores, key=lambda x: x[1], reverse=True)

    # Get the top 10 similar books (excluding the book itself)
    similar_books = [books[i[0]] for i in sorted_books[1:11]]  # Exclude the first one as it's the same book

    for book in similar_books:
        book['_id'] = str(book['_id'])  # Convert ObjectId to string
        book['id'] = book['_id']

    return similar_books
