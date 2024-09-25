import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddBooks = () => {

    const navigate = useNavigate();
    
    // Define state for the form fields
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [type, setType] = useState('');
    const [publishedYear, setPublishedYear] = useState('');


    // submit handler
    const handleSubmit = async () => {

        if (title === '' || author === '' || type === '' || publishedYear === '') {
            toast.error("Fill required fields");

        } else {

            setIsLoading(true);

            try {

                const book = {
                    title,
                    author,
                    type,
                    publishedYear,
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
        <div>
            <h2>Add a New Book</h2>

            
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div>
                    <label>Author:</label>
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    />
                </div>

                <div>
                    <label>Type</label>
                    <input
                        type="text"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    
                    />
                </div>

                <div>
                    <label>PublishedYear:</label>
                    <textarea
                        value={publishedYear}
                        onChange={(e) => setPublishedYear(e.target.value)}
                    ></textarea>
                </div>

                <button onClick={()=> handleSubmit()}>Add Book</button>
            
        </div>
    );
};

export default AddBooks;
