import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Col, Button, Modal, Form, Card, ListGroup } from 'react-bootstrap';
import { supabase } from '../lib/api';
import Subpod from './subpod'


export default function Bankpod({setLoading, bankPod, setPods, pods}) {
  const [showDeleteModal, setDeleteModal] = useState(false)
  const [showAddModal, setAddModal] = useState(false)
  const [showSubtractModal, setSubtractModal] = useState(false)
  const [showSubModal, setSubModal] = useState(false)
  const [addAmount, setAddAmount] = useState('')
  const [subtractAmount, setSubtractAmount] = useState('')
  const [subPods, setSubPods] = useState([])
  const [subName, setSubName] = useState('')

  useEffect(() => {
    const fetchData = async () => {
        // Fetch the bankpods and subpods data
        const { data, error } = await supabase
        .from('SubPods')
        .select()
        .eq('bankpod_id', bankPod.id)
        .order('created_at', { ascending: true })
        setSubPods(data);
    };
    fetchData();
  }, []);

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

  const deletePod = async () => {
    setLoading(true)
    // Delete all SubPods that reference this BankPod
    const { error: subPodError } = await supabase
      .from('SubPods')
      .delete()
      .eq('bankpod_id', bankPod.id)
      .select()
  
    if (subPodError) {
      console.error('Error deleting SubPods: ', subPodError);
      return;

    }
    setSubPods([])
  
    // Delete the BankPod itself
    const { data, error: bankPodError } = await supabase
      .from('BankPods')
      .delete()
      .eq('id', bankPod.id)
      .select();
  
    if (bankPodError) {
      console.error('Error deleting BankPod: ', bankPodError);
      return;
    }
  
    console.log('Successfully deleted BankPod: ', data);
    setPods(pods.filter((pod1) => pod1.id !== bankPod.id));
    setLoading(false)
    toggleDeleteModal()
  };

  const updatePodBalance = async (podId, newBalance) => {
    const { data, error } = await supabase.from('BankPods').update({ balance: newBalance }).eq('id', podId).select();
    if (error) {
      console.error('Error updating bankpod: ', error);
      return
    } else {
      console.log('Successfully updated bankpod: ', data[0]);

      let newPod = data[0]

      setPods(pods.map(pod1 => {
        if (pod1.id === podId) return { ...pod1, balance: newBalance };
        return pod1;
      }))
    }
  }

  const addMoney = async (event) =>  {
    event.preventDefault()
    const currentBalance = Number(bankPod.balance)
    const newBalance = currentBalance + Number(addAmount)
    updatePodBalance(bankPod.id, newBalance)
    setAddModal(false);
    setAddAmount('')
  }
    
  const subtractMoney = async (event) =>  {
    event.preventDefault()
    const currentBalance = Number(bankPod.balance)
    const newBalance = currentBalance - Number(subtractAmount)
    updatePodBalance(bankPod.id, newBalance)
    setSubtractModal(false);
    setSubtractAmount('')
  }

  const addSubpod = async (event) => {
    event.preventDefault();
    const { data, error } = await supabase.from('SubPods').insert([{ podname: subName, balance: 0, bankpod_id: bankPod.id }]).select();
    if (error) {
      console.error('Error adding subpod: ', error);
    } else {
      console.log('Successfully added subpod: ', data);
      setSubPods([...subPods, data[0]]);
    }
    setSubModal(false);
    setSubName('');
  }

  

  return (
    <Col xs={3} className="mx-auto pb-4" style={{ height: '100%', minWidth: '350px', maxWidth: '400px'}}>
      <Card style={{ width: '100%'}}>
      <Card.Body>
        <div className="d-flex flex-column justify-content-between">
          <div className="d-flex justify-content-between">
            <Card.Title>{capitalize(bankPod.bankName)}</Card.Title>
            <Button onClick={toggleDeleteModal} variant="outline-danger" size="sm" style={{padding: '2px', height: '20px', width: '20px', textAlign: 'center', display: 'flex'}}>
              <i className="fa fa-times" aria-hidden="true" style={{margin: 'auto', paddingTop: '.5px'}}></i>
            </Button>
          </div>
          <div className="d-flex justify-content-between" style={{alignItems: 'center'}}>
            <h4 style={{marginTop: '8px'}}>${bankPod.balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</h4>
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
          {subPods.map((subPod) => <Subpod updatePodBalance={updatePodBalance} bankPod={bankPod} subPod={subPod} subPods={subPods} setSubPods={setSubPods}/>)}
        </ListGroup>
      <ListGroup className="list-group-flush">
        <Button variant="primary" onClick={() => setSubModal(true)}>Add Subpod</Button>
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
          <Button variant="danger"  onClick={() => deletePod(bankPod.id)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showAddModal} onHide={() => setAddModal(false)}>
          <Modal.Header closeButton>
              <Modal.Title>Add Money</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Form onSubmit={addMoney}>
                  <Form.Group>
                      <Form.Label>Amount:</Form.Label>
                      <Form.Control pattern="^[0-9]*(\.[0-9]{0,2})?$" type="text" value={addAmount} onChange={(event) => setAddAmount(event.target.value)} placeholder="Enter dollar amount" required/>
                  </Form.Group>
                  <div style={{marginTop: '15px'}}>
                      <Button variant="primary" type="submit">
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
              <Form onSubmit={subtractMoney}>
                  <Form.Group>
                      <Form.Label>Amount:</Form.Label>
                      <Form.Control pattern="^[0-9]*(\.[0-9]{0,2})?$" type="text" value={subtractAmount} onChange={(event) => setSubtractAmount(event.target.value)} placeholder="Enter dollar amount" required/>
                  </Form.Group>
                  <div style={{marginTop: '15px'}}>
                      <Button variant="primary" type="submit">
                          Subtract
                      </Button>
                  </div>
              </Form>
          </Modal.Body>
      </Modal>
      <Modal show={showSubModal} onHide={() => setSubModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Add Subpod</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={addSubpod}>
                <Form.Group>
                    <Form.Label>Subpod Name</Form.Label>
                    <Form.Control type="text" value={subName} onChange={(event) => setSubName(event.target.value)} placeholder="Enter bank name" required/>
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