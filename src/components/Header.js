import { useReactiveVar } from "@apollo/client";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import {
  faCompass,
  faHeart,
  faCalendar,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";
import {
  faCalendar as faCalendarSolid,
  faPaperPlane as faPaperPlaneSolid,
  faSearch,
  faCompass as faCompassSolid,
  faHeart as faHeartSolid,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled, { keyframes } from "styled-components";
import { isLoggedInVar } from "../apollo";
import { Link, useHistory, useParams } from "react-router-dom";
import useUser from "../hooks/useUser";
import routes from "../routes";
import Avatar from "./Avatar";
import letter from "../asset/letterB.png";
import { useForm } from "react-hook-form";
import { useState } from "react";
import NotificationScreen from "./NotificationScreen";
import ProfileScreen from "./ProfileScreen";

const SHeader = styled.header`
  top: 0;
  right: 0;
  z-index: 2;
  position: fixed;
  width: 100%;
  height: 60px;
  background-color: white;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  padding: 18px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* margin: auto; */
`;

const Wrapper = styled.div`
  position: absolute;
  max-width: 930px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Column = styled.div``;

const Icon = styled.span`
  margin-left: 20px;
  cursor: point;
  /* background-color: red; */
`;

const Button = styled.span`
  background-color: ${(props) => props.theme.accent};
  border-radius: 4px;
  padding: 4px 15px;
  color: white;
  font-weight: 600;
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LetterImg = styled.img`
  max-width: 70%;
  margin-bottom: -10px;
`;

const Input = styled.input`
  width: 100%;
  border-radius: 3px;
  padding: 5px 15px;
  background-color: #fafafa;
  border: 0.5px solid
    ${(props) => (props.hasError ? "tomato" : props.theme.borderColor)};
  /* 만약 애러가있다면 빨간색 테두리!! */
  margin-top: 5px;
  box-sizing: border-box;
  &::placeholder {
    font-size: 12px;
    text-align: center;
    color: #aaacaf;
    padding-left: 10px;
  }
  &:focus {
    border-color: rgb(38, 38, 38);
  }
`;

const SearchBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IconSearch = styled.div`
  position: absolute;
  margin-top: 7px;
  margin-right: 60px;
  color: #aaacaf;
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
  
`;

const NotificationBox = styled.div`
  position: absolute;
  top: 28px;
  right: 0;
  width: 500px;
  height: 300px;
  animation: 0.3s ${fadeIn} ease-out;
`;
/* animation-name: ${(props) =>
    props.selectProfile === "heart" ? fadeOut : fadeIn};
  animation-name: ${fadeIn};
  animation-duration: 500ms;
  animation-fill-mode: forwards; */

const Line = styled.div`
  width: 10px;
  height: 10px;
  /* padding-bottom: -20px; */
  margin-left: auto;
  margin-top: 8px;
  margin-right: 49px;
  transform: rotate(45deg);
  border-top: 2px #d9dcdf solid;
  border-left: 2px #d9dcdf solid;
  border-bottom: none;
  border-right: none;
  background-color: white;
  z-index: 10;
  /* box-shadow: 0px 0px 3px #aaacaf; */
`;

const Notification = styled.div`
  margin-top: -3px;
  width: 100%;
  height: 300px;
  border-radius: 10px;
  box-shadow: 0px 0px 3px #aaacaf;
  background-color: white;
`;

const ProfileNotificationBox = styled.div`
  position: absolute;
  top: 28px;
  right: 0;
  width: 170px;
  height: 100px;
  animation: 0.3s ${fadeIn} ease-out;
  /* background-color: yellow; */
`;

const ProfileLine = styled.div`
  width: 10px;
  height: 10px;
  /* padding-bottom: -20px; */
  margin-left: auto;
  margin-top: 8px;
  margin-right: 8px;
  transform: rotate(45deg);
  border-top: 1.2px #d9dcdf solid;
  border-left: 1.2px #d9dcdf solid;
  border-bottom: none;
  border-right: none;
  background-color: white;
  z-index: 10;
  /* box-shadow: 0px 0px 3px #aaacaf; */
`;

const ProfileNotification = styled.div`
  margin-top: -4px;
  width: 100%;
  height: 120px;
  border-radius: 3px;
  box-shadow: 0px 0px 3px #aaacaf;
  background-color: white;
`;

function Header() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const history = useHistory();
  const onCompleted = (data) => {};
  const [selectHeader, setSelectHeader] = useState("home");
  const [selectHeart, setSelectHeart] = useState();
  const [selectProfile, setSelectProfile] = useState();
  const [beforeChange, setBeforeChange] = useState("");
  const { data } = useUser();
  const {
    register,
    handleSubmit,
    errors,
    formState,
    watch,
    getValues,
    setValue,
  } = useForm({
    mode: "onChange",
  });

  const onSubmitValid = (data) => {
    const { searchWord } = getValues();
    // console.log("data", data);
    // console.log("searchWord", searchWord);
    // const {
    //   createAccount: { ok, error },
    // } = data;
    // if (!ok) {
    //   return;
    // }

    history.push(`/search/${searchWord}`, {
      searchWord,
    });
  };

  const setSelectHeaderNone = () => {
    setSelectHeader("");
    setSelectHeart("");
    setSelectProfile("");
  };

  const selectHeaderHeart = (header) => {
    if (selectHeart === "heart") {
      setSelectHeart("");
      setSelectHeader(beforeChange);
    } else {
      if (selectProfile === "profile") {
        setSelectProfile("");
        setSelectHeart("heart");
      } else {
        setSelectHeart("heart");
        setBeforeChange(selectHeader);
        setSelectHeader("");
      }
    }
  };

  const selectHeaderHome = () => {
    if (selectHeader === "home") {
    } else {
      setSelectHeader("home");
      setSelectHeart("");
      setSelectProfile("");
    }
  };

  const selectHeaderProfile = () => {
    if (selectProfile === "profile") {
      setSelectProfile("");
      setSelectHeader(beforeChange);
    } else {
      if (selectHeart === "heart") {
        setSelectHeart("");
        setSelectProfile("profile");
      } else {
        setSelectProfile("profile");
        setBeforeChange(selectHeader);
        setSelectHeader("");
      }
    }
  };

  const selectHeaderExplore = () => {
    if (selectHeader === "explore") {
    } else {
      setSelectHeader("explore");
      setSelectHeart("");
      setSelectProfile("");
    }
  };

  const selectHeaderMessage = () => {
    if (selectHeader === "message") {
    } else {
      setSelectHeader("message");
      setSelectHeart("");
      setSelectProfile("");
    }
  };

  const handleChange = (event) => {
    setValue("searchWord", event.target.value);
  };
  return (
    <SHeader>
      <Wrapper>
        <Column>
          <Link to={"/"} onClick={() => selectHeaderHome()}>
            <LetterImg src={letter} />
          </Link>
        </Column>
        <Column>
          <SearchBox>
            {watch("searchWord") === "" ? (
              <IconSearch>
                <FontAwesomeIcon icon={faSearch} size="md" />
              </IconSearch>
            ) : null}

            <form onSubmit={handleSubmit(onSubmitValid)}>
              <Input
                ref={register({
                  required: "Search Word Is Required.",
                })}
                // value={watch("searchWord")}
                name="searchWord"
                type="text"
                // onChangeText={(text) => setValue("searchWord", text)}
                placeholder="Search"
                onChange={handleChange}
              />
            </form>
          </SearchBox>
        </Column>
        <Column>
          {isLoggedIn ? (
            <IconsContainer>
              <Icon>
                <Link to={"/"}>
                  {selectHeader === "home" ? (
                    <FontAwesomeIcon
                      icon={faCalendarSolid}
                      size="lg"
                      onClick={() => selectHeaderHome()}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faCalendar}
                      size="lg"
                      onClick={() => selectHeaderHome()}
                    />
                  )}
                </Link>
              </Icon>

              <Icon>
                <Link to={"/messageRooms"}>
                  {selectHeader === "message" ? (
                    <FontAwesomeIcon
                      icon={faPaperPlaneSolid}
                      size="lg"
                      onClick={() => selectHeaderMessage()}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faPaperPlane}
                      size="lg"
                      onClick={() => selectHeaderMessage()}
                    />
                  )}
                </Link>
              </Icon>
              <Icon>
                <Link to={"/explore"}>
                  {selectHeader === "explore" ? (
                    <FontAwesomeIcon
                      icon={faCompassSolid}
                      size="lg"
                      onClick={() => selectHeaderExplore()}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faCompass}
                      size="lg"
                      onClick={() => selectHeaderExplore()}
                    />
                  )}
                </Link>
              </Icon>
              <Icon>
                <Link>
                  {selectHeart === "heart" ? (
                    <FontAwesomeIcon
                      onClick={() => selectHeaderHeart("heart")}
                      icon={faHeartSolid}
                      size="lg"
                    />
                  ) : (
                    <FontAwesomeIcon
                      onClick={() => selectHeaderHeart("heart")}
                      icon={faHeart}
                      size="lg"
                    />
                  )}
                </Link>
              </Icon>
              <Icon>
                {/* <Link to={`/users/${data?.me?.username}`}>
                  <Avatar url={data?.me?.avatar} />
                </Link> */}
                <Link onClick={() => selectHeaderProfile()}>
                  <Avatar url={data?.me?.avatar} />
                </Link>
              </Icon>
            </IconsContainer>
          ) : (
            <Link href={routes.home}>
              <Button>Login</Button>
            </Link>
          )}
        </Column>
        {selectHeart === "heart" ? (
          <NotificationBox>
            <Line></Line>
            <Notification>
              <NotificationScreen setSelectHeaderNone={setSelectHeaderNone} />
            </Notification>
          </NotificationBox>
        ) : null}
        {selectProfile === "profile" ? (
          <ProfileNotificationBox>
            <ProfileLine></ProfileLine>
            <ProfileNotification>
              <ProfileScreen
                me={data?.me?.username}
                setSelectHeaderNone={setSelectHeaderNone}
              />
            </ProfileNotification>
          </ProfileNotificationBox>
        ) : null}
      </Wrapper>
    </SHeader>
  );
}
export default Header;
