import MainForm from "@/components/main-form";

const SignUp = () => {


    return (<>
        <MainForm uri={'/api/users/signup'} formBase={"Up"} />
    </>);
}

export default SignUp;