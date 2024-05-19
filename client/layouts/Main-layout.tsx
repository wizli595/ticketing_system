import Header from '@/components/Header';
import React from 'react';
import { Container } from 'react-bootstrap';

type MainLayoutProps = {
    children: React.ReactNode;
};
const MainLayout = ({ children }:MainLayoutProps) => {
    return (<>
        <header>
            <Header />
        </header>
        <Container>
            <main className='py-3' >
                {children}
            </main>
        </Container>
    </>
       
    );
};

export default MainLayout;