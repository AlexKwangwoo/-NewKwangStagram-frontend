import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { faThemeco } from "@fortawesome/free-brands-svg-icons";
import {
  faHeart,
  faComment,
  faBoxes,
  faTh,
  faBorderAll,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Button2 from "../components/auth/Button2";
import PageTitle from "../components/PageTitle";
import { FatText } from "../components/shared";
import { PHOTO_FRAGMENT } from "../fragments";
import useUser, { ME_QUERY } from "../hooks/useUser";

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

const SEE_PROFILE_QUERY = gql`
  query seeProfile($username: String!) {
    seeProfile(username: $username) {
      id
      # 아폴로 캐쉬 apollo,js 가서 확인하면 id 안써도됨
      firstName
      lastName
      username
      bio
      avatar
      photos {
        ...PhotoFragment
      }
      totalFollowing
      totalFollowers
      isMe
      followers {
        username
      }
      isFollowing
    }
  }
  ${PHOTO_FRAGMENT}
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

const ProfileContainer = styled.div`
  padding-top: 60px;
`;
const Header = styled.div`
  display: flex;
  margin-bottom: 40px;
`;
const Avatar = styled.div`
  margin-left: 50px;
  height: 160px;
  width: 160px;
  border-radius: 50%;
  margin-right: 150px;
  background-image: url(${(props) => props.src});
  background-position: center;
  background-size: cover;
  /* background-color: #2c2c2c; */
`;
const Column = styled.div`
  width: 330px;
`;
const Username = styled.h3`
  font-size: 28px;
  font-weight: 400;
  margin-right: 40px;
`;
const Row = styled.div`
  margin-bottom: 20px;
  font-size: 16px;
  display: flex;
  align-items: center;
`;
const List = styled.ul`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
const Item = styled.li`
  font-size: 15px;
`;
const Value = styled(FatText)`
  font-size: 15px;
`;
const Name = styled(FatText)`
  font-size: 15px;
  margin-bottom: -15px;
`;
const Grid = styled.div`
  display: grid;
  grid-auto-rows: 290px;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 50px;
`;
const Photo = styled.div`
  background-image: url(${(props) => props.bg});
  background-size: cover;
  position: relative;
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

const Line = styled.div`
  width: 100%;
  height: 0;
  border: 0.1px solid;
  border-color: #e5e5e5;
`;

const LineU = styled.div`
  width: 10%;
  margin: auto;
  height: 0;
  border: 0.1px solid;
  border-color: #6e6e6e;
`;

const LineT = styled.div`
  width: 10%;
  margin: auto;
  height: 0;
  border: 0.1px solid;
  border-color: #6e6e6e;
  margin-bottom: 10px;
`;

const Text = styled.p`
  font-weight: 600;
  font-size: 16px;
  margin: auto;
  text-align: center;
  margin-bottom: 40px;
`;

const PostText = styled.div`
  display: inline-block;
  margin-left: 5px;
`;

const FirstRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const LogoutBtn = styled.button``;

const ProfileBtn = styled(Button2).attrs({
  as: "span",
})`
  margin-left: 20px;
  cursor: pointer;
  padding: 10px 5px;
  font-size: 13px;
`;

const BioBox = styled.div`
  font-size: 18px;
`;

function Profile() {
  const { username } = useParams();
  const { data: userData } = useUser();
  const client = useApolloClient();

  const { data, loading } = useQuery(SEE_PROFILE_QUERY, {
    variables: {
      username,
    },
  });

  const { data: isMeQueryData, loading: isMeQueryDataLoading } =
    useQuery(ISME_QUERY);

  // console.log("Profile", data);

  const unfollowUserUpdate = (cache, result) => {
    // 업데이트는 캐쉬를 가져올수있음!
    const {
      data: {
        unfollowUser: { ok },
      },
    } = result;
    if (!ok) {
      return;
    }
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

    const { me } = userData;
    cache.modify({
      id: `User:${me.username}`,
      fields: {
        totalFollowing(prev) {
          return prev - 1;
        },
      },
    });
  };

  const [unfollowUser] = useMutation(UNFOLLOW_USER_MUTATION, {
    variables: {
      username,
    },
    refetchQueries: [{ query: ISME_QUERY, variables: null }],
    update: unfollowUserUpdate,

    // refetchQueries: [{ query: SEE_PROFILE_QUERY, variables: { username } }],
    // 리페치 방법
  });

  const followUserCompleted = (data) => {
    const {
      followUser: { ok },
    } = data;
    if (!ok) {
      return;
    }
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

    const { me } = userData;
    cache.modify({
      id: `User:${me.username}`,
      fields: {
        totalFollowing(prev) {
          return prev + 1;
        },
      },
    });
  };

  const [followUser] = useMutation(FOLLOW_USER_MUTATION, {
    variables: {
      username,
    },
    refetchQueries: [{ query: ISME_QUERY, variables: null }],
    onCompleted: followUserCompleted,
  });

  // console.log("isMeQueryData", isMeQueryData);

  const getButton = (seeProfile) => {
    const { isMe, isFollowing, username } = seeProfile;
    if (isMe) {
      return <ProfileBtn>Edit Profile</ProfileBtn>;
    }
    if (
      isMeQueryData?.me?.following.filter(
        (following) => following.username === username
      ).length > 0
    ) {
      return <ProfileBtn onClick={unfollowUser}>Unfollow</ProfileBtn>;
    } else {
      return <ProfileBtn onClick={followUser}>Follow</ProfileBtn>;
    }
  };

  const Logout = () => {
    client.clearStore();
    localStorage.removeItem("TOKEN");
    window.location.assign("/");
  };

  return (
    <ProfileContainer>
      <PageTitle
        title={
          loading ? "Loading..." : `${data?.seeProfile?.username}'s Profile`
        }
      />
      <Header>
        <Avatar src={data?.seeProfile?.avatar} />
        <Column>
          <Row>
            <FirstRow>
              <Username>{data?.seeProfile?.username}</Username>
              {data?.seeProfile ? getButton(data.seeProfile) : null}
            </FirstRow>
          </Row>
          <Row>
            <List>
              <Item>
                <span>
                  <Value>{data?.seeProfile?.photos?.length}</Value> posts
                </span>
              </Item>
              <Item>
                <span>
                  <Value>{data?.seeProfile?.totalFollowers}</Value> followers
                </span>
              </Item>
              <Item>
                <span>
                  <Value>{data?.seeProfile?.totalFollowing}</Value> following
                </span>
              </Item>
            </List>
          </Row>
          <Row>
            <Name>
              {data?.seeProfile?.firstName}
              {data?.seeProfile?.lastName}
            </Name>
          </Row>
          <Row>{data?.seeProfile?.bio}</Row>
          <LogoutBtn onClick={Logout}>Log out</LogoutBtn>
        </Column>
      </Header>
      <LineU />
      <Line />
      <LineT />
      <Text>
        <FontAwesomeIcon icon={faBorderAll} size="md" />
        <PostText>POSTS</PostText>
      </Text>

      <Grid>
        {data?.seeProfile?.photos.map((photo) => (
          <Photo key={photo.id} bg={photo.file}>
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
        ))}
      </Grid>
    </ProfileContainer>
  );
}
export default Profile;
