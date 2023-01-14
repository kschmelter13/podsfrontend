import * as React from 'react';
import { Navbar} from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import {Container} from 'react-bootstrap';

export default function Navigation() {
  return (
    <Navbar bg="dark" variant="dark" style={{height: '7vh'}}>
        <Container style={{margin: 6, width: '200pxvw'}}>
          <Navbar.Brand href="/" style={{fontSize: '1.7vw'}}>Pods</Navbar.Brand >
          <Nav className="me-auto">
          </Nav>
        </Container>
      </Navbar>
  );
}