import React, { useState } from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import UserLoginPageStyle from '../styles/UserLoginPageStyle.module.css'
import EmptyMenuBar from '../components/EmptyMenuBar';
import axios from 'axios';
import Button from '@mui/material/Button';
import toast from 'react-hot-toast';

const UserLoginPage = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState("")
    const navigate = useNavigate();

    const submitHandler = () => {

        const loginDto = {
            email,
            password
        };
        console.log(loginDto);
        axios.post('http://127.0.0.1:5000/login_user', loginDto)
            .then(response => {
                console.log("Form submitted successfully!" + response);
                console.log(response);
                const userData = JSON.stringify(response.data);
                localStorage.setItem("UserInfo", userData);

                navigate("/");
            })
            .catch(error => {
                console.error("Error:", error.response.data);
                if (error.response.data == "Password Incorrect") {
                    toast.error("Password Incorrect", {
                        style: {
                            background: "green",
                        }
                    })
                }
                else if (error.response.data == "User not found") {
                    toast.error("You haven't sign up")
                }
            });
    }


    return (
        <div className={UserLoginPageStyle.bodyDiv}>
            <EmptyMenuBar />
            <Container>
                <Row className={UserLoginPageStyle.rowDiv}>
                    <Col className={UserLoginPageStyle.leftDiv}>
                    </Col>
                    <Col className={UserLoginPageStyle.rightDiv}>
                        <center><h2 style={{ margin: "4% 0" }}>SIGN IN</h2></center>

                        <Row>
                            <Col>

                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </Form.Group>
                            </Col>
                        </Row>


                        <Row>
                            <Col>

                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="email" placeholder="john@123" value={password}
                                        onChange={(e) => setPassword(e.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        {password == '' ? (<><Button variant="contained" fullWidth style={{ marginTop: '2%' }} onClick={submitHandler} disabled>Sign In</Button></>) : (<><Button variant="contained" fullWidth style={{ marginTop: '2%' }} onClick={submitHandler}>Sign Up</Button></>)}
                        <Row>
                            <Col>
                                <p style={{ marginTop: '2%' }}>I haven't an account <a href='/register' style={{ textDecoration: 'none', fontWeight: 'bold' }}>Sign Up</a></p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default UserLoginPage
