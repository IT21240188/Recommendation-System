import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar.jsx';
import { Container } from 'react-bootstrap';
import BookCard from '../components/BookCard.jsx';
import { Box, Button } from '@mui/material';
import FooterC from '../components/Footer.jsx';

const HomePage = () => {
  const userInfoString = localStorage.getItem('UserInfo');
  const storedUserInfo = JSON.parse(userInfoString);

  const [bookList, setBookList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Create a reference for the book container
  const bookSectionRef = useRef(null);

  const fetchList = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/recommend/contentFirstUser/${storedUserInfo.user._id}`
      );
      console.log('Response is', response);
      setBookList(response.data.recommended_books);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Function to scroll to the book section
  const scrollToBooks = () => {
    if (bookSectionRef.current) {
      bookSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <NavBar />
      <div
        style={{
          position: 'absolute',
          top: '68px',
          width: '100%',
          height: '500px',
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
        }}
      >
        <img
          src="/bookStore_home.jpg"
          width={'100%'}
          height="500px"
          style={{
            filter: 'brightness(44%)',
            float: 'right',
            marginRight: '20px',
          }}
        />
      </div>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '350px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{ color: 'white', marginTop: '10%', fontFamily: 'monospace' }}
        >
          Join Us in the World of Books!
        </h1>
        <Button
          variant="outlined"
          style={{ marginTop: '20px', borderColor: 'white', color: 'white' }}
          onClick={scrollToBooks}
        >
          Start Exploring
        </Button>
      </div>

      {/* Book Section */}
      <Container
        ref={bookSectionRef}
        style={{ paddingTop: '4%', position: 'relative' }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          {bookList.length > 0 &&
            bookList.map((book, index) => <BookCard book={book} key={index} />)}
        </Box>
      </Container>
      <FooterC/>
    </div>
  );
};

export default HomePage;
