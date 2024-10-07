from flask import Flask, jsonify
from config import mongo_db
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

def get_similar_books(book_id):
    #Fetch all books from MongoDB collection
    books_data = list(mongo_db['Book'].find({}, {"title": 1,"description":1, "author": 1, "genre": 1,"language":1, "id": 1}))
    books = list(books_data)

    #Convert books data into a DataFrame
    df = pd.DataFrame(books)
  
    
    #Combine description and genre into a single feature for similarity
    df['combined_features'] = df['title'] + " " + df['description'] + " " + df['author'] + " " + df['genre'] + " " + df['language']
    
    # Use TF-IDF Vectorizer to transform text into feature vectors
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df['combined_features'])
    print(tfidf_matrix)
    
    # Compute cosine similarity between all books
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    
    # Find the index of the selected book in the DataFrame
    try:
        idx = df.index[df['_id'] == book_id].tolist()[0]
    except IndexError:
        return {"message": "Book not found"}, 404

    # Get pairwise similarity scores for the book and all others
    sim_scores = list(enumerate(cosine_sim[idx]))
    
    # Sort the books based on similarity scores (excluding itself)
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:]  # Top 5 most similar books
    
    # Get the indices of the top similar books
    book_indices = [i[0] for i in sim_scores]
    
    # Return the top similar books as a list of dictionaries
    similar_books = df.iloc[book_indices].to_dict('records')
    
    return {"similar_books": similar_books}