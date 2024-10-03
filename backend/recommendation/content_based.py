import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from config import mongo_db
from bson import ObjectId

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

    # Return the recommended book titles
    return df['title'].iloc[recommended_books].tolist()
