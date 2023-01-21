import * as React from 'react';
import { Navbar} from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import {Container} from 'react-bootstrap';

export default function Header() {
  return (
    <Navbar bg="dark" variant="dark" style={{height: '7vh'}}>
        <Container style={{margin: 6, width: '200pxvw'}}>
          <Navbar.Brand href="/" style={{fontSize: 'calc(20px + 0.5vw)'}}>Pods</Navbar.Brand >
          <Nav className="me-auto">
          </Nav>
        </Container>
      </Navbar>
  );
}