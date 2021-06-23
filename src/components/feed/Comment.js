import { gql, useMutation } from "@apollo/client";
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClosedCaptioning, faTimes } from "@fortawesome/free-solid-svg-icons";
const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($id: Int!) {
    deleteComment(id: $id) {
      ok
    }
  }
`;

const CommentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 7px;
`;
const CommentCaption = styled.span`
  margin-left: 10px;
  a {
    background-color: inherit;
    color: ${(props) => props.theme.accent};
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
  /* 해쉬태그 클릭가능하게 해줌! */
`;

const Icon = styled.div`
  cursor: pointer;
  display: flex;
  color: #666464;
`;

const FatText = styled.span`
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`;

function Comment({ id, photoId, isMine, author, payload }) {
  // let cleanedPayload;
  // if (payload) {
  //   cleanedPayload = sanitizeHtml(
  //     payload.replace(/#[\w]+/g, "<mark>$&</mark>"),
  //     {
  //       allowedTags: ["mark"],
  //       // mark제외하고 아무것도 html형식으로 못넣게 할것임!
  //       // ex p나 img 같은걸 없애줌..필터해줌!
  //     }
  //   );
  // }
  const updateDeleteComment = (cache, result) => {
    const {
      data: {
        deleteComment: { ok },
      },
    } = result;
    if (ok) {
      cache.evict({ id: `Comment:${id}` });
      //캐쉬에 있는 comment:10 을 삭제!!
      //그래서 photo comment 배열에서 __ref:comment:10 남아있어도 본체가 지워졌기에 괜찮음!!
      cache.modify({
        id: `Photo:${photoId}`,
        //아폴로 캐쉬의 포토에 있는 commentNumber갯수를 줄여줘야함
        fields: {
          commentNumber(prev) {
            return prev - 1;
          },
        },
      });
    }
  };
  const [deleteCommentMutation] = useMutation(DELETE_COMMENT_MUTATION, {
    variables: {
      id,
    },
    update: updateDeleteComment,
  });
  const onDeleteClick = () => {
    deleteCommentMutation();
  };

  return (
    <CommentContainer>
      <div>
        <Link to={`/users/${author}`}>
          <FatText>{author}</FatText>
        </Link>

        <CommentCaption>
          {payload?.split(" ").map((word, index) =>
            //먼저 문장이 있다면 띄워쓰기 기준으로 배열을 만들것임!
            /#[\w]+/.test(word) ? (
              // test를 통해 #~ 이 포함된 단어를 false true로 추출해낸다
              <React.Fragment key={index}>
                {/* true면 링크를 걸어줄것임! */}
                <Link to={`/search/${word.split("#")[1]}`}>{word} </Link>
              </React.Fragment>
            ) : (
              // <></> 이거는 index같은걸 못가짐 그래서 React.Fragment 이걸씀
              <React.Fragment key={index}>{word} </React.Fragment>
            )
          )}
        </CommentCaption>
      </div>
      {isMine ? (
        <Icon>
          <FontAwesomeIcon onClick={onDeleteClick} icon={faTimes} size="sm" />
        </Icon>
      ) : null}

      {/* <CommentCaption>
        {payload.split(" ").map((word, index) =>
          /#[\w]+/.test(word) ? (
            <React.Fragment key={index}>
              <Link to={`/hashtags/${word}`}>{word}</Link>{" "}
            </React.Fragment>
          ) : (
            <React.Fragment key={index}>{word} </React.Fragment>
          )
        )}
      </CommentCaption> */}
      {/* <CommentCaption
        dangerouslySetInnerHTML={{
          // 여기서 html로 해석될수있게 만들어줌!
          //이거전에 sznitizHtml을 써서 허용범위만 만들어줄것임
          //문제는 링크를 못만들어서 폐지..
          __html: cleanedPayload,
        }}
      /> */}
    </CommentContainer>
  );
}

Comment.propTypes = {
  isMine: PropTypes.bool,
  id: PropTypes.number,
  photoId: PropTypes.number,
  author: PropTypes.string.isRequired,
  payload: PropTypes.string,
};

export default Comment;
