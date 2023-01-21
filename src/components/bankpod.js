import React from 'react'
import { Col } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function Bankpod(props) {
  return (
    <Col xs={3} className="mx-auto pb-2" style={{ height: '100%', minWidth: '300px', maxWidth: '325px'}}>
      <Card style={{ width: '100%'}}>
      <Card.Body>
        <Card.Title>{capitalize(props.BankName)}</Card.Title>
        
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>Cras justo odio</ListGroup.Item>
      </ListGroup>
      </Card>
    </Col>
  );
}
;
