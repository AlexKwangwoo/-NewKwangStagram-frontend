import {
  faInstagram,
  faFacebookSquare,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import AuthLayout from "../components/auth/AuthLayout";
import BottomBox from "../components/auth/BottomBox";
import Button from "../components/auth/Button";
import FormBox from "../components/auth/FormBox";
import Input from "../components/auth/Input";
import { FatLink } from "../components/shared";
import routes from "../routes";
import PageTitle from "../components/PageTitle";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import letter from "../asset/letterB.png";
import apple from "../asset/appleLogo.png";
import google from "../asset/googleLogo.png";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Subtitle = styled(FatLink)`
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
`;

const SignUpBox = styled.div`
  width: 350px;
`;

const LetterImg = styled.img`
  max-width: 100%;
  margin: 20px 0;
`;

const FacebookBtn = styled.div`
  cursor: pointer;
  border: none;
  border-radius: 3px;
  margin-top: 20px;
  background-color: ${(props) => props.theme.accent};
  color: white;
  text-align: center;
  padding: 8px 0px;
  font-weight: 600;
  width: 100%;
  opacity: ${(props) => (props.disabled ? "0.2" : "1")};
  display: flex;
  justify-content: center;
`;

const Facebook = styled.div`
  margin-left: 5px;
`;

const UnderSentence = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  font-size: 12px;
  color: #929393;
`;
const First = styled.div`
  margin-bottom: 7px;
`;
const Second = styled.div``;

const LogoBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Apple = styled.img`
  width: 20%;
  margin-right: 5px;
`;

const Google = styled.img`
  width: 20%;
  margin-left: 5px;
`;

const Get = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0px;
`;

const Info = styled.div`
  width: 70%;
  margin-top: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const FirstInfo = styled.div`
  color: #b5adad;
  font-size: 12px;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const SecondInfo = styled.div`
  margin-top: 20px;
  font-size: 12px;
  color: #b5adad;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InfoDetail = styled.div`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $firstName: String!
    $lastName: String
    $username: String!
    $email: String!
    $password: String!
  ) {
    createAccount(
      firstName: $firstName
      lastName: $lastName
      username: $username
      email: $email
      password: $password
    ) {
      ok
      error
    }
  }
`;

function SignUp() {
  const history = useHistory();
  const onCompleted = (data) => {
    const { username, password } = getValues();
    const {
      createAccount: { ok, error },
    } = data;
    if (!ok) {
      return;
    }
    //에러 만들어줘야함!!!!!!!!!!!!!!!!!!!!!
    //에러 만들어줘야함!!!!!!!!!!!!!!!!!!!!!
    //에러 만들어줘야함!!!!!!!!!!!!!!!!!!!!!
    history.push(routes.home, {
      message: "Account created. Please log in.",
      username,
      password,
    });
  };
  const [createAccount, { loading }] = useMutation(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  });
  const { register, handleSubmit, errors, formState, getValues } = useForm({
    mode: "onChange",
  });
  const onSubmitValid = (data) => {
    if (loading) {
      return;
    }
    createAccount({
      variables: {
        ...data,
      },
    });
  };

  return (
    <AuthLayout>
      <SignUpBox>
        <PageTitle title="Sign up" />

        <FormBox>
          <HeaderContainer>
            <LetterImg src={letter} />
            <Subtitle>Sign up to see photos and videos</Subtitle>
            <Subtitle>from your friends.</Subtitle>
            <FacebookBtn type="submit" disabled={false}>
              <FontAwesomeIcon icon={faFacebookSquare} />
              <Facebook>Log in with FaceBook</Facebook>
            </FacebookBtn>
          </HeaderContainer>
          <form onSubmit={handleSubmit(onSubmitValid)}>
            <Input
              ref={register({
                required: "First Name is required.",
              })}
              name="firstName"
              type="text"
              placeholder="First Name"
            />
            <Input
              ref={register}
              type="text"
              placeholder="Last Name"
              name="lastName"
            />
            <Input
              ref={register({
                required: "Email is required.",
              })}
              name="email"
              type="text"
              placeholder="Email"
            />
            <Input
              ref={register({
                required: "Username is required.",
              })}
              name="username"
              type="text"
              placeholder="Username"
            />
            <Input
              ref={register({
                required: "Password is required.",
              })}
              name="password"
              type="password"
              placeholder="Password"
            />
            <Button
              type="submit"
              value={loading ? "Loading..." : "Sign up"}
              disabled={!formState.isValid || loading}
            />
          </form>
          <UnderSentence>
            <First>By signing up, you agree to our Terms, Data</First>
            <Second>Policy and Cookies Policy.</Second>
          </UnderSentence>
        </FormBox>
        <BottomBox
          cta="Have an account?"
          linkText="Log in"
          link={routes.home}
        />
      </SignUpBox>

      <Get>Get the app.</Get>
      <LogoBox>
        <Apple src={apple} />
        <Google src={google} />
      </LogoBox>

      <Info>
        <FirstInfo>
          <InfoDetail>About</InfoDetail>
          <InfoDetail>Blog</InfoDetail>
          <InfoDetail>Jobs</InfoDetail>
          <InfoDetail>Help</InfoDetail>
          <InfoDetail>API</InfoDetail>
          <InfoDetail>Privacy</InfoDetail>
          <InfoDetail>Terms</InfoDetail>
          <InfoDetail>Top Accounts</InfoDetail>
          <InfoDetail>Hashtags</InfoDetail>
          <InfoDetail>Locations</InfoDetail>
        </FirstInfo>
        <SecondInfo>
          <div>English © 2021 Kwangstagram from KwangCompany</div>
        </SecondInfo>
      </Info>
    </AuthLayout>
  );
}
export default SignUp;
