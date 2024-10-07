import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar.jsx';
import { Container } from 'react-bootstrap';
import BookCard from '../components/BookCard.jsx';
import { Box, Button } from '@mui/material';
import FooterC from '../components/Footer.jsx';

const ForYou = () => {
    const userInfoString = localStorage.getItem('UserInfo');
    const storedUserInfo = JSON.parse(userInfoString);

    const [bookList, setBookList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

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


    return (
        <div>
            <NavBar />
            {/* Book Section */}
            <Container
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
                    {bookList && bookList.length > 0 ? (
                        bookList.map((book, index) => <BookCard book={book} key={index} />)
                    ) : (
                    <>
                        <h4 style={{color:'gray'}}>No history found</h4>
                    </>)
                    }
                </Box>
            </Container>
            <FooterC />
        </div>
    )
}

export default ForYou
