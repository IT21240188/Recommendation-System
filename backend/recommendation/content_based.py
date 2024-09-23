import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from config import mongo_db

def get_content_based_recommend(user_id):

    #Fetch books from the UserHistory collection where hasRead is True for the given user_id
    user_history = list(mongo_db['UserHistory'].find({"userId": user_id, "hasRead": True}, {"bookId": 1}))

    if not user_history:
        return []  

    # Extract the bookIds the user has read
    read_book_ids = [history['bookId'] for history in user_history]

    # Fetch book details from the Book collection
    books = list(mongo_db['Book'].find({}, {"bookId": 1, "title": 1, "author": 1, "type": 1, "publishedYear": 1}))

    df = pd.DataFrame(books)

    # Combine title, author, type, and publishedYear into a single feature for TF-IDF vectorization
    df['combined'] = df['title'] + ' ' + df['author'] + ' ' + df['type'] + ' ' + df['publishedYear'].astype(str)

    # Create a TF-IDF matrix for the combined features
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df['combined'])

    # Compute cosine similarity for all books
    cosine_sim = cosine_similarity(tfidf_matrix)

    # Find the indices of the books that the user has read
    read_indices = df[df['bookId'].isin(read_book_ids)].index.tolist()

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
    recommended_books = [i for i in recommended_books if df.iloc[i]['bookId'] not in read_book_ids]

    # Return the recommended book titles
    return df['title'].iloc[recommended_books].tolist()
