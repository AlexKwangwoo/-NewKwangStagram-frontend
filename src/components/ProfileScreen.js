import styled from "styled-components";
import Header from "./Header";
import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragments";
import { formatDate } from "../utils";
import { useHistory, Link } from "react-router-dom";
import {
  faCompass,
  faHeart,
  faPaperPlane,
  faUser,
  faUserCircle,
} from "@fortawesome/free-regular-svg-icons";
import {
  faExpandAlt,
  faHome,
  faOutdent,
  faPersonBooth,
  faPlane,
  faSearch,
  faSignInAlt,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProfileContainer = styled.div`
  height: 100%;

  /* background-color: red; */
`;

const Icon = styled.span`
  cursor: point;
`;

const ProfileFirstBox = styled.div`
  height: 50%;
  display: flex;
  align-items: center;
  /* background-color: yellow; */
  border-bottom: #edebeb solid 1px;
  padding: 0px 10px;
  &:hover {
    background-color: #f7f7f7;
  }
`;
const ProfileSecondBox = styled.div`
  height: 50%;
  display: flex;
  align-items: center;
  /* background-color: blue; */
  padding: 0px 10px;
  &:hover {
    background-color: #f7f7f7;
  }
`;

const Title = styled.text`
  margin-left: 10px;
`;

function ProfileScreen({ setSelectHeaderNone, me }) {
  const history = useHistory();
  const client = useApolloClient();
  const goToProfile = (username) => {
    setSelectHeaderNone();
    history.push(`/users/${me}`);
  };

  const LogOut = () => {
    client.clearStore();
    localStorage.removeItem("TOKEN");
    window.location.assign("/");
  };
  return (
    <ProfileContainer>
      <ProfileFirstBox>
        <Link onClick={() => goToProfile()}>
          <Icon>
            <FontAwesomeIcon
              onClick={() => setSelectHeaderNone("heart")}
              icon={faUserCircle}
              size="lg"
            />
            <Title>Profile</Title>
          </Icon>
        </Link>
      </ProfileFirstBox>
      <ProfileSecondBox>
        <Link onClick={() => LogOut()}>
          <Icon>
            <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
            <Title>Log Out</Title>
          </Icon>
        </Link>
      </ProfileSecondBox>
    </ProfileContainer>
  );
}

export default ProfileScreen;
