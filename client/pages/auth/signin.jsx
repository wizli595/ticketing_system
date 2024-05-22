import MainForm from "@/components/main-form";

const SignIn = () => {

    return (<>
        <MainForm uri={'/api/users/signin'} formBase={"In"} />
    </>);
}

export default SignIn;