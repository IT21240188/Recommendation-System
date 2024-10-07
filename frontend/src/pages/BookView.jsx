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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const BookView = () => {

    const navigate = useNavigate();
    const userInfoString = localStorage.getItem('UserInfo');
    const storedUserInfo = JSON.parse(userInfoString);

    const userId = storedUserInfo.user._id;

    const bookId = useParams('id');
    console.log(bookId);

    //states for the form fields
    const [isLoading, setIsLoading] = useState(false);
    const [book, setBook] = useState('');
    const [bookList, setBookList] = useState('');

    //states for the rate dialog box
    const [open, setOpen] = React.useState(false);

    //ratings
    const [value, setValue] = React.useState();



    //rating Dialog
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    }

    const RatingsSubmitHandler = async () => {

        if (value === '') {
            toast.error("Fill required fields");

        } else {

            setIsLoading(true);

            try {

                const rating = {
                    userId,
                    bookId: bookId.id,
                    rating: value,
                    hasRead: "true",
                };

                const response = await axios.post('http://127.0.0.1:5000/create_interaction', rating);

                console.log("Rating Added successfully!", response);
                toast.success("Book Added to the cart Succesffully!");
                navigate('/');

            } catch (error) {
                console.error("Error:", error);
                toast.error("Error adding the ratings. Please try again.");
                setIsLoading(false);
            }
        }
    };


    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://127.0.0.1:5000/books/${bookId.id}`);
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
            const response = await axios.get(`http://127.0.0.1:5000/recommend/itemcontent/${bookId.id}`);
            console.log(response.data);
            
            setBookList(response.data);
            setIsLoading(false);

        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchData();
        fetchList();
    }, [bookId])


    return (
        <>
            <NavBar />

            <div className={BooksTemplate.bodyDiv}>
                {isLoading ? (<>
                    <div style={{ margin: '20% 0% 0% 50%' }}>
                        <CircularProgress />
                    </div>
                </>) : (
                    <>
                        <div style={{
                            backgroundColor: "rgb(255, 255, 255)",
                            margin: '0% 8%',
                            padding: '3%',
                            boxShadow: '0px 0px 10px #d8d8d8',
                            borderRadius: '10px'
                        }}>
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


                                            <React.Fragment>
                                                <Button
                                                    style={{ background: 'rgb(100 163 103)', marginTop: '10px', width: '100%' }}
                                                    variant="contained"
                                                    size="small"
                                                    onClick={handleClickOpen}>
                                                    Buy
                                                </Button>
                                                <Dialog
                                                    open={open}
                                                    TransitionComponent={Transition}
                                                    keepMounted
                                                    onClose={handleClose}
                                                    aria-describedby="alert-dialog-slide-description"
                                                >
                                                    <DialogTitle>{"Rate the Book Before Buying!"}</DialogTitle>
                                                    <DialogContent>
                                                        <DialogContentText id="alert-dialog-slide-description">
                                                            We’d love to hear your thoughts!
                                                            Please rate the following books on a scale of 1 to 5 stars
                                                            (1 being the lowest and 5 being the highest).
                                                            <br /><br />

                                                            <Box sx={{ '& > legend': { mt: 2 } }}>
                                                                <Rating
                                                                    name="simple-controlled"
                                                                    value={value}
                                                                    onChange={(event, newValue) => {
                                                                        setValue(newValue);
                                                                    }}
                                                                />

                                                            </Box>

                                                        </DialogContentText>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={handleClose}>Don't Buy</Button>
                                                        <Button onClick={RatingsSubmitHandler}>Buy</Button>
                                                    </DialogActions>
                                                </Dialog>
                                            </React.Fragment>

                                            <Row>
                                                <p style={{textAlign:'center'}}>
                                                    (LKR <b>{book.price}</b> /=)
                                                </p>
                                            </Row>

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
                            <br /><br />

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
                        </div>

                    </>)}

            </div>
        </>
    );
};

export default BookView;
