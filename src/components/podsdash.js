import React from 'react'
import { useState } from 'react'
import { Card, Grid, Button } from 'react-bootstrap'
import Bankpod from './bankpod'

export default function Podsdash() {
    const [bankPods, setPods] = useState([])
    const [showModal, setModal] = useState(false)
    
    function addBank() {

    }
    

    
    return (
        <div style={{ height: '93vh' , padding: '1%'}}>
            <Card
                className="bg-white text-black"
                style={{ height: '100%'}}
            >
                <div className="button-container" style={{ height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Button variant="primary" onClick={addBank()}>Add BankPod</Button>
                </div>
                <Card.Body>
                    {bankPods.length < 1 ? <p>No BankPods found</p> : bankPods.map(() => <Bankpod/>)}
                </Card.Body>
            </Card>
        </div>
        
    )
}
