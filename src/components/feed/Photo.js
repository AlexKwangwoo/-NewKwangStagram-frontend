import { gql, useMutation } from "@apollo/client";
import {
  faBookmark,
  faComment,
  faPaperPlane,
  faHeart,
} from "@fortawesome/free-regular-svg-icons";
import { faHeart as SolidHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import styled from "styled-components";
import Avatar from "../Avatar";
import { FatText } from "../shared";
import Comments from "./Comments";
import { Link } from "react-router-dom";

const TOGGLE_LIKE_MUTATION = gql`
  mutation toggleLike($id: Int!) {
    toggleLike(id: $id) {
      ok
      error
    }
  }
`;

const PhotoContainer = styled.div`
  background-color: white;
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.borderColor};
  margin-bottom: 60px;
  max-width: 615px;
`;
const PhotoHeader = styled.div`
  padding: 10px 12px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(239, 239, 239);
`;

const Username = styled(FatText)`
  margin-left: 15px;
`;

const PhotoFile = styled.div`
  min-width: 100%;
  width: 610px;
  height: 610px;
  max-width: 610px;
  max-height: 610px;
  background-color: red;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
`;

const PhotoData = styled.div`
  padding: 12px 15px;
`;

const PhotoActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  div {
    display: flex;
    align-items: center;
  }
  svg {
    font-size: 20px;
  }
`;

const PhotoAction = styled.div`
  margin-right: 10px;
  cursor: pointer;
`;

const Likes = styled(FatText)`
  margin-top: 15px;
  display: block;
`;

const CircleAvatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50px;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
`;

const CircleAvatarBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  width: 40px;
  height: 40px;
  border: 2px solid #c42d91;
  border-radius: 50px;
`;

function Photo({
  id,
  user,
  file,
  isLiked,
  likes,
  caption,
  commentNumber,
  comments,
}) {
  console.log("filefilefile", file);
  const updateToggleLike = (cache, result) => {
    //update가 되면 여기가 실행될것임.. 마치 onComplete처럼
    const {
      data: {
        toggleLike: { ok },
      },
    } = result;
    if (ok) {
      const photoId = `Photo:${id}`;
      cache.modify({
        id: photoId,
        fields: {
          isLiked(prev) {
            //prev 현재 isLiked의 불린값!
            //필드 이름을 똑같이 써주고 필드이름+(prev) 를통해 이전값을 조정가능!
            //무조건 같은 이름에 +(prev)를 써줘야한다!
            return !prev;
          },
          likes(prev) {
            //prev likes 갯수!
            if (isLiked) {
              // 좋아했다면 한번누르면 반대는 -1
              return prev - 1;
            }
            return prev + 1;
          },
        },
      });
      //---------밑에보다 더새로운 방법으로 해보겠음=--------
      // const fragmentId = `Photo:${id}`;
      // const fragment = gql`
      //   fragment BSName on Photo {
      //     isLiked
      //     likes
      //     # 바꾸고싶은부분 쓰고
      //   }
      // `;
      // const result = cache.readFragment({
      //   id: fragmentId,
      //   fragment,
      // });
      // if ("isLiked" in result && "likes" in result) {
      //   const { isLiked: cacheIsLiked, likes: cacheLikes } = result;
      //   //캐쉬에있는 기존 저장값 가져오기+변수명 바꿔주기!
      //   cache.writeFragment({
      //     id: fragmentId,
      //     fragment,
      //     data: {
      //       // 바꾸고 싶은부분의 데이타 변경!
      //       isLiked: !cacheIsLiked,
      //       likes: cacheIsLiked ? cacheLikes - 1 : cacheLikes + 1,
      //       //캐쉬에서 기존에 저장된 라이크 수에서 바꿔준다!
      //     },
      //   });
      // }
    }
  };
  const [toggleLikeMutation] = useMutation(TOGGLE_LIKE_MUTATION, {
    variables: {
      id,
    },
    update: updateToggleLike,
    // refetchQueries
  });
  return (
    <PhotoContainer key={id}>
      <PhotoHeader>
        <Link to={`/users/${user.username}`}>
          <CircleAvatarBox>
            <CircleAvatar src={user?.avatar} />
          </CircleAvatarBox>
        </Link>
        <Link to={`/users/${user.username}`}>
          <Username>{user.username}</Username>
        </Link>
      </PhotoHeader>
      <PhotoFile src={file} />
      <PhotoData>
        <PhotoActions>
          <div>
            <PhotoAction onClick={toggleLikeMutation}>
              <FontAwesomeIcon
                style={{ color: isLiked ? "tomato" : "inherit" }}
                icon={isLiked ? SolidHeart : faHeart}
              />
            </PhotoAction>
            <PhotoAction>
              <FontAwesomeIcon icon={faComment} />
            </PhotoAction>
            <PhotoAction>
              <FontAwesomeIcon icon={faPaperPlane} />
            </PhotoAction>
          </div>
          <div>
            <FontAwesomeIcon icon={faBookmark} />
          </div>
        </PhotoActions>
        <Likes>{likes === 1 ? "1 like" : `${likes} likes`}</Likes>
        <Comments
          photoId={id}
          author={user.username}
          caption={caption}
          commentNumber={commentNumber}
          comments={comments}
        />
      </PhotoData>
    </PhotoContainer>
  );
}

Photo.propTypes = {
  id: PropTypes.number.isRequired,
  user: PropTypes.shape({
    // shape는 오브젝트 타입
    avatar: PropTypes.string,
    username: PropTypes.string.isRequired,
  }),
  caption: PropTypes.string,
  commentNumber: PropTypes.number.isRequired,
  file: PropTypes.string.isRequired,
  isLiked: PropTypes.bool.isRequired,
  likes: PropTypes.number.isRequired,
};
export default Photo;
