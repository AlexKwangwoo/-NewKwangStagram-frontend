import { gql, useMutation, useQuery } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { useEffect, useState } from "react";
import useUser from "../hooks/useUser";
import {
  faCheck,
  faEdit,
  faPen,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../utils";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import Button2 from "../components/auth/Button2";
import MessageDetail from "./MessageDetail";
import Modal from "react-awesome-modal";
import { Scrollbars } from "react-custom-scrollbars";

const ALLUSER_QUERY = gql`
  query allUser {
    allUser {
      id
      username
      avatar
      firstName
      lastName
      email
    }
  }
`;

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

const JUST_CREATE_ROOM_MUTATION = gql`
  mutation justCreateRoom($userId: Int!) {
    justCreateRoom(userId: $userId) {
      error
      ok
      id
      talkingTo {
        username
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
  background-color: ${(props) =>
    props.username === props.selectedName ? "#f7f7f7" : "white"};

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

const CircleAvatarSmall = styled.div`
  width: 45px;
  height: 45px;
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

const SearchMessageContainer = styled.div`
  width: 100%;
  height: 100%;
  /* background-color: red; */
`;
const TopBox = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  border-bottom: 1px solid #dbdbdb;
  /* background-color: green; */
`;

const ToBox = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  /* background-color: yellow; */

  border-bottom: 1px solid #dbdbdb;
`;

const SuggestedBox = styled.div`
  width: 100%;
  height: calc(100% - 100px);
  /* background-color: blue; */
  padding-top: 17px;
`;

const IconX = styled.div`
  margin-left: 10px;
  cursor: pointer;
  /* width: 20px; */
  /* height: 20px; */
`;

const Title = styled.div`
  /* width: 20px; */
  /* height: 20px; */
  font-weight: 700;
  font-size: 15px;
`;

const NextBtn = styled.div`
  cursor: pointer;
  margin-right: 10px;
  /* width: 20px; */
  /* height: 20px; */
  color: #0095f6;
`;

const ToName = styled.div`
  margin-left: 10px;
  font-weight: 600;
  font-size: 15px;
`;

const SuggestLetter = styled.div`
  padding-left: 17px;
  font-weight: 600;
`;
const PeopleContainer = styled.div`
  margin-top: 15px;
`;

const EachUserContainer = styled.div`
  padding-left: 17px;
  /* background-color: red; */
  height: 60px;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: #f7f7f7;
  }
`;

const UserNameBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const UserNameMessage = styled.div`
  font-weight: 700;
`;
const UserEmailMessage = styled.div`
  margin-top: 4px;
  color: gray;
`;

const CircleBox = styled.div`
  border: solid 1px #e2e2e2;
  width: 30px;
  height: 30px;
  border-radius: 30px;
  margin-left: auto;
  margin-right: 10px;
`;

const SelectedCircleBox = styled.div`
  border: solid 1px #e2e2e2;
  width: 30px;
  height: 30px;
  border-radius: 30px;
  background-color: #3897f0;
  margin-left: auto;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Circle = styled.div``;

const SelectedCircle = styled.div``;
const Checked = styled.div`
  color: white;
`;

const ToNameUser = styled.span`
  margin-left: 10px;
  font-weight: 300;
`;

function MessageRooms() {
  const { data: userData } = useUser();
  const { data, loading, refetch: seeRoomsRefetch } = useQuery(SEE_ROOMS_QUERY);
  const [messageRoom, setMessageRoom] = useState();
  const { data: allUserFound } = useQuery(ALLUSER_QUERY);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [selectedPersonId, setSelectedPersonId] = useState("");
  const [selectedDetail, setSelectedDetail] = useState("");
  const [selectedPersonForColor, setSelectedPersonForColor] = useState();

  const [
    createRoomMutation,
    { data: createRoomData, loading: createRoomLoading },
  ] = useMutation(JUST_CREATE_ROOM_MUTATION, {
    // refetchQueries: [{ query: SEE_ROOMS_QUERY }],
    onCompleted: (data) => {
      seeRoomsRefetch();
      // const roomLength = data?.seeRooms;
      // console.log("roomLength", roomLength);
      // console.log("마지막방", data?.seeRooms[roomLength]);
      // selectMessageRoom(data?.seeRooms[roomLength]);
    },
  });

  useEffect(() => {
    if (selectedPerson !== "") {
      const roomLength = data?.seeRooms.length - 1;
      // console.log("roomLength", roomLength);
      const lastRoom = data?.seeRooms[roomLength];
      // console.log("lastRoom", lastRoom);
      // console.log("마지막방", data?.seeRooms[roomLength]);
      // selectMessageRoom(data?.seeRooms[roomLength]);
      selectMessageRoom(lastRoom);
      setSelectedPerson("");
      setSelectedPersonId("");
    }
  }, [data]);

  // console.log("allUserFound", allUserFound);
  // console.log("SEE_ROOMS_QUERY", data);

  const selectColor = (username) => {
    setSelectedPersonForColor(username);
  };

  const selectMessageRoom = (room) => {
    setMessageRoom(room);
  };

  const selectMessageRoomTogether = (room, username) => {
    setMessageRoom(room);
    selectColor(username);
  };

  const [visible, setVisible] = useState(false);
  const openModal = () => {
    document.body.style.overflow = "hidden";
    setVisible(true);
  };
  const closeModal = () => {
    document.body.style.overflow = "unset";
    setVisible(false);
  };

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

  const clickPerson = (person) => {
    // console.log("person", person);
    setSelectedPerson(person.username);
    setSelectedPersonId(person.id);
    // console.log("person.id", person.id);
  };

  const clickNextButton = () => {
    if (selectedPerson.username === "") {
      alert("** Please Select The User First **");
    } else {
      const check = data?.seeRooms?.filter(
        (room) =>
          room.users[0].username === selectedPerson ||
          room.users[1].username === selectedPerson
      );

      console.log("check", check);
      if (check.length > 0) {
        // console.log("selectedPerson", selectedPerson);
        // console.log("있다");
        closeModal();
        selectMessageRoom(check[0]);
        setSelectedPerson("");
        setSelectedPersonId("");
      } else {
        // console.log("selectedPerson", selectedPerson);
        // console.log("없다");
        createRoomMutation({ variables: { userId: selectedPersonId } });

        alert("Message Room Is Created");
        closeModal();
      }
    }
  };

  const clickDetail = (user) => {
    console.log("디테일", user);
    setSelectedDetail(user);
  };

  const clickDetailRemove = () => {
    setSelectedDetail("");
  };

  console.log("selectedPersonForColor", selectedPersonForColor);

  return (
    <MessageRoomsContainer>
      <LeftBox>
        <LeftTop>
          <UserName>
            {userData?.me?.firstName} {userData?.me?.lastName}
          </UserName>
          <Icon onClick={() => openModal()}>
            <FontAwesomeIcon icon={faEdit} size="lg" />
          </Icon>
        </LeftTop>
        <LeftBottom>
          <CustomScrollbars
            style={{ width: 320, height: 745 }}
            autoHide
            autoHideTimeout={500}
            autoHideDuration={200}
          >
            {data?.seeRooms?.map((room) => (
              <div key={room.id}>
                {room.users[0].username === userData?.me?.username ? (
                  <RoomContatiner
                    selectedName={selectedPersonForColor}
                    username={room.users[1].username}
                    // same={room.users[1].username === selectedPerson}
                    onClick={() =>
                      selectMessageRoomTogether(room, room.users[1].username)
                    }
                  >
                    <CircleAvatar src={room.users[1].avatar}></CircleAvatar>
                    <UserInfo>
                      <MessageUserName>
                        {room.users[1].username}
                      </MessageUserName>
                      <Date> {formatDate(room.updatedAt)}</Date>
                    </UserInfo>
                  </RoomContatiner>
                ) : (
                  <RoomContatiner
                    key={room.id}
                    selectedName={selectedPersonForColor}
                    username={room.users[0].username}
                    onClick={() =>
                      selectMessageRoomTogether(room, room.users[0].username)
                    }
                  >
                    <CircleAvatar src={room.users[0].avatar}></CircleAvatar>
                    <UserInfo>
                      <MessageUserName>
                        {room.users[0].username}
                      </MessageUserName>
                      <Date> {formatDate(room.updatedAt)}</Date>
                    </UserInfo>
                  </RoomContatiner>
                )}
              </div>
            ))}
          </CustomScrollbars>
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
            <SendButton onClick={() => openModal()}>Send Message</SendButton>
          </NewMessageContainer>
        ) : (
          <MessageDetail
            room={messageRoom}
            userData={userData}
            SEE_ROOMS_QUERY={SEE_ROOMS_QUERY}
            selectedDetail={selectedDetail}
            clickDetailRemove={clickDetailRemove}
            clickDetail={clickDetail}
          />
        )}
      </RightBox>

      <Modal
        visible={visible}
        width="400"
        height="620"
        effect="fadeInUp"
        onClickAway={() => closeModal()}
      >
        <SearchMessageContainer>
          <TopBox>
            <IconX onClick={() => closeModal()}>
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </IconX>
            <Title>New Message</Title>
            <NextBtn onClick={() => clickNextButton()}>Next</NextBtn>
          </TopBox>
          <ToBox>
            <ToName>
              To: <ToNameUser>{selectedPerson}</ToNameUser>
            </ToName>
          </ToBox>
          <SuggestedBox>
            <SuggestLetter>Suggested</SuggestLetter>
            <PeopleContainer>
              <CustomScrollbars
                style={{ width: 395, height: 465 }}
                autoHide
                autoHideTimeout={500}
                autoHideDuration={200}
              >
                {allUserFound?.allUser.map((user) => (
                  <EachUserContainer
                    onClick={() => clickPerson(user)}
                    key={user.id}
                  >
                    <CircleAvatarSmall src={user.avatar}></CircleAvatarSmall>
                    <UserNameBox>
                      <UserNameMessage>{user.username}</UserNameMessage>
                      <UserEmailMessage>{user.email}</UserEmailMessage>
                    </UserNameBox>
                    {selectedPerson === user.username ? (
                      <SelectedCircleBox>
                        <Checked>
                          <FontAwesomeIcon icon={faCheck} size="sm" />
                        </Checked>
                      </SelectedCircleBox>
                    ) : (
                      <CircleBox>
                        <Circle></Circle>
                      </CircleBox>
                    )}
                  </EachUserContainer>
                ))}
              </CustomScrollbars>
            </PeopleContainer>
          </SuggestedBox>
        </SearchMessageContainer>
      </Modal>
    </MessageRoomsContainer>
  );
}

export default MessageRooms;
