import React, { useState } from "react";
import styled from "styled-components";
// import { toast } from "react-toastify";
import { Scrollbars } from "react-custom-scrollbars";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faComment,
  faPaperPlane,
  faHeart,
} from "@fortawesome/free-regular-svg-icons";
import {
  faTimes,
  faHeart as SolidHeart,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

// import { formatDate } from "../utils";

// const Overlay = styled.button`
//   background-color: rgba(0, 0, 0, 0.6);
//   width: 100%;
//   height: 100%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   opacity: 0;
//   transition: opacity 0.3s linear;
//   svg {
//     fill: white;
//   }
// `;
//transition opacity변화가 일어날때 0.3초 과정을 통해 효력을 발생시킴!
// const Container = styled.div`
//   height: 100%;
//   background-image: url(${(props) => props.bg});
//   background-size: cover;
//   cursor: pointer;
//   &:hover {
//     ${Overlay} {
//       opacity: 1;
//     }
//   }
// `;

// const Number = styled.div`
//   color: white;
//   display: flex;
//   align-items: center;
//   &:first-child {
//     margin-right: 30px;
//   }
// `;

// const NumberText = styled.span`
//   margin-left: 10px;
//   font-size: 16px;
// `;

const Div = styled.div`
  display: flex;
`;

const Inside = styled.div`
  background-image: url(${(props) => props.bg});
  background-size: cover;
  background-position: center;
  width: 600px;
  height: 600px;
`;

const InsideSecond = styled.div`
  width: 330px;
  display: flex;
  flex-direction: column;
`;

const DivOne = styled.div`
  width: 100%;
  height: 70px;
  border-bottom: #f6f6f6 2px solid;
  display: flex;
  align-items: center;
  padding: 0px 20px;
`;

const CircleAvatar = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50px;
  margin-right: 10px;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
`;

const UserInfo = styled.div`
  width: 200px;
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const UserName = styled.div`
  margin-right: auto;
  font-size: 15px;
  margin-bottom: 3px;
  font-weight: 600;
`;

const UserEmail = styled.div`
  margin-right: auto;
  font-size: 12px;
`;

const DivTwo = styled.div`
  width: 100%;
  height: 370px;
  border-bottom: #f6f6f6 2px solid;
`;

const ScrollBox = styled.div`
  /* background-color: red; */
  height: 100%;

  display: flex;
  flex-direction: column;
`;

const CommentBox = styled.div`
  width: 100%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;

  margin-top: 10px;
`;

const DivBox = styled.div`
  /* background-color: pink; */
  display: flex;
  flex-direction: column;
  border: 0px;
`;

const Box = styled.div`
  margin-left: 20px;
  display: flex;
  align-items: center;
`;

const AText = styled.div`
  margin-bottom: 5px;
  font-size: 13px;
  font-weight: 800;
`;

const FatText = styled.div`
  font-weight: 500;
`;
const Text = styled.div`
  width: 80%;
  font-size: 13px;
  margin-right: auto;
`;

const CommentText = styled.div`
  font-weight: 300;
`;

const DivThree = styled.div`
  width: 100%;
  height: 100px;
  padding-left: 5px;
  border-bottom: #f6f6f6 2px solid;
  border-left: ${(props) => props.theme.boxBorder};
`;

const Icon = styled.div`
  cursor: pointer;
  margin-right: 10px;
`;

const DivFour = styled.div`
  width: 100%;
  height: 60px;
  border-left: ${(props) => props.theme.boxBorder};
  display: flex;
  padding-left: 20px;
  align-items: center;
  /* background-color: white; */
`;

const PostCommentContainer = styled.div`
  /* border-top: 1px solid ${(props) => props.theme.borderColor}; */
`;

const PostCommentInput = styled.input`
  width: 100%;
  /* background-color: red; */
  &::placeholder {
    font-size: 13px;
  }
`;

const InsideIcon = styled.div`
  width: 100%;
  display: flex;
  margin-left: 15px;
  margin-top: 15px;
`;

const renderThumb = ({ style, ...props }) => {
  const thumbStyle = {
    borderRadius: 6,
    backgroundColor: "rgba(35, 49, 86, 0.8)",
  };
  return <div style={{ ...style, ...thumbStyle }} {...props} />;
};

const renderThumb_h = ({ style, ...props }) => {
  const thumbStyle = {
    borderRadius: 6,
    backgroundColor: "black",
  };
  return <div style={{ ...style, ...thumbStyle }} {...props} />;
};

const CustomScrollbars = (props) => (
  <Scrollbars
    renderThumbHorizontal={renderThumb_h}
    renderThumbVertical={renderThumb}
    {...props}
  />
);

// const ScrollComment = styled(ReactShadowScroll)`
//   scrollwidth: 5;
// `;

// user: { username, avatar },

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($photoId: Int!, $payload: String!) {
    createComment(photoId: $photoId, payload: $payload) {
      ok
      error
      id
    }
  }
`;

const ModalScreen = ({
  user,
  file,
  comments,
  isLiked,
  toggleLikeMutation,
  photoId,
}) => {
  const { register, handleSubmit, setValue, getValues } = useForm();
  const createCommentUpdate = (cache, result) => {
    const { payload } = getValues();
    setValue("payload", "");
    //이거 안써주면 글씨가 안지워짐...

    //밑에는 like와 똑같이 캐쉬에 modify적용해서 있던 내용넣고
    //추가내용 업데이트 하는 형식이다
    const {
      data: {
        createComment: { ok, id },
      },
    } = result;
    if (ok && user) {
      const newComment = {
        //여기는 apollo 캐쉬 쪽의 오브젝트 형태와 똑같아야한다!!
        //하나라도 틀리면 업데이트 안됨
        __typename: "Comment",
        createdAt: Date.now() + "",
        //create는 string을 요구함
        id,
        isMine: true,
        payload,
        user: {
          ...user,
        },
      }; //6가지 똑같이 적어줌..inspect의 apollo 캐쉬랑

      const newCacheComment = cache.writeFragment({
        //newCacheComment console.log하면 __ref:comment10 이렇게나옴
        data: newComment,
        fragment: gql`
          fragment anyName on Comment {
            # on Comment는 우리가 어느 영역에 추가할건지 적어야함! like처럼!
            # ex)fragment anyName on Photo {
            # isLiked
            # likes
            # }

            # 이걸 해줘야 ref:comment:1 이렇게 적힘
            # 그리고 캐쉬에도 comment:1이 생김!!
            id
            createdAt
            isMine
            payload
            user {
              username
              avatar
            }
          }
        `,
      });

      cache.modify({
        //포토안에 새로운 comments를 넣어줘야하는것임!
        //내용은 comment:1 같은 곳에 있음!
        id: `Photo:${photoId}`,
        fields: {
          comments(prev) {
            console.log("prev", prev);
            return [...prev, newCacheComment];
            //newCacheComment console.log하면 __ref:comment10 이렇게나오는걸 추가하는것임
          },
          commentNumber(prev) {
            return prev + 1;
          },
        },
      });
    }
  };

  const [createCommentMutation, { loading }] = useMutation(
    CREATE_COMMENT_MUTATION,
    {
      update: createCommentUpdate,
    }
  );

  const onSubmitValid = (data) => {
    const { payload } = data;
    if (loading) {
      return;
    }
    createCommentMutation({
      variables: {
        photoId,
        payload,
      },
    });
  };

  return (
    <div>
      <Div>
        <Inside bg={file}></Inside>
        <InsideSecond>
          <DivOne>
            <Link to={`/users/${user?.username}`}>
              <CircleAvatar src={user?.avatar} />
            </Link>
            <UserInfo>
              <UserName>{user?.username}</UserName>
              <UserEmail>{user?.email}</UserEmail>
            </UserInfo>
          </DivOne>
          <DivTwo>
            <CustomScrollbars
              autoHide
              autoHideTimeout={500}
              autoHideDuration={200}
            >
              <ScrollBox>
                {comments &&
                  comments?.map((comment, index) => (
                    <CommentBox key={index}>
                      <Box>
                        <CircleAvatar src={comment?.user?.avatar} />
                      </Box>
                      <DivBox>
                        <AText>{comment?.user?.username}</AText>
                        <Text>
                          <CommentText>{comment?.payload}</CommentText>
                        </Text>
                      </DivBox>
                    </CommentBox>
                  ))}
              </ScrollBox>
            </CustomScrollbars>
          </DivTwo>
          <DivThree>
            <InsideIcon>
              <Icon>
                <FontAwesomeIcon
                  style={{ color: isLiked ? "tomato" : "inherit" }}
                  icon={isLiked ? SolidHeart : faHeart}
                  onClick={toggleLikeMutation}
                  size="2x"
                />
              </Icon>
              <Icon>
                <FontAwesomeIcon icon={faComment} size="2x" />
              </Icon>
              <Icon>
                <FontAwesomeIcon icon={faPaperPlane} size="2x" />
              </Icon>
            </InsideIcon>
          </DivThree>
          <DivFour>
            <PostCommentContainer>
              <form onSubmit={handleSubmit(onSubmitValid)}>
                <PostCommentInput
                  name="payload"
                  ref={register({ required: true })}
                  type="text"
                  placeholder="Write a comment..."
                />
              </form>
            </PostCommentContainer>
          </DivFour>
        </InsideSecond>
      </Div>
    </div>
  );
};

export default ModalScreen;
