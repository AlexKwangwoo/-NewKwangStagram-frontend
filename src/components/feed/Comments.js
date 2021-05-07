import PropTypes from "prop-types";
import styled from "styled-components";
import Comment from "./Comment";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import useUser from "../../hooks/useUser";

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($photoId: Int!, $payload: String!) {
    createComment(photoId: $photoId, payload: $payload) {
      ok
      error
      id
    }
  }
`;

const CommentsContainer = styled.div`
  margin-top: 20px;
`;
const CommentCount = styled.span`
  opacity: 0.7;
  margin: 10px 0px;
  display: block;
  font-weight: 600;
  font-size: 10px;
`;

const PostCommentContainer = styled.div`
  margin-top: 10px;
  padding-top: 15px;
  padding-bottom: 10px;
  border-top: 1px solid ${(props) => props.theme.borderColor};
`;

const PostCommentInput = styled.input`
  width: 100%;
  &::placeholder {
    font-size: 12px;
  }
`;

function Comments({ photoId, author, caption, commentNumber, comments }) {
  const { data: userData } = useUser();
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
    if (ok && userData?.me) {
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
          ...userData.me,
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
    <CommentsContainer>
      <Comment author={author} payload={caption} />
      <CommentCount>
        {commentNumber === 1 ? "1 comment" : `${commentNumber} comments`}
      </CommentCount>
      {comments?.map((comment) => (
        <Comment
          key={comment.id}
          id={comment.id}
          photoId={photoId}
          author={comment.user.username}
          payload={comment.payload}
          isMine={comment.isMine}
        />
      ))}
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
    </CommentsContainer>
  );
}

Comments.propTypes = {
  photoId: PropTypes.number.isRequired,
  author: PropTypes.string.isRequired,
  caption: PropTypes.string,
  commentNumber: PropTypes.number.isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      user: PropTypes.shape({
        avatar: PropTypes.string,
        username: PropTypes.string.isRequired,
      }),
      payload: PropTypes.string.isRequired,
      isMine: PropTypes.bool.isRequired,
      createdAt: PropTypes.string.isRequired,
    })
  ),
};

export default Comments;
