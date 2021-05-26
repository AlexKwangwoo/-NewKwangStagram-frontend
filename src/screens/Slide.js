import { gql, useQuery } from "@apollo/client";
import styled from "styled-components";
import { Slider as SliderFixed } from "infinite-react-carousel";

const SlideAvatar = styled.div`
  display: flex;
  width: 20px;
  height: 60px;
  background-color: yellow;

  justify-content: center;
  align-items: center;
`;

const CircleAvatar = styled.div`
  width: 20px;
  height: 20px;

  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
`;

const settings = {
  slidesToShow: 7,
  arrowsBlock: false,
  autoplay: true,
  autoplayScroll: 2,
  autoplaySpeed: 2000,
  duration: 500,
};

const ALLUSER_QUERY = gql`
  query allUser {
    allUser {
      id
      username
      avatar
    }
  }
`;

function Slide() {
  const { data, loading } = useQuery(ALLUSER_QUERY);

  return (
    <div>
      {data?.allUser?.map((user) => (
        <SlideAvatar key={user.id}>
          <CircleAvatar src={user?.avatar} />
          {user?.username}
        </SlideAvatar>
      ))}
    </div>
  );
}
export default Slide;
