import React, { useState, useEffect } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { Row, Col } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import BooksTemplate from '../styles/BooksTemplate.module.css'
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import NavBar from '../components/NavBar';
import CircularProgress from '@mui/material/CircularProgress';
import BookCard from '../components/BookCard';
import { Box } from '@mui/material';


const BookView = () => {

    const navigate = useNavigate();

    const BookID = useParams('id');
console.log(BookID);

    //states for the form fields
    const [isLoading, setIsLoading] = useState(false);
    const [book, setBook] = useState('');
    const [bookList, setBookList] = useState('');

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://127.0.0.1:5000/books/${BookID.id}`);
            setBook(response.data);
            setIsLoading(false);

        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoading(false);
        }
    }

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
        fetchData();
        fetchList();
    }, [BookID])


    return (
        <>
            <NavBar />

            <div className={BooksTemplate.bodyDiv}>
                {isLoading ? (<>
                    <div>
                        <CircularProgress />
                    </div>
                </>) : (
                    <>
                        <div style={{ backgroundColor: "#fff", margin: '0% 8%', padding: '3%' }}>
                            <Row>
                                <Col md={4}>
                                    <Row>
                                        <div style={{ width: '248px', height: '350px' }}>
                                            <img
                                                src={book.coverImage}
                                                alt="BookCover"
                                                width={"100%"}
                                                height={"100%"}

                                            />
                                        </div >
                                    </Row>
                                    <Row >
                                        <div style={{ maxWidth: '248px' }}>
                                            <Button style={{ background: 'rgb(100 163 103)', marginTop: '10px', width: '100%' }} variant="contained" size="small">
                                                Buy
                                            </Button>
                                        </div>
                                    </Row>
                                </Col>

                                <Col>
                                    <Row>
                                        <h3>{book.title}</h3>
                                    </Row>
                                    <Row>
                                        <Row>
                                            <p>
                                                {book.description}
                                            </p>
                                        </Row>
                                        <Row>
                                            <p>
                                                <b>Auther</b> : {book.author} <br />
                                                <b>ISBN</b> : {book.ISBN} <br />
                                                <b>Language</b> : {book.language} <br />
                                                <b>Genre</b> : {book.genre} <br />
                                                <b>Published Date</b> : {book.publishedDate}</p>
                                        </Row>
                                    </Row>

                                </Col>
                            </Row>
                            <h3></h3>
                        </div>

                        <div style={{ backgroundColor: "#fff", margin: '0% 8%', padding: '3%' }}>
                            <Row>
                                <h5>You may be interested in</h5>
                                <hr />

                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        justifyContent: 'center', // Center items horizontally
                                        gap: 2, // Gap between cards
                                    }}
                                >
                                    {bookList.length > 0 && bookList.map((book, index) => (
                                        <BookCard book={book} key={index} />
                                    ))}
                                </Box>
                            </Row>
                            <h3></h3>
                        </div>
                    </>)}

            </div>
        </>
    );
};

export default BookView;
