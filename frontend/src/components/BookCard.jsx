import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const BookCard = (book) => {


    
    return (
        <>
            <Card sx={{ maxWidth: 345 }}>

                <CardMedia
                    component="img"
                    width="142px"
                    height="200px"
                    image= {book.image}
                    alt="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {book.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {book.author}<br />
                        {book.language}
                    </Typography>
                </CardContent>

            </Card>

        </>
    );
};


export default BookCard;