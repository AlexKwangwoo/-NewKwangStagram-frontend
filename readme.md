시작하기위해선
npm run start

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

14. handleSubmit 는 첫번쨰인자는 유효한값.. 두번째값은 유효하지 않는값이 넘어올때 일어남 변수명은 아무
    거나 괜찮음!!
    <form onSubmit={handleSubmit(onSubmitValid, onSubmitInvalid)}> 은 우리가 입력한거의 제출이
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

22. function Avatar({ url = null, lg = false }) 이건.. url에 null을 default로 넣어주겠단 뜻임!
    또한 Avatar에서 lg없으면 false있으면 true임

23. min-width: 100%; 를 통해서 이미지 가로길이 들쑥날쑥한걸 최대로 맞춰줄것임
    min-width: 100% 를 하고도 사진이 Nico 선생님 처럼 안되신분 계신가요?
    그러시면 min-width -> width: 100% 변경하시면 됩니다.

24. like 버튼눌러도 안바뀜 방법 두개임.. (아폴로캐쉬 업데이트)

    1. refetch를 통해 쿼리를 다시 실행시킴 query를 한번더 다시 호출하면 query를 다시 fetch함
       변한내용이 있다면 apollo가 캐쉬를 업데이트할것임
       state로 like 상태 바꿀수있지만 아폴로캐쉬에 저장된 내용을 바꿔 liked를 바꿔봄 refetchQueries
       를통해 캐쉬 안건들고 바로 뮤테이션을 실행시킴.. 즉 toogleLike 누르면 연속으로 seeFeed쿼리를 바로 다시 실행시키게 가능 //하지만 모든 feed를 다 리셋해서 보여주는건 좋은 생각이 아님..

    2. (백앤드 내용안가져오고.. 왜냐면 기다려야하니깐.. 캐쉬이용해서 결과를 미리 예상해서 보여줌)
       두번째 방법은 fragments를 이용하는것 +update 는 백앤드에서 받은 데이터를 주는 fuction임
       아폴로 캐쉬에 직접 link해줌. / fragment를 write하는건 캐쉬에서 내가 원하는 특정 일부분의 object를
       수정하는것임.. 일단 먼저 cache.readFragment이용해 기존 캐쉬내용을 result에 저장하고
       cache.writeFragment를 통해 기존결과에 +1 -1 또는 !isLiked를 실행해 반대값만 보여주면된다
       어짜피 새로고침하면 새로운 데이터가 쓰여질것임.! read안하고 바로 있는것에서 write해도되긴함..

    3. modify 로 더쉽게 만들었음!! modify는 필드싹다 적을필요없고 필요한 부분만 골라서 함수와prev만이용하면됨!!

25. npm i sanitize-html
    댓글작성시 html형식으로 된 댓글을 이미지나..나쁜걸로 못넣게 막아준다!
    comment부분가보면암.. 문제는 링크를 못만들어주게되서 폐지

26. <></> 이거랑 <React.Fragment>랑 똑같은데 React.Fragment는 우리가 키 나 프롭등을 추가할수있따

27. React.~ 안쓸때는 react-create-app 에서 자동으로 해주기에 import할필요가 없다!

28. 아폴로캐쉬 코맨트는 COMMENT가서 보면됨.. 단 photo에 들어가면 comments가 있는데
    여기를 추가할때 comment 모든 속성을 추가해야하는데 photo -> comments -> 0: 가면 ref로 comment:1
    이런식으로 가리키고있음 그래서 다시 comment:1누르면 6개 파일 형식이 있는데 그걸 캐쉬에 똑같이 써줘야함
    문제가 생겼음./. 아폴로 캐쉬에 comment추가해주면.. comment:1 이런식으로 만들어져야하는데
    MutationResponse:10 이런식으로 나오고있음 그래서 cache.write를 통해 comment:10 처럼 우리가 같이
    추가 해주면 됨!! 그러면 photo:1의 comments에 배열이 하나더 생기고 + \_ref:comment:10도 생기고
    캐쉬에도 comment:10 같은 친구가 생기면서나중에!!!! delete를 위해서!! 활용할수가 있음!
    왜냐하면 캐쉬에도 생겨야 우리가 지울수있는데 comment:10이 없음!!
    그래서 최종적으로!!!!!!!!!
    write를통해 comment:10을 생성도 해주고. modify를 통해 photo의 comments 배열에 \_\_ref:comment10을
    추가해주는것임!! //마치 second데이터베이스 만지는 느낌.. 화면에 바로 보여주기위해! 새로고침하면
    어짜피 본디비에서 가져올꺼니깐

29. useParam 사용하기위해 app.js <Route path={`/users/:username`}>
    을 추가했음! 프로필에서 const { username } = useParams(); 이렇게 사용가능

30. 아폴로 캐쉬에서 다른 유저를 데리고 왔는데 저장을 못하고 root에만 하고있다..
    이유는 apollo.js 에서 cache에서 user정의를 따로 해줘야한다! User:1 User:2 처럼 나와줘야하는데..
    (id가 없으면 apollo는 유저를 찾지못함.. .그래서 seeProfile에서 id를 넣어줘야함! 아니면 위에처럼
    apollo.js에 추가해줘야함) apollo.js 에서 캐쉬 부분 확인할것!

31. Button은 styled.input 으로 만들어서 profile에서 follow unfollow editprofile에서 children을 못가진다
    그럴때 방법은??
    styled(Button).attrs({
    as: "span",
    })` 이런식으로 span 기능도 한다고 알려주면됨!

32. unfollow했을때 seeFeed를 새로 불러와야한다. 그떄 refetch 사용가능하다 12.5참고
    두번이나하게된다.. me 하나랑 다른유저의 프로필 갱신을 위해..
    그래서 그냥 캐쉬 업데이트 할까함..
    const [unfollowUser] = useMutation(UNFOLLOW_USER_MUTATION, {
    variables: {
    username,
    },
    });
    // refetchQueries: [{ query: SEE_PROFILE_QUERY, variables: { username } }],
    // 리페치 방법

33. mutation에서 update는 (cache, result)를 주고 onComplete는 (data)만 주는데..
    update는 우리가 like comment 했던데로 하면되고 onComplete는 apolloClient 가지고와서
    캐쉬를 뽑아서 modify 시키면된다!
    캐쉬에서 조금이라도 객체가 바뀌면 리액트가 즉각 리 랜더를 한다!

34. 배포!! 매우쉽다
    - 넬리파이가서 새로운앱 만든다
    - Build Command는 CI= npm run build 이여야한다 넷리파이 어플만들때!!
    - publish directory 는 build/ 로 바꿔준다!
    - 환경변수 설정을해줘야한다!
      아폴로js 가서 uri:
      process.env.NODE_ENV === "production"
      ? "https://newkwangstagram-backend.herokuapp.com/graphql"
      : "http://localhost:4000/graphql",설정 해주면 됨!! 디비 뭐쓸껀지
    - 배포가 되고.. 사인업 가서 새로고침하면 페이지 에러가 뜬다!
    - 저걸 해결하기위해 \_redirect 페이지를 public에 만들어준다!
