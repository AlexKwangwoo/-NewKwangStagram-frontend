import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { faThemeco } from "@fortawesome/free-brands-svg-icons";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragments";
import {
  faHeart,
  faComment,
  faBoxes,
  faTh,
  faBorderAll,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ModalScreenForProfile from "../components/ModalScreenForProfile";
import Modal from "react-awesome-modal";
import useUser from "../hooks/useUser";

const FEED_NO_OFFSET_QUERY = gql`
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

const Wrapper = styled.div`
  margin-top: 100px;
  width: 100%;
  height: 100%;
  margin-bottom: 50px;
  display: grid;
  grid-gap: 43px;
  grid-template-columns: repeat(4, 200px);
  grid-auto-rows: 200px;
  /* background-color: red; */
`;

// Wrapper.test:nth-child(1){

// }

const MidLoadder = styled.div`
  margin-top: -350px;
`;

const Grid = styled.div`
  &:nth-child(4) {
    grid-column: 3 / 5;
    grid-row: 1 / 3;
  }
  &:nth-child(9) {
    grid-column: 1 / 4;
    grid-row: 3 / 6;
  }
  &:nth-child(14) {
    grid-column: 2 / 4;
    grid-row: 7 / 9;
  }
`;

const Icons = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  opacity: 0;
  &:hover {
    opacity: 1;
  }
`;
const Icon = styled.span`
  font-size: 18px;
  display: flex;
  align-items: center;
  margin: 0px 5px;
  svg {
    font-size: 14px;
    margin-right: 5px;
  }
`;

const Photo = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.bg});
  background-size: cover;
  position: relative;
`;

const TOGGLE_LIKE_MUTATION = gql`
  mutation toggleLike($id: Int!) {
    toggleLike(id: $id) {
      ok
      error
    }
  }
`;

function Explore() {
  const [isLikedState, setIsLikedState] = useState();
  const [fileState, setFileState] = useState();
  const [photoIdState, setPhotoIdState] = useState();
  const [commentsState, setComentsState] = useState();
  const [visible, setVisible] = useState(false);
  const { data: userData } = useUser();
  const { data } = useQuery(FEED_NO_OFFSET_QUERY, {
    // refetchQueries: [{ query: ISME_QUERY, variables: null }],
  });

  const updateToggleLike = (cache, result) => {
    //update가 되면 여기가 실행될것임.. 마치 onComplete처럼
    console.log("실행됨");
    const {
      data: {
        toggleLike: { ok },
      },
    } = result;
    if (ok) {
      const photoId = `Photo:${photoIdState}`;
      setIsLikedState(!isLikedState);
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
            if (isLikedState) {
              // 좋아했다면 한번누르면 반대는 -1
              return prev - 1;
            }
            return prev + 1;
          },
        },
      });
    }
  };

  const [toggleLikeMutation] = useMutation(TOGGLE_LIKE_MUTATION, {
    // variables: {
    //   photoIdState,
    // },
    update: updateToggleLike,
    // refetchQueries
  });

  const client = useApolloClient();

  const openModal = (photo) => {
    document.body.style.overflow = "hidden";
    setVisible(true);
    setIsLikedState(photo.isLiked);
    setFileState(photo.file);
    setPhotoIdState(photo.id);
    setComentsState(photo.comments);
    // toggleLikeMutation({
    //   variables: { id: photoIdState },
    // });
  };
  const closeModal = () => {
    document.body.style.overflow = "unset";
    setVisible(false);
  };

  console.log("feedData", data);
  return (
    <Wrapper>
      {data?.seeFeedNoOffset?.map((photo) => (
        <Grid>
          <Photo
            key={photo.id}
            bg={photo.file}
            onClick={() => openModal(photo)}
          >
            {" "}
            <Icons>
              <Icon>
                <FontAwesomeIcon icon={faHeart} />
                {photo.likes}
              </Icon>
              <Icon>
                <FontAwesomeIcon icon={faComment} />
                {photo.commentNumber}
              </Icon>
            </Icons>
          </Photo>
        </Grid>
      ))}
      <Modal
        visible={visible}
        width="930"
        height="600"
        effect="fadeInUp"
        onClickAway={() => closeModal()}
      >
        <ModalScreenForProfile
          visible={visible}
          photoId={photoIdState}
          user={userData?.me}
          file={fileState}
          comments={commentsState}
          isLiked={isLikedState}
          setComentsState={setComentsState}
          toggleLikeMutation={toggleLikeMutation}
        />
      </Modal>
    </Wrapper>
  );
}
export default Explore;
