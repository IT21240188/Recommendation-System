from config import mongo_db

# Reference the 'User' collection from the MongoDB database
users_collection = mongo_db['User']
books_collection = mongo_db['Book']
user_book_interactions_collection = mongo_db['UserHistory']

class User:
    def __init__(self, first_name, last_name,username, email, dob, gender, password, preference1, preference2, userType):
        self.first_name = first_name
        self.last_name = last_name
        self.username = username
        self.email = email
        self.dob = dob
        self.gender = gender
        self.password = password
        self.preference1 = preference1
        self.preference2 = preference2
        self.userType = userType
        

    @classmethod
    def from_dict(cls, data):
        """Create a User instance from a dictionary."""
        return cls(
            first_name=data.get("firstName"),
            last_name=data.get("lastName"),
            username=data.get("username"),
            email=data.get("email"),
            dob=data.get("dob"),
            gender=data.get("gender"),
            password=data.get("password"),
            preference1=data.get("preference1"),
            preference2=data.get("preference2"),
            userType=data.get("userType")
        )

    def to_dict(self):
        """Convert the User instance to a dictionary (MongoDB-compatible document)."""
        return {
            "firstName": self.first_name,
            "lastName": self.last_name,
            "username": self.username,
            "email": self.email,
            "dob": self.dob,
            "gender": self.gender,
            "password": self.password,
            "preference1": self.preference1,
            "preference2": self.preference2,
            "userType": self.userType,
        }

    @staticmethod
    def create_collection():
        """Create the User collection if it does not exist."""
        if 'User' not in mongo_db.list_collection_names():
            mongo_db.create_collection('User')

    @staticmethod
    def insert(user_data):
        """Insert a user document into the collection."""
        return users_collection.insert_one(user_data)

    @staticmethod
    def find(query):
        """Find users based on a query."""
        return list(users_collection.find(query))

    @staticmethod
    def find_one(query):
        """Find a single user based on a query."""
        return users_collection.find_one(query)

    @staticmethod
    def update_one(query, update_data):
        """Update a user in the collection."""
        return users_collection.update_one(query, {"$set": update_data})

    @staticmethod
    def delete_one(query):
        """Delete a user from the collection."""
        return users_collection.delete_one(query)

    @staticmethod
    def to_json(user):
        """Convert a MongoDB document to JSON format."""
        return {
            "id": str(user.get("_id", "")),  # Convert ObjectId to string
            "firstName": user.get("firstName", ""),
            "lastName": user.get("lastName", ""),
            "email": user.get("email", "")
        }
    

#Book Model
class Book:
    def __init__(self, title, description, author, ISBN, genre, language, published_date, cover_image):
        self.title = title
        self.description = description
        self.author = author
        self.ISBN = ISBN
        self.genre = genre
        self.language = language
        self.published_date = published_date
        self.cover_image = cover_image

    @classmethod
    def from_dict(cls, data):
        return cls(
            title=data.get("title"),
            description=data.get("description"),
            author=data.get("author"),
            ISBN=data.get("ISBN"),
            genre=data.get("genre"),
            language=data.get("language"),
            published_date=data.get("publishedDate"),
            cover_image=data.get("coverImage")
        )

    def to_dict(self):
        return {
            "title": self.title,
            "description": self.description,
            "author": self.author,
            "ISBN": self.ISBN,
            "genre": self.genre,
            "language": self.language,
            "publishedDate": self.published_date,
            "coverImage": self.cover_image
        }

    @staticmethod
    def insert(book_data):
        return books_collection.insert_one(book_data)

    @staticmethod
    def find(query):
        return list(books_collection.find(query))

    @staticmethod
    def find_one(query):
        return books_collection.find_one(query)

    @staticmethod
    def update_one(query, update_data):
        return books_collection.update_one(query, {"$set": update_data})

    @staticmethod
    def delete_one(query):
        return books_collection.delete_one(query)




class UserHistory:
    def __init__(self, user_id, book_id, rating=None, has_read=False):
        self.user_id = user_id
        self.book_id = book_id
        self.rating = rating
        self.has_read = has_read

    @classmethod
    def from_dict(cls, data):
        return cls(
            user_id=data.get("userId"),
            book_id=data.get("bookId"),
            rating=data.get("rating"),
            has_read=data.get("hasRead", False)
        )

    def to_dict(self):
        return {
            "userId": self.user_id,
            "bookId": self.book_id,
            "rating": self.rating,
            "hasRead": self.has_read
        }

    @staticmethod
    def insert(interaction_data):
        return user_book_interactions_collection.insert_one(interaction_data)

    @staticmethod
    def find(query):
        return list(user_book_interactions_collection.find(query))

    @staticmethod
    def find_one(query):
        return user_book_interactions_collection.find_one(query)

    @staticmethod
    def update_one(query, update_data):
        return user_book_interactions_collection.update_one(query, {"$set": update_data})

    @staticmethod
    def delete_one(query):
        return user_book_interactions_collection.delete_one(query) 
