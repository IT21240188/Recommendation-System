import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar.jsx'
import { Container } from 'react-bootstrap';
import BookCard from '../components/BookCard.jsx';
import { Box } from '@mui/material';

const HomePage = () => {
  const [users, setUsers] = useState([]);


  const bookList = [
    {
      title: "To Kill a Mockingbird",
      description: "A novel about the serious issues of rape and racial inequality.",
      author: "Harper Lee",
      ISBN: "9780061120084",
      genre: "Fiction",
      language: "English",
      published_date: "1960-07-11",
      cover_image: "https://m.media-amazon.com/images/I/81A-mvlo+QL._AC_UF1000,1000_QL80_.jpg"
    },
    {
      title: "1984",
      description: "A dystopian novel set in a totalitarian society under constant surveillance.",
      author: "George Orwell",
      ISBN: "9780451524935",
      genre: "Dystopian",
      language: "English",
      published_date: "1949-06-08",
      cover_image: "https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF1000,1000_QL80_.jpg"
    },
    {
      title: "Pride and Prejudice",
      description: "A romantic novel that also critiques the British landed gentry.",
      author: "Jane Austen",
      ISBN: "9780141040349",
      genre: "Romance",
      language: "English",
      published_date: "1813-01-28",
      cover_image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQglMibxwfpDJspDktgnSZEzSsm_o7QV0EBCrzNcEu5mwBwOxS02Ugvicif5H7teNthJ78&usqp=CAU"
    },
    {
      title: "The Great Gatsby",
      description: "A novel that explores themes of wealth, excess, and the American Dream.",
      author: "F. Scott Fitzgerald",
      ISBN: "9780743273565",
      genre: "Fiction",
      language: "English",
      published_date: "1925-04-10",
      cover_image: "https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg"
    },
    {
      title: "Moby Dick",
      description: "A novel about the obsessive quest of Captain Ahab for revenge on Moby Dick.",
      author: "Herman Melville",
      ISBN: "9781503280786",
      genre: "Adventure",
      language: "English",
      published_date: "1851-11-14",
      cover_image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSW1wnrmDRKTeS4uSaLJxaHzkKijUKLymDzxA&s"
    },
    {
      title: "War and Peace",
      description: "A novel that intertwines themes of war, peace, love, and family.",
      author: "Leo Tolstoy",
      ISBN: "9780199232765",
      genre: "Historical Fiction",
      language: "Russian",
      published_date: "1869-01-01",
      cover_image: "https://m.media-amazon.com/images/I/81oHM-dzefL._AC_UF1000,1000_QL80_.jpg"
    },
    {
      title: "The Catcher in the Rye",
      description: "A story about a young man's struggle with growing up and alienation.",
      author: "J.D. Salinger",
      ISBN: "9780316769488",
      genre: "Fiction",
      language: "English",
      published_date: "1951-07-16",
      cover_image: "https://m.media-amazon.com/images/I/71UypkUjStL._AC_UF1000,1000_QL80_.jpg"
    },
    {
      title: "The Hobbit",
      description: "A fantasy novel about the adventure of Bilbo Baggins, a hobbit.",
      author: "J.R.R. Tolkien",
      ISBN: "9780547928227",
      genre: "Fantasy",
      language: "English",
      published_date: "1937-09-21",
      cover_image: "https://m.media-amazon.com/images/I/91b0C2YNSrL._AC_UF1000,1000_QL80_.jpg"
    },
    {
      title: "The Alchemist",
      description: "A philosophical book about a young shepherd on his journey to find treasure.",
      author: "Paulo Coelho",
      ISBN: "9780061122415",
      genre: "Philosophy",
      language: "Portuguese",
      published_date: "1988-01-01",
      cover_image: "https://m.media-amazon.com/images/I/71aFt4+OTOL._AC_UF1000,1000_QL80_.jpg"
    },
    {
      title: "Harry Potter and the Sorcerer's Stone",
      description: "The first book in the Harry Potter series about a young wizard's journey.",
      author: "J.K. Rowling",
      ISBN: "9780439708180",
      genre: "Fantasy",
      language: "English",
      published_date: "1997-06-26",
      cover_image: "https://m.media-amazon.com/images/I/81YOuOGFCJL._AC_UF1000,1000_QL80_.jpg"
    },
    {
      title: "The Catcher in the Rye",
      description: "A story about a young man's struggle with growing up and alienation.",
      author: "J.D. Salinger",
      ISBN: "9780316769488",
      genre: "Fiction",
      language: "English",
      published_date: "1951-07-16",
      cover_image: "https://m.media-amazon.com/images/I/71UypkUjStL._AC_UF1000,1000_QL80_.jpg"
    },
    {
      title: "The Hobbit",
      description: "A fantasy novel about the adventure of Bilbo Baggins, a hobbit.",
      author: "J.R.R. Tolkien",
      ISBN: "9780547928227",
      genre: "Fantasy",
      language: "English",
      published_date: "1937-09-21",
      cover_image: "https://m.media-amazon.com/images/I/91b0C2YNSrL._AC_UF1000,1000_QL80_.jpg"
    },
    {
      title: "The Alchemist",
      description: "A philosophical book about a young shepherd on his journey to find treasure.",
      author: "Paulo Coelho",
      ISBN: "9780061122415",
      genre: "Philosophy",
      language: "Portuguese",
      published_date: "1988-01-01",
      cover_image: "https://m.media-amazon.com/images/I/71aFt4+OTOL._AC_UF1000,1000_QL80_.jpg"
    },
    {
      title: "Harry Potter and the Sorcerer's Stone",
      description: "The first book in the Harry Potter series about a young wizard's journey.",
      author: "J.K. Rowling",
      ISBN: "9780439708180",
      genre: "Fantasy",
      language: "English",
      published_date: "1997-06-26",
      cover_image: "https://m.media-amazon.com/images/I/81YOuOGFCJL._AC_UF1000,1000_QL80_.jpg"
    }
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/users');
      setUsers(response.data.contacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };
  return (
    <div>
      <NavBar />
      <Container style={{marginTop:'4%'}}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center', // Center items horizontally
              gap: 2, // Gap between cards
            }}
          >
            {bookList.map((book, index) => (
              <BookCard book={book} key={index} />
            ))}
          </Box>
      </Container>
    </div>
  );
};

export default HomePage;
