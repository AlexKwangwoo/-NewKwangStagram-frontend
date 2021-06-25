import { gql, useMutation, useQuery } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { useState } from "react";
import useUser from "../hooks/useUser";
import { faEdit, faPen } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../utils";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import Button2 from "../components/auth/Button2";
import MessageDetail from "./MessageDetail";

const SEE_ROOMS_QUERY = gql`
  query seeRooms {
    seeRooms {
      id
      updatedAt
      users {
        id
        username
        avatar
      }
      messages {
        payload
        user {
          id
          username
          avatar
        }
      }
    }
  }
`;

const MessageRoomsContainer = styled.div`
  margin-top: 80px;
  width: 100%;
  height: calc(100vh - 140px);
  background-color: white;
  border: 1px #e3e3e3 solid;
  border-radius: 5px;
  display: flex;
`;

const Icon = styled.div`
  cursor: pointer;
  margin-left: 20px;
`;

const LeftBox = styled.div`
  width: 35%;
  height: 100%;
  /* background-color: red; */
  border-right: 1px #e3e3e3 solid;
`;
const RightBox = styled.div`
  width: 65%;
  height: 100%;
`;

const LeftTop = styled.div`
  height: 60px;
  font-size: 17px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background-color: black; */
  border-bottom: 1px #e3e3e3 solid;
`;

const UserName = styled.div``;

const LeftBottom = styled.div`
  height: 100%;
  padding: 10px 0px;

  /* background-color: blue; */
`;

const RoomContatiner = styled.div`
  padding: 10px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: #f7f7f7;
  }
`;

const CircleAvatar = styled.div`
  width: 60px;
  height: 60px;
  margin-right: 10px;
  border-radius: 50px;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
`;

const MessageUserName = styled.div`
  margin-bottom: 2px;
  font-weight: 600;
`;

const UserInfo = styled.div``;

const Date = styled.span`
  font-size: 11px;
  color: gray;
`;

const NewMessageContainer = styled.div`
  width: 100%;
  height: 100%;
  /* background-color: yellow; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const NewMessageIcon = styled.div`
  width: 100px;
  height: 100px;
  border: 2px solid black;
  border-radius: 130px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const FirstSentence = styled.div`
  font-size: 23px;
  margin-top: 15px;
`;
const SecondSentence = styled.div`
  font-size: 15px;
  margin-top: 15px;
  color: #a8a8a8;
`;

const SendButton = styled(Button2).attrs({
  as: "span",
})`
  width: 120px;
  margin-top: 25px;
  cursor: pointer;
  padding: 10px 5px;
  font-size: 13px;
  &:hover {
    background: #006bb3;
  }
`;

function MessageRooms() {
  const { data: userData } = useUser();
  const { data, loading } = useQuery(SEE_ROOMS_QUERY);
  const [messageRoom, setMessageRoom] = useState();

  // console.log("메시지방정보", data);
  // console.log("선택된방", messageRoom);

  const selectMessageRoom = (room) => {
    setMessageRoom(room);
  };
  return (
    <MessageRoomsContainer>
      <LeftBox>
        <LeftTop>
          <UserName>
            {userData?.me?.firstName} {userData?.me?.lastName}
          </UserName>
          <Icon>
            <FontAwesomeIcon icon={faEdit} size="lg" />
          </Icon>
        </LeftTop>
        <LeftBottom>
          {data?.seeRooms?.map((room) => (
            <div key={room.id}>
              {room.users[0].username === userData?.me?.username ? (
                <RoomContatiner onClick={() => selectMessageRoom(room)}>
                  <CircleAvatar src={room.users[1].avatar}></CircleAvatar>
                  <UserInfo>
                    <MessageUserName>{room.users[1].username}</MessageUserName>
                    <Date> {formatDate(room.updatedAt)}</Date>
                  </UserInfo>
                </RoomContatiner>
              ) : (
                <RoomContatiner
                  key={room.id}
                  onClick={() => selectMessageRoom(room)}
                >
                  <CircleAvatar src={room.users[0].avatar}></CircleAvatar>
                  <UserInfo>
                    <MessageUserName>{room.users[0].username}</MessageUserName>
                    <Date> {formatDate(room.updatedAt)}</Date>
                  </UserInfo>
                </RoomContatiner>
              )}
            </div>
          ))}
        </LeftBottom>
      </LeftBox>
      <RightBox>
        {messageRoom === undefined ? (
          <NewMessageContainer>
            <NewMessageIcon>
              <FontAwesomeIcon icon={faPaperPlane} size="3x" />
            </NewMessageIcon>
            <FirstSentence>Your Messages</FirstSentence>
            <SecondSentence>Send private messages to a friend.</SecondSentence>
            <SendButton>Send Message</SendButton>
          </NewMessageContainer>
        ) : (
          <MessageDetail room={messageRoom} userData={userData} />
        )}
      </RightBox>
    </MessageRoomsContainer>
  );
}

export default MessageRooms;
