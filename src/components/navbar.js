import * as React from 'react';
import { Navbar} from 'react-bootstrap';
import {Container} from 'react-bootstrap';

export default function Header() {
  return (
    <Navbar fixed="top" bg="dark" variant="dark" style={{height: '8vh'}}>
      <Container style={{margin: 6, width: '200pxvw'}}>
        <Navbar.Brand href="/" style={{fontSize: 'calc(20px + 0.5vw)'}}>Pods</Navbar.Brand >
      </Container>
    </Navbar>
  );
}