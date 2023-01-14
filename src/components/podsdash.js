import React from 'react'
import { useState } from 'react'
import { Card, Grid } from 'react-bootstrap'
import Bankpod from './bankpod'

export default function Podsdash() {
    const [bankPods, setPods] = useState([])
    const [showModal, setModal] = useState(false)
    
    

    
    return (
        <div style={{ height: '93vh' , padding: '1%'}}>
            <Card
                className="bg-white text-black"
                style={{ height: '100%'}}
            >
                <Card.Body>
                    <Bankpod></Bankpod>
                </Card.Body>
            </Card>
        </div>
        
    )
}
