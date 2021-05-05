1. npx create-react-app NewKwangStagram_front

2. 아래 다 다운로드
   npm install react-hook-form@6.15.1 reactform ref부분이 오류나서.. 6.15.1버전으로 사용함!!
   npm i styled-components react-hook-form react-router-dom @apollo/client graphql react-helmet-async
   npm i --save @fortawesome/fontawesome-svg-core
   npm install --save @fortawesome/free-solid-svg-icons
   npm install --save @fortawesome/react-fontawesome
   npm install --save @fortawesome/free-brands-svg-icons
   npm install --save @fortawesome/free-regular-svg-icons

3. hashRouter와 browserRouter의 차이는?
   hashRouter는 기본적으로 #을 가지고 있다
   browserRouter는 deploy할때 조금 어려움

4. function Login() {
   return <h1>Login</h1>;
   }
   export default Login;

const Login = () => <h1>Login</h1>;
export default Login; <-위에랑 이거는 똑같은 형식임

5.  로컬스토리지 사용위해 apollo client를 사용해 로컬state를 만들것임.. 전역 변수를 만들것임!
    useReactiveVar 를 통해 App.js에 선언해주고 전역에서 다 사용가능

6.  다크모드 사용위해 styled component를 사용.. 왜냐하면 재네들 다 컴포넌트기에 props를 받을수있음!!
    ex)const Title = styled.h1'

    1. color: ${(props) => (props.potato ? "palevioletred" : "beige")}; font-family: --apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

    2. ${(props) => props.potato ? css' font-size: 49px; ' : css' text-decoration: underline; '} '; 중요!! '이건 백틱으로 변화해줘야함` <= 이걸로 둘중가능!!
       (css 통째로 바꾸기.. 프롭에 따라)

7.  다크 모드를 위해서는 추가적으로 themeProvider를 추가해줘야한다!! App.js에!!
    ex) <ThemeProvider theme={darkMode ? darkTheme : lightTheme}> 이렇게 해줘서 모든 컴포넌트가
    props.theme 을통해.. darkMode 전역 변수가 true 고 false를 통해 darkTheme을 쓸지 lightTheme쓸지 고름
    그리고 그 dark,light theme은 style.js에서 관리함!

8.  npm i styled-reset

9.  createGlobalStyle은 body라고 직접 써줘야한다.

10. style.js는 우리가 원하는 프롭 이름을 정할수있고.. 값은 무조껀 "" 안에 넣어줘야한다!

11. <Link>는 <a>랑 똑같다고 보면됨..

12. 다른곳에서 컴포넌트를 import할떄 css와 함께.. 그 import한 컴포넌트안에 다른게 꼭 들어있따면
    {children} 를 넣어줘야한다.. ex)AuthLayout.. 하지만 BottomBox는 그자체에 이미 포함해서 children없어도됨!

13. react hook form쓰기위해서는 name이 필수이다..

14. <form onSubmit={handleSubmit(onSubmitValid, onSubmitInvalid)}> 은 우리가 입력한거의 제출이
    유효한지 아닌지 검사한다! 유효하면 onSubmitValid 를 얻을 것이고, 유효안하면 onSubmitInvalid 을 얻을것임
     ref={register({
              required: "Username is required", <-여기가 메시지 또는 true가 될수이씀
              minLength: 2,
               //pattern : "", <-을통해 정규식 이용가능
              // validate:(currentValue)=> currentValue.includes("@")
            })}

15. mode: onChange는 바뀔때마다 유효성 검사.. onBlur는 마우스를 다른곳에 클릭.. input외에.. 클릭하면
    유효성 검사를 실시한다

16. 백앤드 연결을 위해 apollo.js에 client를 만들어 준다!!
    안에보면 uri는 백엔드 연결 주소이고 cache는 우리가 한번쓴걸 기억해준다. 두번 api같은 내용안가져오기위해
    그다음!! app.js에 apollo Provider를 최상위에 넣어준다!

17. setError이거 설정한뒤 clearError로 안지워주면 submit버튼 안눌러짐

18. 토큰 저장해주고 isLoggedInVar 전역변수도 true로 해줬는데 새로고침하면 다시 로그인 화면으로 간다
    이유는? isLoggedInvar가 초기화된다. 그래서
    const isLoggedInVar = makeVar(Boolean(localStorage.getItem(TOKEN))); 와같이 매번 토큰만있따면
    초기화가되도 토큰은 살아 있기에 로그인에는 아무지장을 주지 않는다 다크모드또한 똑같다! 그래서 불린으로
    로컬스토리지 값으로 초기값 다시 설정해주면 된다!

19. useMutation의 loading은 뮤테이션이 잘 넘어갔는지 ..true면 문제있음
    이 loading을 통해 서브밋 두번누르는걸 방지할수있었음.. login에서

20. useHistory는 push할때 인자를 가지고 푸시를 할수있어 돌아가는화면에 useLocation을 활용해
    state 제공가능하다
    그래서 아이디 생성후 바로 로그인할때 id와 password가 자동 입력되게 할수있음!
    ex )
    history.push(routes.home, {
    message: "Account created. Please log in.",
    username,
    password,
    }); <-여기서 이렇게 한뒤

    로그인의 useForm에서 이렇게 활용가능!!
    defaultValues: {
    username: location?.state?.username || "",
    password: location?.state?.password || "",
    },

21. 다크 모드를 위해 토큰과 같이 다크모드 누를때 localstorage에 저장해준다
