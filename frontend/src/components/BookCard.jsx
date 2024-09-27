import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Row, Col } from 'react-bootstrap'
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BookCard = (books) => {

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);

    // const fetchData = async () => {
    //     setIsLoading(true);
    //     try {
    //         const response = await axios.get(`http://127.0.0.1:5000/books/${books.userId}`);
    //         setData(response.data._embedded.workoutPlanList);
    //         console.log(response.data._embedded.workoutPlanList);
    //         setIsLoading(false);

    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //         setIsLoading(false);
    //     }
    // }

    useEffect(() => {
        fetchData();
    }, [])


    return (
        <>
            {isLoading ? (<>
                <div style={{ margin: '20% 0% 0% 50%' }}>

                    <CircularProgress />

                </div>

            </>) : (
                <>
                    <Card sx={{ maxWidth: 345 }}>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                height="140"
                                image="/static/images/cards/contemplative-reptile.jpg"
                                alt="green iguana"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Lizard
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    <Row>

                                    </Row>
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </>)}

        </>
    );

};


export default BookCard;