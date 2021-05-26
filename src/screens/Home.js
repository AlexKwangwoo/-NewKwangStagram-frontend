import { gql, useQuery } from "@apollo/client";
import Photo from "../components/feed/Photo";
import PageTitle from "../components/PageTitle";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragments";
import { Slider as SliderFixed } from "infinite-react-carousel";
import styled from "styled-components";
import useUser from "../hooks/useUser";

const FEED_QUERY = gql`
  query seeFeed($offset: Int!) {
    seeFeed(offset: $offset) {
      ...PhotoFragment
      user {
        username
        avatar
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

const HomeContainer = styled.div`
  display: flex;
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

const settings = {
  slidesToShow: 7,
  arrowsBlock: false,
  autoplay: true,
  autoplayScroll: 2,
  autoplaySpeed: 600,
  duration: 15000,
  arrows: true,
};

const SlideAvatar = styled.div`
  width: 20px;
  height: 100%;
  margin-top: 10px;
  text-align: center;
`;

const CircleAvatar = styled.div`
  width: 51px;
  height: 51px;
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
  margin-top: -18px;

  width: 500px;
  background-color: red;
`;

const UserName = styled.div`
  margin-top: 2px;
`;

const Text = styled.div`
  width: 20px;
  height: 20px;
  background-color: red;
`;

const SuggestionText = styled.div``;

const Me = styled.div``;
const Suggestions = styled.div``;

const RightFooter = styled.div``;

const Info = styled.div``;

const InfoLast = styled.div``;
function Home() {
  const { data: isMe } = useQuery(ISME_QUERY);
  const { data: allUserFound } = useQuery(ALLUSER_QUERY);
  const { data } = useQuery(FEED_QUERY, {
    variables: {
      offset: 0,
    },
  });

  console.log("isMe", isMe);

  return (
    <HomeContainer>
      <PageTitle title="Home" />

      <Left>
        {allUserFound && (
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
        )}

        {data?.seeFeed?.map((photo) => (
          <Photo key={photo.id} {...photo} />
        ))}
      </Left>
      <Right>
        <Me> {isMe?.me?.username}</Me>
        <Suggestions>
          <SuggestionText>Suggestion For You</SuggestionText>
        </Suggestions>
        <RightFooter>
          <Info>
            About &middot; Help &middot; Press &middot; API &middot; Jobs
            &middot; Privacy &middot; Terms &middot; Locations &middot;
          </Info>
          <Info>Top Accounts &middot; Hashtags &middot; Language</Info>
          <InfoLast>© 2021 KWANGSTAGRAM FROM KWANGCOMPANY</InfoLast>
        </RightFooter>
      </Right>
    </HomeContainer>
  );
}
export default Home;
