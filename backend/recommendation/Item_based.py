from flask import Flask, jsonify, request
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
from config import mongo_db
from bson import ObjectId


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