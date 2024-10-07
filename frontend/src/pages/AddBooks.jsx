import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import BooksTemplate from '../styles/BooksTemplate.module.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { storage } from "../config/FireBaseConfig.js";
import { v4 } from "uuid";
import NavBar from '../components/NavBar.jsx';


const AddBooks = () => {

    const navigate = useNavigate();

    //states for the form fields
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [publishedDate, setPublishedDate] = useState(dayjs());
    const [author, setAuthor] = useState('');
    const [ISBN, setISBN] = useState('');
    const [genre, setGenre] = useState('');
    const [language, setLanguage] = useState('');

    //states for image preview
    const [coverImage, setCoverImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

    console.log(coverImage);



    // Function to handle file selection
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setCoverImage(file);
            setImagePreviewUrl(URL.createObjectURL(file)); // Create a preview URL
        }
    };

    // Function to clear the selected image
    const handleClearImage = () => {
        setCoverImage(null);
        setImagePreviewUrl(null);
    };

    const uploadCoverImage = async () => {
        return new Promise((resolve, reject) => {
            if (coverImage == null) {
                resolve(null); // Resolve with null if no image is provided
            } else {
                const CovereImageRef = ref(
                    storage,
                    `BookCoverImage/${coverImage.name + v4()}`
                );

                uploadBytes(CovereImageRef, coverImage)
                    .then(() => {
                        getDownloadURL(CovereImageRef)
                            .then((downloadURL) => {

                                resolve(downloadURL);
                            })
                            .catch((error) => {
                                // Error getting download URL
                                reject(error);
                            });
                    })
                    .catch((error) => {
                        // Error uploading image
                        reject(error);
                    });
            }
        })
    }

    // submit handler
    const handleSubmit = async () => {

        const downUrl = await uploadCoverImage();

        if (title === '' || author === '' || genre === '' || publishedDate === '' || ISBN === '' || language === '' || description === '') {
            toast.error("Fill required fields");

        } else {

            setIsLoading(true);

            try {

                const book = {
                    title,
                    author,
                    genre,
                    publishedDate,
                    ISBN,
                    language,
                    description,
                    coverImage: downUrl,
                };

                const response = await axios.post('http://127.0.0.1:5000/create_book', book);

                console.log("Book Added successfully!", response);
                toast.success("Book Added successfully!");
                navigate('/');
            } catch (error) {
                console.error("Error:", error);
                toast.error("Error adding the book. Please try again.");
                setIsLoading(false);
            }
        }
    };



    return (
        <>
            <NavBar />
            <div className={BooksTemplate.bodyDiv}>

                <div style={{ backgroundColor: "rgb(146 66 93)", margin: '3% 8%' }}>
                    <h2 className={BooksTemplate.header} >Add New Book</h2>
                </div>

                <div style={{ backgroundColor: "#fff", margin: '0% 8%', padding: '3%' }}>

                    <Row>
                        <Col xs={6}>
                            <Row className={BooksTemplate.rows}>

                                <TextField
                                    id="outlined-basic"
                                    label="Title"
                                    placeholder="Name of your Book"
                                    variant="outlined"
                                    size='small'
                                    value={title}
                                    required
                                    onChange={(e) => setTitle(e.target.value)}
                                />

                            </Row>

                            <Row className={BooksTemplate.rows}>
                                <TextField
                                    id="outlined-multiline-flexible"
                                    label="Description"
                                    placeholder="Small description about the book"
                                    size='small'
                                    multiline
                                    fullWidth
                                    variant="outlined"
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />

                            </Row>

                            <Row className={BooksTemplate.rows}>
                                <LocalizationProvider dateAdapter={AdapterDayjs} >
                                    <DemoContainer components={['DatePicker']}>
                                        <DatePicker
                                            label="Published date"
                                            variant="outlined"
                                            value={publishedDate}
                                            onChange={(newValue) => setPublishedDate(newValue)} />
                                            
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Row>

                        </Col>

                        <Col>

                            <Row className={BooksTemplate.rows}>

                                <TextField
                                    id="outlined-basic"
                                    label="Author"
                                    placeholder="Author name"
                                    size='small'
                                    variant="outlined"
                                    value={author}
                                    fullWidth
                                    required
                                    onChange={(e) => setAuthor(e.target.value)}
                                />

                            </Row>

                            <Row className={BooksTemplate.rows}>

                                <TextField
                                    id="outlined-basic"
                                    label="ISBN"
                                    placeholder="ISBN"
                                    size='small'
                                    variant="outlined"
                                    value={ISBN}
                                    onChange={(e) => setISBN(e.target.value)}
                                />

                            </Row>

                            <Row className={BooksTemplate.rows}>

                                <FormControl fullWidth size='small'>
                                    <InputLabel id="demo-simple-select-label">Genre</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"

                                        value={genre}
                                        label="Genre"
                                        onChange={(e) => setGenre(e.target.value)}
                                    >
                                        <MenuItem value={"Fiction"}>Fiction </MenuItem>
                                        <MenuItem value={"Non-fiction"}>Non-fiction</MenuItem>
                                        <MenuItem value={"Mystery/Thriller"}>Mystery/Thriller</MenuItem>
                                        <MenuItem value={"Fantasy "}>Fantasy  </MenuItem>
                                        <MenuItem value={"Science Fiction"}>Science Fiction </MenuItem>
                                        <MenuItem value={"Romance "}>Romance  </MenuItem>
                                        <MenuItem value={"Historical Fiction"}>Historical Fiction </MenuItem>
                                        <MenuItem value={"Horror "}>Horror  </MenuItem>
                                        <MenuItem value={"Biography/Autobiography"}>Biography/Autobiography </MenuItem>
                                        <MenuItem value={"Self-Help"}>Self-Help </MenuItem>
                                    </Select>
                                </FormControl>


                            </Row>

                            <Row className={BooksTemplate.rows}>

                                <FormControl fullWidth size='small'>
                                    <InputLabel id="demo-simple-select-label">Language</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={language}
                                        label="Language"

                                        onChange={(e) => setLanguage(e.target.value)}
                                    >
                                        <MenuItem value={"English"}>English </MenuItem>
                                        <MenuItem value={"Sinhala"}>Sinhala</MenuItem>
                                        <MenuItem value={"Tamil"}>Tamil</MenuItem>
                                        <MenuItem value={"Spanish"}>Spanish</MenuItem>
                                        <MenuItem value={"Korean"}>Korean</MenuItem>

                                    </Select>
                                </FormControl>


                            </Row>

                        </Col>
                    </Row>

                    <Row >

                        <Row>
                            <h5>Upload the Book Cover</h5>
                        </Row>
                        <Row>
                            <input type="file" accept="image/*" onChange={handleImageChange} />
                            {imagePreviewUrl && (
                                <div>
                                    <h4>Cover Preview:</h4>
                                    <div
                                        style={{
                                            width: '300px',
                                            height: '300px',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <img
                                            src={imagePreviewUrl}
                                            alt="Preview"
                                            style={{
                                                width: '71%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </div>
                                    <br />
                                    <button onClick={handleClearImage}>Clear Image</button>
                                </div>
                            )}
                        </Row>
                    </Row>


                    <br />
                    <Row className={BooksTemplate.rows}>
                        <Button style={{ background: 'rgb(146 66 93)', width: '65px', margin: 'auto' }} variant="contained" size="small" onClick={handleSubmit}>
                            Add
                        </Button>
                    </Row>



                </div>
            </div>
        </>
    );
};

export default AddBooks;
