1. npx create-react-app NewKwangStagram_front

2. 아래 다 다운로드
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

5. 로컬스토리지 사용위해 apollo client를 사용해 로컬state를 만들것임.. 전역 변수를 만들것임!
   useReactiveVar 를 통해 App.js에 선언해주고 전역에서 다 사용가능

6. 다크모드 사용위해 styled component를 사용.. 왜냐하면 재네들 다 컴포넌트기에 props를 받을수있음!!
   ex)const Title = styled.h1'

   1. color: ${(props) => (props.potato ? "palevioletred" : "beige")}; font-family: --apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

   2. ${(props) => props.potato ? css' font-size: 49px; ' : css' text-decoration: underline; '} '; 중요!! '이건 백틱으로 변화해줘야함` <= 이걸로 둘중가능!!
      (css 통째로 바꾸기.. 프롭에 따라)

7. 다크 모드를 위해서는 추가적으로 themeProvider를 추가해줘야한다!! App.js에!!
   ex) <ThemeProvider theme={darkMode ? darkTheme : lightTheme}> 이렇게 해줘서 모든 컴포넌트가
   props.theme 을통해.. darkMode 전역 변수가 true 고 false를 통해 darkTheme을 쓸지 lightTheme쓸지 고름
