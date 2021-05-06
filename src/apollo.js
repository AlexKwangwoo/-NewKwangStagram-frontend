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
  uri: "http://localhost:4000/graphql",
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
  cache: new InMemoryCache(),
});
