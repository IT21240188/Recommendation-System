import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar.jsx'
import { Container } from 'react-bootstrap';
import BookCard from '../components/BookCard.jsx';
import { Box } from '@mui/material';

const HomePage = () => {
  
  const [users, setUsers] = useState([]);
  const [bookList, setBookList] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchList = async () => {
    setIsLoading(true);
    try {
        const response = await axios.get('http://127.0.0.1:5000/books');
        setBookList(response.data.books);
        setIsLoading(false);

    } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
    }
}

  useEffect(() => {
    fetchUsers();
    fetchList();
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
            {bookList.length>0 && bookList.map((book, index) => (
              <BookCard book={book} key={index} />
            ))}
          </Box>
      </Container>
    </div>
  );
};

export default HomePage;
