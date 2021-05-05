import {
  faFacebookSquare,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import AuthLayout from "../components/auth/AuthLayout";
import BottomBox from "../components/auth/BottomBox";
import Button from "../components/auth/Button";
import FormBox from "../components/auth/FormBox";
import Input from "../components/auth/Input";
import Separator from "../components/auth/Separator";
import routes from "../routes";
import PageTitle from "../components/PageTitle";
import { useForm } from "react-hook-form";
import FormError from "../components/auth/FormError";
import { gql, useMutation } from "@apollo/client";
import { logUserIn } from "../apollo";
import { useLocation } from "react-router-dom";

const FacebookLogin = styled.div`
  color: #385285;
  span {
    margin-left: 10px;
    font-weight: 600;
  }
`;

const Notification = styled.div`
  color: #2ecc71;
`;

const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      error
    }
  }
`;

function Login() {
  const location = useLocation();
  console.log(location);

  const {
    register,
    handleSubmit,
    errors,
    formState,
    getValues,
    setError,
    clearErrors,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: location?.state?.username || "",
      password: location?.state?.password || "",
    },
  });

  const onCompleted = (data) => {
    const {
      login: { ok, error, token },
    } = data;
    if (!ok) {
      return setError("result", {
        message: error,
      });
      //여기서 에러를 가지고 form을 통해 유저 로그인화면에 붉은색으로
      //백엔드에서 가져온 error를 보내줄수있음!
    }
    if (token) {
      logUserIn(token);
      //apollo.js에 저장한 함수통해서 로컬스토리지에 토큰 저장 +
      //전역변수 isLoggedInVar를 true로 바꿔줌! 그래서 이제 로그인이된화면이나옴
    }
  };
  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted,
    //로그인이 성공하면 const onCompleted의 함수를 실행한다
  });

  const onSubmitValid = (data) => {
    // 1. 로그인 버튼 누르면 여기가 제일 먼저 실행됨!!
    if (loading) {
      //유저가 로딩중인데 두번두르게 못함!!
      //즉 밑에서 login뮤테이션이 발생하면 진행되는동안 loading은 true가 될것이다
      //그때 또 누르면 loading이 true여서 submit이 중지됨..
      return;
    }
    const { username, password } = getValues();
    login({
      variables: { username, password },
    });
  };

  const clearLoginError = () => {
    clearErrors("result");
    //arg 없으면 모든 에러를 없에 줄것임!
    // 로그인 실패시 다시 시도할때 user not found 와같은 setError를 통해
    //나온 에러를 지워줌
    //setError이거 설정한뒤 clearError로 안지워주면 submit버튼 안눌러짐
  };

  const onSubmitInvalid = (data) => {
    // 서브밋 충족을 못시켰을때 여기에서 오류가 발생함
    // console.log(data, "invalid");
  };

  return (
    <AuthLayout>
      <PageTitle title="Login" />
      <FormBox>
        <div>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
        </div>
        <Notification>{location?.state?.message}</Notification>
        <form onSubmit={handleSubmit(onSubmitValid, onSubmitInvalid)}>
          <Input
            ref={register({
              required: "Username is required",
              // required가 true가 되면 메시지가 안나가고 검사만함
              minLength: {
                value: 5,
                message: "Username should be longer than 5 chars.",
              },
              //pattern : "", <-을통해 정규식 이용가능
              // validate:(currentValue)=> currentValue.includes("@")
            })}
            onChange={clearLoginError}
            name="username"
            type="text"
            placeholder="Username"
            hasError={Boolean(errors?.username?.message)}
            // hasError는 임의로 만들어준것임! 빨간 테두리 위해!
          />
          <FormError message={errors?.username?.message} />
          <Input
            ref={register({
              required: "Password is required.",
            })}
            onChange={clearLoginError}
            name="password"
            type="password"
            placeholder="Password"
            hasError={Boolean(errors?.password?.message)}
          />
          <FormError message={errors?.password?.message} />
          <Button
            type="submit"
            value={loading ? "Loading..." : "Log in"}
            disabled={!formState.isValid || loading}
          />
          <FormError message={errors?.result?.message} />{" "}
          {/*isValid 다입력되면 true이고 아니면 false  */}
        </form>
        <Separator />
        <FacebookLogin>
          <FontAwesomeIcon icon={faFacebookSquare} />
          <span>Log in with Facebook</span>
        </FacebookLogin>
      </FormBox>
      <BottomBox
        cta="Don't have an account?"
        linkText="Sign up"
        link={routes.signUp}
      />
    </AuthLayout>
  );
}
export default Login;

// const Login = () => <h1>Login</h1>;
// export default Login;
