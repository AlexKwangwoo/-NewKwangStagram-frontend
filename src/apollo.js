import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const TOKEN = "TOKEN";
const DARK_MODE = "DARK_MODE";

export const isLoggedInVar = makeVar(Boolean(localStorage.getItem(TOKEN)));

export const logUserIn = (token) => {
  localStorage.setItem(TOKEN, token);
  isLoggedInVar(true);
};

export const logUserOut = () => {
  localStorage.removeItem(TOKEN);
  window.location.reload();
  //이걸 해주지 않으면.. location.state가 살아 있어 login화면에 여전히
  //account created. please log in이 보인다..
};

export const darkModeVar = makeVar(Boolean(localStorage.getItem(DARK_MODE)));
//아무리 disableDarkMode 에서 false넣어주더라도 새로고침하면 없어지기에
//여기서 불린을 이용해 리프레시해도 로컬저장값을 이용해 값을 처음에 설정할수있게 한다!

export const enableDarkMode = () => {
  localStorage.setItem(DARK_MODE, "enabled");
  darkModeVar(true);
};

export const disableDarkMode = () => {
  localStorage.removeItem(DARK_MODE);
  darkModeVar(false);
};

const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === "production"
      ? "https://newkwangstagram-backend.herokuapp.com/graphql"
      : "http://localhost:4000/graphql",
});

//http req 헤더에 토큰을 보내기위한 작업을 해줘야한다!
//doc에 적혀있음 이렇게 해라고
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      token: localStorage.getItem(TOKEN),
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    //이렇게 추가해줘야 캐쉬에 seeProfile할떄 id가 없어도 자동으로 저장해준다!
    //id가 적힌 어느곳이던 User관련된곳에서만 정보를 가져온다. 예를들어 useUser에서
    // id포함 User에 대한 정보를 avatar와 userName만 가져오면 캐쉬에는 두개만 저장된다!
    //밑에를 이용해 캐쉬에 User:rhhkddn3049 처럼 저장가능.. User:1 이 아니라!
    //아폴로는 id가 unique키인줄 알고 자동으로 식별자를 설정한다!
    typePolicies: {
      User: {
        keyFields: (obj) => `User:${obj.username}`,
      },
    },
  }),
});
