import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./screens/Home";
import Login from "./screens/Login";
import NotFound from "./screens/NotFound";
import { useReactiveVar } from "@apollo/client";
import { darkModeVar, isLoggedInVar } from "./apollo";
import { ThemeProvider } from "styled-components";

const lightTheme = {
  fontColor: "#2c2c2c",
  bgColor: "lightgray",
};

const darkTheme = {
  fontColor: "lightgray",
  bgColor: "#2c2c2c",
};

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const darkMode = useReactiveVar(darkModeVar);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      {/* 전역에 props.theme 제공!! */}
      <Router>
        <Switch>
          {/* 스위치 안넣으면 겹치는 url이 생긴다  그리고 스위치는 하나의 route만 render해줌*/}
          <Route path="/" exact>
            {isLoggedIn ? <Home /> : <Login />}
          </Route>
          <Route>
            {/* 위에서 맞는게 없이면 NotFound가 실행될것임 마지막에 넣어주는것이 중요함..*/}
            {/* 이것도 아니고 저것도 아닐때 여기로 오기때문 */}
            <NotFound />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
