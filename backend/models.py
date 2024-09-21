from config import mongo_db

# Reference the 'User' collection from the MongoDB database
users_collection = mongo_db['User']

class User:
    def __init__(self, first_name, last_name, email):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email

    @classmethod
    def from_dict(cls, data):
        """Create a User instance from a dictionary."""
        return cls(
            first_name=data.get("firstName"),
            last_name=data.get("lastName"),
            email=data.get("email")
        )

    def to_dict(self):
        """Convert the User instance to a dictionary (MongoDB-compatible document)."""
        return {
            "firstName": self.first_name,
            "lastName": self.last_name,
            "email": self.email
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
    
    
