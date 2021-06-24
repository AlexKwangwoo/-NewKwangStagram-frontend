import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { useEffect } from "react";
import { isLoggedInVar, logUserOut } from "../apollo";

export const ME_QUERY = gql`
  query me {
    me {
      id
      firstName
      lastName
      bio
      username
      avatar
      email
      totalFollowing
      totalFollowers
    }
  }
`;

function useUser() {
  //me에 대한 데이터를 준다.. 토큰이 있을시에!!
  const hasToken = useReactiveVar(isLoggedInVar);
  const { data } = useQuery(ME_QUERY, {
    skip: !hasToken,
    //로컬스토리지를 통해 로그인안하면 인정안해줌
  });
  // console.log(data);
  useEffect(() => {
    if (data?.me === null) {
      logUserOut();
      //거짓 토큰을 들고있으면  로그아웃시킬것임..
      //올바른 토큰을 보냈다면 백앤드에서 (me)를 통해 유저 데이터를 보냈을것임
    }
  }, [data]);
  return { data };
  //data를 포함한 오브젝트{} 를 보내줌.. []는 배열
}
export default useUser;
