import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Card, Button, Modal, Form, Container, Row, Col, Spinner} from 'react-bootstrap'
import Bankpod from './bankpod'
import RecoverPassword from "./recovery";
import { supabase } from '../lib/api'

export default function Podsdash({user}) {
    const [bankPods, setPods] = useState([])
    const [showModal, setModal] = useState(false)
    const [bankName, setBankName] = useState('')
    const [recoveryToken, setRecoveryToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        /* Recovery url is of the form
         * <SITE_URL>#access_token=x&refresh_token=y&expires_in=z&token_type=bearer&type=recovery
         * Read more on https://supabase.com/docs/reference/javascript/reset-password-email#notes
         */
        let url = window.location.hash;
        let query = url.slice(1);
        let result = {};

        query.split("&").forEach((part) => {
            const item = part.split("=");
            result[item[0]] = decodeURIComponent(item[1]);
        });

        if (result.type === "recovery") {
            setRecoveryToken(result.access_token);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch the bankpods and subpods data
            const { data, error } = await supabase
            .from('BankPods')
            .select()
            .eq('user_id', user.id)
            .order('created_at', { ascending: true })
            setPods(data);
            if (bankPods.length == 0){
                setLoading(false)
            }
        };
        
        fetchData();
    }, [user]);

    const handleLogout = async () => {
        supabase.auth.signOut().catch(console.error);
    };

    const addBankpod = async (event) => {
        event.preventDefault();
        const { data, error } = await supabase
        .from('BankPods')
        .insert({ user_id: user.id, bankName: bankName })
        .select();

        if (error) {
        console.error('Error inserting bankpod: ', error);
        } else {
        console.log('Successfully inserted bankpod: ', data);
        setPods([...bankPods, data[0]])
        }

        setBankName(''); 
        setModal(false);
    }

    

    
    return recoveryToken ? (
        <RecoverPassword
            token={recoveryToken}
            setRecoveryToken={setRecoveryToken}
        />
    ) : (
        <Container className='p-3' fluid style={{height: '100%',}}>
            <Card style={{ height: '100%',  minHeight: 'calc(96vh - 61px)' }}>
                <div className="button-container" style={{ height: '50px', marginTop: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Button variant="primary" onClick={() => setModal(true)}>Add Bankpod</Button>
                    <Button variant="primary" style={{marginLeft: '30px'}} onClick={handleLogout}>Log Out</Button>
                </div>
        
                <Card.Body className="mx-auto justify-content-center align-items-center"f>
                    <Row  className="m-auto justify-content-center align-items-center " fluid style={{ height: '100%'}}>
                        <Col xs={12} style={{ height: '100%'}}>
                            <Row style={{height: '100%'}}>
                                
                            {loading ? <Spinner animation="border" /> 
                            : ( bankPods.length > 0 ? bankPods.map((bankPod) => <Bankpod setLoading={setLoading} bankPod={bankPod} pods={bankPods} setPods={setPods}/>):
                                <div>No Bankpods Found</div> 
                            )}
                            </Row>
                        </Col>
                    </Row>
                    <Modal show={showModal} onHide={() => setModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add Bankpod</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={addBankpod}>
                                <Form.Group>
                                    <Form.Label>Bank Name</Form.Label>
                                    <Form.Control type="text" value={bankName} onChange={(event) => setBankName(event.target.value)} placeholder="Enter bank name" required/>
                                </Form.Group>
                                <div style={{marginTop: '15px'}}>
                                    <Button variant="primary" type="submit" >
                                        Add
                                    </Button>
                                </div>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </Card.Body>
            </Card>
        </Container> 
    )
}
