import { buildClient } from "@/api/build-client";
import style from '@/assets/index.module.css';


const LandingPage = ({ currentUser }) => {
    return (
        <div className={style.landing}>
            {currentUser ? (
                <h1>You are signed in</h1>
            ) : (
                <h1>You are NOT signed in</h1>
            )}
        </div>
    );
}

LandingPage.getInitialProps = async (context) => {

    const client = buildClient(context);
    const { data } = await client.get('/api/users/current');

    return data;

};
export default LandingPage;