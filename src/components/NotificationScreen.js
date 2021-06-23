import styled from "styled-components";
import Header from "./Header";
import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragments";
import { Scrollbars } from "react-custom-scrollbars";
import { formatDate } from "../utils";
import { useHistory } from "react-router-dom";

const FEED_QUERY = gql`
  query seeFeedNoOffset {
    seeFeedNoOffset {
      ...PhotoFragment
      user {
        username
        avatar
        email
      }
      caption
      comments {
        ...CommentFragment
      }
      createdAt
      isMine
    }
  }
  ${PHOTO_FRAGMENT}
  ${COMMENT_FRAGMENT}
`;

const NotificationContainer = styled.div`
  padding: 10px 10px;
`;
const Title = styled.div`
  color: black;
  font-weight: 700;
`;

const NotificationContents = styled.div``;

const ListContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
`;

const CircleAvatar = styled.div`
  width: 35px;
  height: 35px;
  margin-right: 10px;
  border-radius: 50px;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
`;

const ScrollBox = styled.div`
  /* background-color: red; */
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
`;

const Text = styled.div``;

const UserName = styled.text`
  font-weight: 600;
`;

const Date = styled.div`
  margin-top: 4px;
  color: gray;
  font-size: 11px;
`;

const CheckButton = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #5ebcf7;
  padding-top: 6px;
  text-align: center;
  width: 90px;
  height: 25px;
  margin-left: auto;
  cursor: pointer;
`;

const renderThumb = ({ style, ...props }) => {
  const thumbStyle = {
    borderRadius: 6,
    backgroundColor: "rgba(35, 49, 86, 0.8)",
  };
  return <div style={{ ...style, ...thumbStyle }} {...props} />;
};

const CustomScrollbars = (props) => (
  <Scrollbars
    renderThumbHorizontal={renderThumb}
    renderThumbVertical={renderThumb}
    {...props}
  />
);

function NotificationScreen({ setSelectHeaderNone }) {
  const { data } = useQuery(FEED_QUERY);
  const history = useHistory();

  const goToProfile = (username) => {
    setSelectHeaderNone();
    history.push(`/users/${username}`);
  };
  return (
    <NotificationContainer>
      <CustomScrollbars
        style={{ width: 480, height: 280 }}
        autoHide
        autoHideTimeout={500}
        autoHideDuration={200}
      >
        <ScrollBox>
          <Title>Notification</Title>
          <NotificationContents>
            {data?.seeFeedNoOffset.map((photo) => (
              <ListContainer>
                <CircleAvatar src={photo.user.avatar}></CircleAvatar>
                <Text>
                  <UserName>{photo.user.username}</UserName> uploaded photo
                  <Date> {formatDate(photo.createdAt)}</Date>
                </Text>
                <CheckButton onClick={() => goToProfile(photo.user.username)}>
                  Check Profile
                </CheckButton>
              </ListContainer>
            ))}
          </NotificationContents>
        </ScrollBox>
      </CustomScrollbars>
    </NotificationContainer>
  );
}

export default NotificationScreen;
