import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Card, Button, Modal, Form, Container, Row, Col} from 'react-bootstrap'
import Bankpod from './bankpod'
import RecoverPassword from "./recovery";
import { supabase } from '../lib/api'

export default function Podsdash({user}) {
    const [bankPods, setPods] = useState([])
    const [loading, setLoading] = useState(true);
    const [showModal, setModal] = useState(false)
    const [bankName, setBankName] = useState('')
    const [recoveryToken, setRecoveryToken] = useState(null);

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
        if (!loading){
            setLoading(true)
          }
        const fetchData = async () => {
            // Fetch the bankpods and subpods data
            const { data, error } = await supabase
            .from('BankPods')
            .select()
            .eq('user_id', user.id)

            let ndata = data
            
            setPods(data);
        };
        fetchData();
        setLoading(false)
    }, []);

    const addBankpod = (newPod) => {
      setPods([...bankPods, newPod])
    }

    const handleLogout = async () => {
        supabase.auth.signOut().catch(console.error);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { data, error } = await supabase
        .from('BankPods')
        .insert({ user_id: user.id, bankName: bankName })
        .select();

        if (error) {
        console.error('Error inserting bankpod: ', error);
        } else {
        console.log('Successfully inserted bankpod: ', data);
        addBankpod(data[0])
        }

        setBankName(''); 
        setModal(false);
    }

    const deletePod = async (podId) => {
        const { data, error } = await supabase.from('BankPods').delete().eq('id', podId);
        if (error) {
          console.error('Error deleting bankpod: ', error);
        } else {
          console.log('Successfully deleted bankpod: ', data);
          setPods(bankPods.filter(pod => pod.id !== podId))
        }
    }

    
    return recoveryToken ? (
        <RecoverPassword
            token={recoveryToken}
            setRecoveryToken={setRecoveryToken}
        />
    ) : (
        <div>
            {loading 
            ? <h1>Loading...</h1>
            : <Container className='p-3' fluid style={{height: '100%',}}>
                <Card style={{ height: '100%',  minHeight: 'calc(96vh - 61px)' }}>
                    <div className="button-container" style={{ height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Button variant="primary" onClick={() => setModal(true)}>Add Bankpod</Button>
                        <Button variant="primary" onClick={handleLogout}>Log Out</Button>
                    </div>
            
                    <Card.Body className="mx-auto justify-content-center align-items-center"f>
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
                                    <div style={{marginTop: '15px'}}>
                                        <Button variant="primary" type="submit" >
                                            Add
                                        </Button>
                                    </div>
                                </Form>
                            </Modal.Body>
                        </Modal>
                        <Row  className="m-auto justify-content-center align-items-center " fluid style={{ height: '100%'}}>
                            <Col xs={12} style={{ height: '100%'}}>
                                <Row style={{height: '100%'}}>
                                    {bankPods.length < 1 ? <p>No BankPods found</p> : bankPods.map((pod) => <Bankpod props={pod} deletePod={deletePod}/>)}
                                </Row>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        }
        </div>   
    )
}
