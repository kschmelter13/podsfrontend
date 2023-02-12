import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Col, Button, Modal, Form } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';


export default function Bankpod({props, deletePod}) {
  const [showDeleteModal, setDeleteModal] = useState(false)
  const [showAddModal, setAddModal] = useState(false)
  const [showSubtractModal, setSubtractModal] = useState(false)
  const [addAmount, setAddAmount] = useState(0)
  const [subtractAmount, setSubtractAmount] = useState(0)
  
  function toggleDeleteModal() {
    setDeleteModal(!showDeleteModal);
  }

  function toggleAddModal() {
    setAddModal(!showAddModal);
  }
  
  function toggleSubtractModal() {
    setSubtractModal(!showSubtractModal);
  }
  
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }  
  
  const deleteBankPod = async (x) => {
    await deletePod(x);
    setDeleteModal(false);
  }

  return (
    <Col xs={3} className="mx-auto pb-4" style={{ height: '100%', minWidth: '350px', maxWidth: '400px'}}>
      <Card style={{ width: '100%'}}>
      <Card.Body>
        <div className="d-flex flex-column justify-content-between">
          <div className="d-flex justify-content-between">
            <Card.Title>{capitalize(props.bankName)}</Card.Title>
            <Button onClick={toggleDeleteModal} variant="outline-danger" size="sm" style={{padding: '2px', height: '20px', width: '20px', textAlign: 'center', display: 'flex'}}>
              <i className="fa fa-times" aria-hidden="true" style={{margin: 'auto', paddingTop: '.5px'}}></i>
            </Button>
          </div>
          <div className="d-flex justify-content-between" style={{alignItems: 'center'}}>
            <h4 style={{marginTop: '8px'}}>${props.balance}</h4>
            <div style={{display: 'flex', justifyContent: 'flex-end', marginLeft: 'auto'}}>
              <Button variant="secondary" style={{padding: '3px', height: '30px', width: '50px', marginRight: '10px'}} onClick={toggleAddModal}>
                <i className="fa fa-plus" aria-hidden="true"></i>
              </Button>
              <Button variant="secondary" style={{padding: '3px', height: '30px', width: '50px'}} onClick={toggleSubtractModal}>
                <i className="fa fa-minus" aria-hidden="true" ></i>
              </Button>
            </div>
          </div>
        </div>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>Cras justo odio</ListGroup.Item>
      </ListGroup>
      </Card>
      <Modal show={showDeleteModal} onHide={toggleDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Bankpod</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this bankpod?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleDeleteModal}>
            Close
          </Button>
          <Button variant="danger"  onClick={() => deleteBankPod(props.id)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showAddModal} onHide={() => setAddModal(false)}>
          <Modal.Header closeButton>
              <Modal.Title>Add Money</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Form onSubmit={''}>
                  <Form.Group>
                      <Form.Label>Amount:</Form.Label>
                      <Form.Control type="text" value={addAmount} onChange={(event) => setAddAmount(event.target.value)} placeholder="Enter dollar amount" required/>
                  </Form.Group>
                  <div style={{marginTop: '15px'}}>
                      <Button variant="primary" type="submit" >
                          Add
                      </Button>
                  </div>
              </Form>
          </Modal.Body>
      </Modal>
      <Modal show={showSubtractModal} onHide={() => setSubtractModal(false)}>
          <Modal.Header closeButton>
              <Modal.Title>Subtract Money</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Form onSubmit={''}>
                  <Form.Group>
                      <Form.Label>Amount:</Form.Label>
                      <Form.Control type="text" value={subtractAmount} onChange={(event) => setSubtractAmount(event.target.value)} placeholder="Enter dollar amount" required/>
                  </Form.Group>
                  <div style={{marginTop: '15px'}}>
                      <Button variant="primary" type="submit" >
                          Add
                      </Button>
                  </div>
              </Form>
          </Modal.Body>
      </Modal>
    </Col>
  );
}
;