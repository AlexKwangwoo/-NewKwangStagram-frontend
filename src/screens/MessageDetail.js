import { gql, useMutation, useQuery } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { useState } from "react";
import useUser from "../hooks/useUser";
import { faEdit, faInfoCircle, faPen } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../utils";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import Button2 from "../components/auth/Button2";
import { Scrollbars } from "react-custom-scrollbars";
import { useForm } from "react-hook-form";

const MessageDetailContainer = styled.div`
  width: 100%;
  height: 100%;
  /* background-color: yellow; */
  display: flex;
  flex-direction: column;
`;

const RightTop = styled.div`
  width: 100%;
  height: 60px;
  font-size: 17px;
  font-weight: 600;
  display: flex;
  align-items: center;
  /* justify-content: center; */
  /* background-color: black; */
  border-bottom: 1px #e3e3e3 solid;

  justify-content: space-between;
`;

const CircleAvatar = styled.div`
  width: 25px;
  height: 25px;
  margin-right: 10px;
  border-radius: 50px;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
`;

const UserInfo = styled.div`
  width: 100%;
  margin-left: 20px;
  display: flex;
  align-items: center;
`;

const Icon = styled.div`
  cursor: pointer;
  margin-right: 20px;
`;

const UserName = styled.div``;

const RightBottom = styled.div`
  width: 100%;
  /* padding-left: 20px; */
  padding-top: 2px;
  padding-bottom: 2px;
  height: calc(100% - 160px);
  /* background-color: blue; */
`;

const RightInput = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  /* width: 100%; */
  /* background-color: yellow; */
`;

const EachMessageContainer = styled.div`
  padding-right: 20px;
  margin-left: 20px;
  margin-top: 20px;
  display: flex;
  align-items: flex-end;
  /* background-color: blue; */
`;

const MessagePayLoadLeft = styled.div`
  height: 100%;
  max-width: 45%;
  font-size: 13px;
  padding: 15px 20px;
  border: 1px solid #f1f1f1;
  border-radius: 40px;
`;

const MessagePayLoadLeftLetter = styled.div`
  overflow-wrap: break-word;
  /* max-width: 200px; */
  width: 100%;
  /* background-color: red; */
`;

const MessagePayLoadRight = styled.p`
  margin-left: auto;
  max-width: 45%;
  font-size: 13px;
  padding: 15px 20px;
  /* border: 1px solid #f1f1f1; */
  background-color: #f1f1f1;
  border-radius: 40px;
  /* display: ; */
`;

const PostCommentInput = styled.input`
  width: 540px;
  height: 40px;
  padding-left: 20px;
  /* background-color: red; */
  border: 1px solid #dadada;
  border-radius: 20px;
  &::placeholder {
    font-size: 12px;
  }
`;

const renderThumb = ({ style, ...props }) => {
  const thumbStyle = {
    borderRadius: 6,
    backgroundColor: "rgba(35, 49, 86, 0.8)",
  };
  return <div style={{ ...style, ...thumbStyle }} {...props} />;
};

const renderThumbHori = ({ style, ...props }) => {
  const thumbStyle = {
    overflowX: "hidden",
  };
  return <div style={{ ...style, ...thumbStyle }} {...props} />;
};

const CustomScrollbars = (props) => (
  <Scrollbars
    renderThumbHorizontal={renderThumbHori}
    renderThumbVertical={renderThumb}
    {...props}
  />
);

function MessageDetail({ room, userData }) {
  const [messageRoom, setMessageRoom] = useState();
  const { register, handleSubmit, setValue, getValues } = useForm();
  console.log("디테일방정보", room);

  const selectMessageRoom = (room) => {
    setMessageRoom(room);
  };
  return (
    <MessageDetailContainer>
      <RightTop>
        {room.users[0].username === userData?.me?.username ? (
          <UserInfo>
            <CircleAvatar src={room.users[1].avatar}></CircleAvatar>
            <UserName>{room.users[1].username}</UserName>
          </UserInfo>
        ) : (
          <UserInfo>
            <CircleAvatar src={room.users[0].avatar}></CircleAvatar>
            <UserName>{room.users[0].username}</UserName>
          </UserInfo>
        )}
        <Icon>
          <FontAwesomeIcon icon={faInfoCircle} size="lg" />
        </Icon>
      </RightTop>
      <RightBottom>
        <CustomScrollbars
          style={{ width: "100%", height: "100%" }}
          autoHide
          autoHideTimeout={500}
          autoHideDuration={200}
        >
          {room.messages.map((message) => (
            <div>
              {message?.user?.username !== userData?.me?.username ? (
                <EachMessageContainer>
                  <CircleAvatar src={message.user.avatar} />
                  <MessagePayLoadLeft>
                    <MessagePayLoadLeftLetter>
                      {message.payload}
                    </MessagePayLoadLeftLetter>
                  </MessagePayLoadLeft>
                </EachMessageContainer>
              ) : (
                <EachMessageContainer>
                  <MessagePayLoadRight>
                    <MessagePayLoadLeftLetter>
                      {message.payload}
                    </MessagePayLoadLeftLetter>
                  </MessagePayLoadRight>
                  {/* <CircleAvatar src={message.user.avatar} /> */}
                </EachMessageContainer>
              )}
            </div>
          ))}
        </CustomScrollbars>
      </RightBottom>
      <RightInput>
        <form>
          {" "}
          <PostCommentInput
            name="payload"
            ref={register({ required: true })}
            type="text"
            placeholder="Message..."
          />
        </form>
      </RightInput>
    </MessageDetailContainer>
  );
}

export default MessageDetail;
