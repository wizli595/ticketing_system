import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'next/link';

const Header = ({ currentUser }) => {

    return (<>
        <Navbar expand='md' collapseOnSelect>
            <Container>
                <Navbar.Brand as={Link} href='/'>
                    GitTix
                </Navbar.Brand>
                <Navbar.Toggle aria-controls='basic-nav' />
                <Navbar.Collapse id='basic-nav'>
                    <Nav className='ms-auto'>
                        {currentUser ?
                            <>
                                <Nav.Link as={Link} href='/auth/signout'>Sign Out</Nav.Link>
                            </>
                            : <>
                                <Nav.Link as={Link} href='/auth/signup'>Sign Up</Nav.Link>
                                <Nav.Link as={Link} href='/auth/signin'>Sign In</Nav.Link>
                            </>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>

    </>);
}

export default Header;