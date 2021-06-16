import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import Photo from "../components/feed/Photo";
import PageTitle from "../components/PageTitle";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragments";
import { Slider as SliderFixed } from "infinite-react-carousel";
import styled from "styled-components";
import { useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { Link } from "react-router-dom";
import useUser from "../hooks/useUser";

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

const ALLUSER_QUERY = gql`
  query allUser {
    allUser {
      id
      username
      avatar
    }
  }
`;

const ISME_QUERY = gql`
  query me {
    me {
      id
      username
      avatar
      email
      following {
        username
        avatar
      }
      followers {
        username
        avatar
      }
    }
  }
`;

const FOLLOW_USER_MUTATION = gql`
  mutation followUser($username: String!) {
    followUser(username: $username) {
      ok
    }
  }
`;

const UNFOLLOW_USER_MUTATION = gql`
  mutation unfollowUser($username: String!) {
    unfollowUser(username: $username) {
      ok
    }
  }
`;

const HomeContainer = styled.div`
  display: flex;
  padding-top: 60px;
`;

const SlideOnTopSpace = styled.div`
  background-color: white;
  border: 0.5px solid #dbdbdb;
  border-radius: 3px;
  max-width: 615px;
  height: 100px;
  margin-bottom: 26px;
  margin-top: -18px;
  padding-top: 5px;
  font-size: 11px;
  a {
    color: inherit;
  }
`;

const DivBox = styled.div`
  background-color: white;
  border: 0.5px solid #dbdbdb;
  border-radius: 3px;
  width: 615px;
  height: 100px;
  margin-bottom: 26px;
  margin-top: -18px;
  padding-top: 5px;
  font-size: 11px;
  a {
    color: inherit;
  }
`;

const SlideAvatar = styled.div`
  margin-top: 10px;
  text-align: center;
  /* background-color: red; */
`;

const CircleAvatar = styled.div`
  width: 50px;
  height: 50px;
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
  width: 60px;
  height: 60px;
  border: 3px solid #c42d91;
  border-radius: 50px;
`;

const Left = styled.div``;

const Right = styled.div`
  width: 100%;
  padding-top: 15px;
  padding-left: 30px;
  margin-top: -18px;
  width: 500px;

  position: relative;
`;

const RightInside = styled.div`
  position: fixed;
  /* left: 1000px; */
`;

const UserName = styled.div`
  margin-top: 2px;
`;

const Text = styled.div`
  width: 20px;
  height: 20px;
`;

const Me = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 25px;
`;

const LeftSideAvatar = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50px;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
`;

const LeftSideMyInfoBox = styled.div`
  margin-left: 10px;
`;

const LeftSideMyName = styled.div`
  margin-bottom: 3px;

  font-weight: 600;
`;

const LeftSideMyEmail = styled.div`
  color: #8f8f8f;
  font-weight: 400;
`;

const Suggestions = styled.div``;

const SuggestionText = styled.div`
  color: #8f8f8f;
  font-weight: 600;
`;

const SuggestionBox = styled.div`
  margin-top: 20px;
`;

const FollowerBox = styled.div`
  &:first-child {
    margin-top: 0px;
  }
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FollowerLeft = styled.div`
  display: flex;
  align-items: center;
`;

const FollowerRight = styled.div`
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: #26a5f6;

  padding-right: 20px;
`;

const SuggestionAvatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50px;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
`;

const SuggestionInfo = styled.div`
  margin-left: 15px;
`;
const SuggestionUsername = styled.div`
  margin-bottom: 3px;
  font-weight: 600;
`;
const SuggestionLetter = styled.div`
  color: #8f8f8f;
  font-weight: 500;
  font-size: 12px;
`;

const RightFooter = styled.div`
  margin-top: 30px;
`;

const Info = styled.div`
  color: #c7c7c7;
  font-size: 11px;
  margin-bottom: 7px;
`;

const InfoLast = styled.div`
  color: #c7c7c7;
  font-size: 12px;
  margin-top: 17px;
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

function Home() {
  const { data: userData } = useUser();

  const { data: isMe } = useQuery(ISME_QUERY);
  const { data: allUserFound } = useQuery(ALLUSER_QUERY);
  const client = useApolloClient();

  const { data } = useQuery(FEED_QUERY, {
    refetchQueries: [{ query: ISME_QUERY, variables: null }],
  });

  const ShowSlide = (allUserFound) => {
    const settings2 = {
      slidesToShow: 7,
      arrowsBlock: false,
      autoplay: true,
      autoplayScroll: 1,
      autoplaySpeed: 800,
      duration: 15000,
      arrows: false,
    };
    return (
      <SliderFixed {...settings2}>
        {allUserFound?.allUser?.map((user) => (
          <SlideAvatar key={user.id}>
            <Link to={`/users/${user?.username}`}>
              <CircleAvatarBox>
                <CircleAvatar src={user?.avatar} />
              </CircleAvatarBox>
            </Link>
            <Link to={`/users/${user?.username}`}>
              <UserName>{user?.username}</UserName>
            </Link>
          </SlideAvatar>
        ))}
      </SliderFixed>
    );
  };

  useEffect(() => {
    ShowSlide(allUserFound);
  }, [allUserFound]);

  // const allUserFoundExceptMe = allUserFound?.filter(
  //   (user) => isMe.username !== user.username
  // );

  // console.log("allUserFoundExceptMe", allUserFoundExceptMe);

  // ------------------------------follow unFollow------------------------------
  const unfollowUserUpdate = (username) => {
    // 업데이트는 캐쉬를 가져올수있음!

    const { cache } = client;
    cache.modify({
      id: `User:${username}`,
      fields: {
        isFollowing(prev) {
          return false;
        },
        totalFollowers(prev) {
          return prev - 1;
        },
      },
    });
    // const { me } = userData;
    cache.modify({
      id: `User:${userData?.me?.username}`,
      fields: {
        totalFollowing(prev) {
          return prev - 1;
        },
      },
    });
  };

  const [unfollowUser] = useMutation(UNFOLLOW_USER_MUTATION, {
    refetchQueries: [{ query: ISME_QUERY, variables: null }],

    // refetchQueries: [{ query: SEE_PROFILE_QUERY, variables: { username } }],
    // 리페치 방법
  });

  const followUserCompleted = (username) => {
    // const {
    //   followUser: { ok },
    // } = data;
    // console.log("캐쉬data", data);
    // console.log("캐쉬data username", username);
    // if (!ok) {
    //   return;
    // }
    const { cache } = client;
    cache.modify({
      id: `User:${username}`,
      fields: {
        isFollowing(prev) {
          return true;
        },
        totalFollowers(prev) {
          return prev + 1;
        },
      },
    });

    // const { me } = userData;
    cache.modify({
      id: `User:${userData?.me?.username}`,
      fields: {
        totalFollowing(prev) {
          return prev + 1;
        },
      },
    });
  };
  const [followUser] = useMutation(FOLLOW_USER_MUTATION, {
    refetchQueries: [{ query: ISME_QUERY, variables: null }],
    // onCompleted: followUserCompleted,
    // refetchQueries: [{ query: SEE_PROFILE_QUERY, variables: { username } }],
    // 리페치 방법
  });

  const UnFollowBTN = (username) => {
    // console.log("unfollow");
    unfollowUser({ variables: { username } });
    unfollowUserUpdate(username);
    return null;
  };

  const FollowBTN = (username) => {
    // console.log("follow");
    followUser({ variables: { username } });
    followUserCompleted(username);
    return null;
  };

  // console.log("data", data);

  return (
    <HomeContainer>
      <PageTitle title="Home" />

      <Left>
        {allUserFound && <DivBox>{ShowSlide(allUserFound)}</DivBox>}

        {/* {allUserFound && (
          <SlideOnTopSpace>
            <SliderFixed {...settings}>
              {allUserFound?.allUser?.map((user) => (
                <SlideAvatar key={user.id}>
                  <CircleAvatarBox>
                    <CircleAvatar src={user?.avatar} />
                  </CircleAvatarBox>
                  <UserName>{user?.username}</UserName>
                </SlideAvatar>
              ))}
            </SliderFixed>
          </SlideOnTopSpace>
        )} */}

        {data?.seeFeedNoOffset?.map((photo) => (
          <Photo key={photo.id} {...photo} />
        ))}
      </Left>
      <Right>
        <RightInside>
          <Me>
            <Link to={`/users/${isMe?.me?.username}`}>
              <LeftSideAvatar src={isMe?.me?.avatar} />
            </Link>
            <Link to={`/users/${isMe?.me?.username}`}>
              <LeftSideMyInfoBox>
                <LeftSideMyName>{isMe?.me?.username}</LeftSideMyName>
                <LeftSideMyEmail>{isMe?.me?.email}</LeftSideMyEmail>
              </LeftSideMyInfoBox>{" "}
            </Link>
          </Me>
          <Suggestions>
            <SuggestionText>Suggestion For You</SuggestionText>
            <SuggestionBox>
              <CustomScrollbars
                style={{ width: 300, height: 350 }}
                autoHide
                autoHideTimeout={500}
                autoHideDuration={200}
              >
                {isMe?.me?.followers?.length >= 7
                  ? isMe?.me?.followers?.map((follower) => (
                      <FollowerBox key={follower.id}>
                        <FollowerLeft>
                          <Link to={`/users/${follower.username}`}>
                            <SuggestionAvatar src={follower.avatar} />
                          </Link>
                          <SuggestionInfo>
                            <Link to={`/users/${follower.username}`}>
                              <SuggestionUsername>
                                {follower.username}
                              </SuggestionUsername>
                            </Link>
                            <SuggestionLetter>Follows you</SuggestionLetter>
                          </SuggestionInfo>
                        </FollowerLeft>
                        {isMe?.me?.following.filter(
                          (myFollowing) =>
                            myFollowing.username === follower.username
                        ).length > 0 ? (
                          <FollowerRight
                            onClick={() => UnFollowBTN(follower.username)}
                          >
                            Unfollow
                          </FollowerRight>
                        ) : (
                          <FollowerRight
                            onClick={() => FollowBTN(follower.username)}
                          >
                            Follow
                          </FollowerRight>
                        )}
                      </FollowerBox>
                    ))
                  : allUserFound?.allUser?.map((otherUser) => (
                      <FollowerBox key={otherUser.id}>
                        <FollowerLeft>
                          <Link to={`/users/${otherUser.username}`}>
                            <SuggestionAvatar src={otherUser.avatar} />{" "}
                          </Link>
                          <SuggestionInfo>
                            <Link to={`/users/${otherUser.username}`}>
                              <SuggestionUsername>
                                {otherUser.username}
                              </SuggestionUsername>{" "}
                            </Link>
                            <SuggestionLetter>Follows you</SuggestionLetter>
                          </SuggestionInfo>
                        </FollowerLeft>
                        {isMe?.me?.following.filter(
                          (myFolloweing) =>
                            myFolloweing.username === otherUser.username
                        ).length > 0 ? (
                          <FollowerRight
                            onClick={() => UnFollowBTN(otherUser.username)}
                          >
                            Unfollow
                          </FollowerRight>
                        ) : (
                          <FollowerRight
                            onClick={() => FollowBTN(otherUser.username)}
                          >
                            Follow
                          </FollowerRight>
                        )}
                      </FollowerBox>
                    ))}
              </CustomScrollbars>
            </SuggestionBox>
          </Suggestions>

          <RightFooter>
            <Info>
              About &middot; Help &middot; Press &middot; API &middot; Jobs
              &middot; Privacy &middot; Terms &middot;
            </Info>
            <Info>Top Accounts &middot; Hashtags &middot; Language</Info>
            <InfoLast>© 2021 KWANGSTAGRAM FROM KWANGCOMPANY</InfoLast>
          </RightFooter>
        </RightInside>
      </Right>
    </HomeContainer>
  );
}
export default Home;
