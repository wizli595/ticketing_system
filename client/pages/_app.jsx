import { buildClient } from '@/api/build-client';
import Header from '@/components/header';
import 'bootstrap/dist/css/bootstrap.css'
import { Container } from 'react-bootstrap';
const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (<>
        <header>
            <Header currentUser={currentUser} />
        </header>
        <main className='py-3'>
            <Container>
                <Component {...pageProps} />
            </Container>
        </main>
    </>);
}
AppComponent.getInitialProps = async (appContext) => {
    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/current');

    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }

    return {
        pageProps,
        ...data
    };

};

export default AppComponent;