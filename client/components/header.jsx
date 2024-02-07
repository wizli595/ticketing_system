import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'next/link';
import styles from '@/assets/index.module.css';

const Header = ({ currentUser }) => {

    return (<>
        <Navbar expand='md' collapseOnSelect className={styles.header}>
            <Container>
                <Navbar.Brand as={Link} href='/' className={styles.link}>
                    GitTix
                </Navbar.Brand>
                <Navbar.Toggle aria-controls='basic-nav' />
                <Navbar.Collapse id='basic-nav'>
                    <Nav className='ms-auto'>
                        {currentUser ?
                            <>
                                <Nav.Link as={Link} href='/auth/signout' className={styles.link}>Sign Out</Nav.Link>
                            </>
                            : <>
                                <Nav.Link as={Link} href='/auth/signup' className={styles.link}>Sign Up</Nav.Link>
                                <Nav.Link as={Link} href='/auth/signin' className={styles.link}>Sign In</Nav.Link>
                            </>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>

    </>);
}

export default Header;