import { FC } from "react";
import 'bootstrap/dist/css/bootstrap.css'

interface AppProps {
    Component: FC;
    pageProps: Record<string, any>;
}
const AppComponent: FC<AppProps> = ({ Component, pageProps }) => {
    return (<Component {...pageProps} />)
}

export default AppComponent;