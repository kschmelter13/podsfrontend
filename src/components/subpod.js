import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Col, Button, Modal, Form, Card, ListGroup } from 'react-bootstrap';
import { supabase } from '../lib/api';



export default function Subpod({updatePodBalance, bankPod, subPod, setSubPods, subPods}) {
  const [showDeleteModal, setDeleteModal] = useState(false)
  const [showAddModal, setAddModal] = useState(false)
  const [showSubtractModal, setSubtractModal] = useState(false)
  const [addAmount, setAddAmount] = useState('')
  const [subtractAmount, setSubtractAmount] = useState('')
  const [modalError, setModalError] = useState('')
  
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
    updatePodBalance(bankPod.id, bankPod.balance + subPod.balance)
    const { data, error } = await supabase.from('SubPods').delete().eq('id', subPod.id).select();
    if (error) {
      console.error('Error deleting bankpod: ', error);
    } else {

      console.log('Successfully deleted bankpod: ', data);
      let subs = subPods;
      
      setSubPods(subPods.filter(pod1 => pod1.id !== data[0].id))
    }
    toggleDeleteModal(false)
    
  }

  const updateSubPodBalance = async (podId, newBalance) => {
    const { data, error } = await supabase
      .from('SubPods')
      .update({ balance: newBalance })
      .eq('id', podId)
      .select();
  
    if (error) {
      console.error('Error updating subpod: ', error);
      return;
    }
  
    console.log('Successfully updated subpod: ', data[0]);
  
    let newPod = data[0];
  
    setSubPods(
      subPods.map((pod1) => {
        if (pod1.id === newPod.id) return { ...newPod };
        return pod1;
      })
    );
  };

  const addMoney = async (event) =>  {
    event.preventDefault();
    const currentBalance = Number(subPod.balance);
    const newSubBalance = currentBalance + Number(addAmount);
    const newBankBalance = bankPod.balance - Number(addAmount);
    if (newBankBalance < 0) {
      setModalError(`You cannot add $${addAmount}. Bankpod will be negative.`);
      return;
    }
    updateSubPodBalance(subPod.id, newSubBalance);
    updatePodBalance(bankPod.id, newBankBalance)
    setAddModal(false);
    setAddAmount('');
  };
    
  const subtractMoney = async (event) => {
    event.preventDefault();
    const currentBalance = Number(subPod.balance);
    const newSubBalance = currentBalance - Number(subtractAmount);
    const newBankBalance = bankPod.balance + Number(subtractAmount);
    console.log(newSubBalance)
    if (newSubBalance < 0) {
      setModalError(`You cannot subtract $${subtractAmount}. Subpod will be negative.`);
      return;
    }
    updateSubPodBalance(subPod.id, newSubBalance);
    updatePodBalance(bankPod.id, newBankBalance)
    setSubtractModal(false);
    setSubtractAmount('');
  };
  

  return (
    <div>
        <ListGroup.Item>
            <div style={{ width: '100%', padding: '10px'}}>
                <div className="d-flex flex-column justify-content-between">
                <div className="d-flex justify-content-between">
                    <h5>{capitalize(subPod.podname)}</h5>
                    <Button onClick={toggleDeleteModal} variant="outline-danger" size="sm" style={{padding: '2px', height: '20px', width: '20px', textAlign: 'center', display: 'flex'}}>
                    <i className="fa fa-times" aria-hidden="true" style={{margin: 'auto', paddingTop: '.5px'}}></i>
                    </Button>
                </div>
                <div className="d-flex justify-content-between" style={{alignItems: 'center'}}>
                    <h4 style={{marginTop: '8px'}}>${subPod.balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</h4>
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
            </div>
        </ListGroup.Item>
      <Modal show={showDeleteModal} onHide={toggleDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Bankpod</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this bankpod?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleDeleteModal}>
            Close
          </Button>
          <Button variant="danger"  onClick={() => deletePod()}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showAddModal} onHide={() => { 
          setAddModal(false);
          setModalError('');
          setAddAmount('');
      }}>
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
          {modalError.length > 1 ? <div className={`border px-1 py-2 my-2 text-center text-sm`}>{modalError}</div> : null}
      </Modal>
      <Modal show={showSubtractModal} onHide={() => { 
          setSubtractModal(false);
          setModalError('');
          setSubtractAmount('');
      }}>
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
          {modalError.length > 1 ? <div className={`border px-1 py-2 my-2 text-center text-sm`}>{modalError}</div> : null}
      </Modal>
    </div>
  );
}
;