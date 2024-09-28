import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
    const [hover, setHover] = useState(false);
console.log(book);

    return (
        <Link to={`/BookView/${book.id}`}>
            <Card
                sx={{
                    maxWidth: 150,
                    maxHeight: 250,
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                        cursor: 'pointer',
                    },
                }}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <CardMedia
                    component="img"
                    width={200}
                    height={250}
                    image={book.cover_image}
                    alt={book.title}
                    sx={{
                        transition: '0.5s',
                        filter: hover ? 'brightness(50%)' : 'none', // Dims the image when hovered
                    }}
                />

                <CardContent
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: hover ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
                        color: 'white',
                        opacity: hover ? 1 : 0,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        transition: 'opacity 0.5s',
                    }}
                >
                    <Typography gutterBottom variant="h5" component="div" align='center'>
                        {book.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white' }} align='center'>
                        {book.author}<br /><br />
                        {book.language}
                    </Typography>
                </CardContent>
            </Card>
        </Link>
    );
};

export default BookCard;
