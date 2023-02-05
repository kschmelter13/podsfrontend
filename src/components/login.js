import React from 'react'
import { useRef, useState, useEffect} from "react";
import { Col, Button, Row, Container, Card, Form } from 'react-bootstrap';
import { supabase } from "../lib/api";



const Login = ({handleUser, user}) => {
    const [helperText, setHelperText] = useState({ error: null, text: null });
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleLogin = async (type) => {
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;

        const { user, error } =
            type === "LOGIN"
                ? await supabase.auth.signInWithPassword({ email, password })
                : await supabase.auth.signUp({ email, password });

        if (error) {
            setHelperText({ error: true, text: error.message });
        } else if (!user && !error) {
            setHelperText({
                error: false,
                text: "An email has been sent to you for verification!",
            });
        }
    };

    const handleOAuthLogin = async (provider) => {
        // You need to enable the third party auth you want in Authentication > Settings
        // Read more on: https://supabase.com/docs/guides/auth#third-party-logins
        let { error } = await supabase.auth.signIn({ provider });
        if (error) console.log("Error: ", error.message);
    };

    const forgotPassword = async (e) => {
        // Read more on https://supabase.com/docs/reference/javascript/reset-password-email#notes
        e.preventDefault();
        const email = prompt("Please enter your email:");

        if (email === null || email === "") {
            setHelperText({ error: true, text: "You must enter your email." });
        } else {
            let { error } = await supabase.auth.api.resetPasswordForEmail(
                email
            );
            if (error) {
                console.error("Error: ", error.message);
            } else {
                setHelperText({
                    error: false,
                    text: "Password recovery email has been sent.",
                });
            }
        }
    };

    return (
        <div>
            <Container>
            <Row className="d-flex justify-content-center align-items-center" style={{ height: '100%',  minHeight: '87vh' }}>
                <Col md={8} lg={6} xs={12}>
                <Card className="px-4">
                    <Card.Body>
                    <div className="mb-3 mt-md-4">
                        <h2 className="fw-bold mb-2 text-center text-uppercase ">
                        Pods
                        </h2>
                        <div className="mb-3">
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label className="text-center">
                                Email address
                            </Form.Label>
                            <Form.Control type="email" placeholder="Enter email" name={"email"}
                ref={emailRef}
                required />
                            </Form.Group>
    
                            <Form.Group
                            className="mb-3"
                            controlId="formBasicPassword"
                            >
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" name={"password"}
                ref={passwordRef}
                required />
                            </Form.Group>
                            <Form.Group
                            className="mb-3"
                            controlId="formBasicCheckbox"
                            ></Form.Group>
                            <div className="d-grid">
                            <div className="button-container" style={{ height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <Button variant="primary" style={{ marginRight: '20px' }} type="button" onClick={() =>handleLogin("REGISTER").catch(console.error)}>Create Account</Button>
                                or
                                <Button variant="primary" style={{ marginLeft: '20px' }} type="button" onClick={() =>handleLogin("LOGIN").catch(console.error)}>Login Account</Button>
                            </div>
                            </div>
                        </Form>
                            {helperText.text ? <div className={`border px-1 py-2 my-2 text-center text-sm ${ helperText.error ? "bg-red-100 border-red-300 text-red-400" : "bg-green-100 border-green-300 text-green-500"}`}>{helperText.text}</div> : null}
                        </div>
                    </div>
                    </Card.Body>
                </Card>
                </Col>
            </Row>
            </Container>
        </div>

    );
};

export default Login;