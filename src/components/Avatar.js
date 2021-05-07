import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";

const SAvatar = styled.div`
  width: ${(props) => (props.lg ? "30px" : "25px")};
  height: ${(props) => (props.lg ? "30px" : "25px")};
  border-radius: 50%;
  background-color: #2c2c2c;
  overflow: hidden;
`;

const Img = styled.img`
  max-width: 100%;
`;

// function Avatar({ url = null, lg = false }) {
//   return <SAvatar lg={lg}>{url !== "" ? <Img src={url} /> : null}</SAvatar>;
// }

function Avatar({ url = null, lg = false }) {
  // console.log(lg);
  //프롭에 lg없으면 false로 넣겠음!
  return (
    <>
      {url !== null ? (
        <SAvatar lg={lg}>
          <Img src={url} />
        </SAvatar>
      ) : (
        <FontAwesomeIcon icon={faUser} size={"lg"} />
      )}
    </>
  );
}
export default Avatar;
