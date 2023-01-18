import React from 'react'
import { useState } from 'react'
import { Card, Grid, Button, Modal, Form, Container, Row, Col} from 'react-bootstrap'
import Bankpod from './bankpod'

export default function Podsdash() {
    const [bankPods, setPods] = useState([])
    const [showModal, setModal] = useState(false)
    const [bankName, setBankName] = useState('')

    const addBankpod = (newPod) => {
      setPods([...bankPods, newPod])
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        addBankpod({name: bankName, money: 0});
        setModal(false);
    }

    
    return (
        <Container className='p-3' fluid style={{height: '100%',}}>
            <Card style={{ height: '100%',  minHeight: '87.8vh' }}>
                <div className="button-container" style={{ height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Button variant="primary" onClick={() => setModal(true)}>Add Bankpod</Button>
                </div>
                <Card.Body>
                    <Modal show={showModal} onHide={() => setModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add Bankpod</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group>
                                    <Form.Label>Bank Name</Form.Label>
                                    <Form.Control type="text" value={bankName} onChange={(event) => setBankName(event.target.value)} placeholder="Enter bank name" required/>
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Add
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                    <Row className="m-auto justify-content-center align-items-center" fluid style={{ height: '100%'}}>
                        <Col xs={12} style={{ height: '100%'}}>
                            <Row className='p-1' style={{ height: '100%'}}>
                                {bankPods.length < 1 ? <p>No BankPods found</p> : bankPods.map(() => <Bankpod/>)}
                            </Row>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>   
    )
}
