import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar.jsx';
import { Container, Row, Col } from 'react-bootstrap';
import BookCard from '../components/BookCard.jsx';
import { Box, TextField, Button } from '@mui/material';
import FooterC from '../components/Footer.jsx';

const ForYou = () => {
    const userInfoString = localStorage.getItem('UserInfo');
    const storedUserInfo = JSON.parse(userInfoString);

    const [bookList, setBookList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    const fetchList = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `http://127.0.0.1:5000/recommend/content/${storedUserInfo.user._id}`
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

    // Filter books based on the search query
    const filteredBooks = bookList.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <NavBar />
            {/* Book Section */}
            <Container style={{ paddingTop: '4%', position: 'relative' }}>
                <Row style={{marginLeft:'5.8%', justifyContent:'center'}}>
                        {/* Search Input */}
                        <TextField
                            label="Search Books"
                            variant="outlined"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                            style={{ marginBottom: '20px', maxWidth:'50%' }}
                            size='small'
                        />
                    

                </Row>


                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: 2,
                    }}
                >
                    {filteredBooks && filteredBooks.length > 0 ? (
                        filteredBooks.map((book, index) => (
                            <BookCard book={book} key={index} />
                        ))
                    ) : (
                        <h4 style={{ color: 'gray' }}>No books found</h4>
                    )}
                </Box>
            </Container>
            <FooterC />
        </div>
    );
};

export default ForYou;
