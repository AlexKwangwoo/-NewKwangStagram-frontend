import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { faThemeco } from "@fortawesome/free-brands-svg-icons";
import { useForm } from "react-hook-form";
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
import { useParams } from "react-router-dom";
import { ReactNativeFile } from "apollo-upload-client";

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile(
    $firstName: String
    $lastName: String
    $username: String
    $email: String
    $password: String
    $bio: String
    $avatar: Upload
  ) {
    editProfile(
      firstName: $firstName
      lastName: $lastName
      username: $username
      email: $email
      password: $password
      bio: $bio
      avatar: $avatar
    ) {
      ok
      error
    }
  }
`;

const UPLOAD_AVATAR_MUTATION = gql`
  mutation uploadAvatar($file: Upload!) {
    # 프론트엔드와 모바일은 저기서 Upload! 형식이 뭔지 모른다.. 그래서 해결해줘야함
    uploadAvatar(file: $file) {
      ok
      error
    }
  }
`;

const EditProfileContainer = styled.div`
  width: 100%;
  height: 100%;
  /* background-color: red; */
  border-radius: 5px;
  padding: 20px 20px;
`;

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
`;

const CircleAvatar = styled.div`
  width: 60px;
  height: 60px;
  margin-right: 10px;
  border-radius: 50px;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
`;

const UserNameBox = styled.div`
  /* background-color: red; */
  margin-top: -10px;
`;
const UserName = styled.div`
  font-size: 18px;
  margin-bottom: 5px;
`;

const ButtonContainer = styled.div`
  position: absolute;
`;
const UserAvatarButton = styled.div`
  cursor: pointer;
  color: #5ebcf7;
  font-weight: 600;
  position: absolute;
  top: 0px;
  text-align: center;
  /* background-color: red; */
`;

const AvatarInput = styled.input`
  opacity: 0;
  width: 200px;
  position: relative;
  z-index: 1;
  cursor: pointer;
  color: #5ebcf7;
  font-weight: 600;
  background-color: yellow;
`;

const FormContainer = styled.div`
  margin-top: 20px;
  /* background-color: yellow; */
  width: 100%;
  height: 300px;
`;

const Input = styled.input`
  width: 100%;
  border-radius: 3px;
  padding: 10px;
  background-color: #fafafa;
  /* border: 0.5px solid
    ${(props) => (props.hasError ? "tomato" : props.theme.borderColor)}; */
  /* 만약 애러가있다면 빨간색 테두리!!!!! */
  border: 0.5px solid #cccbcb;
  margin-bottom: 15px;
  margin-top: 5px;
  box-sizing: border-box;
  &::placeholder {
    font-size: 12px;
  }
  &:focus {
    border-color: rgb(38, 38, 38);
  }
`;

const Button = styled.input`
  cursor: pointer;
  border: none;
  border-radius: 3px;
  margin-top: 5px;
  background-color: ${(props) => props.theme.accent};
  color: white;
  text-align: center;
  padding: 15px 0px;
  font-weight: 600;
  width: 100%;
  opacity: ${(props) => (props.disabled ? "0.2" : "1")};
`;

function EditProfile({ user, refetch, closeEditModal }) {
  const onCompleted = (data) => {
    // console.log("바꿀까?");
    if (data?.editProfile) {
      const {
        editProfile: { ok, error },
      } = data;
      if (!ok) {
        return;
      }
      //에러 만들어줘야함!!!!!!!!!!!!!!!!!!!!!
      //에러 만들어줘야함!!!!!!!!!!!!!!!!!!!!!
      //에러 만들어줘야함!!!!!!!!!!!!!!!!!!!!!

      refetch();
      closeEditModal();
    } else {
      // console.log("아바타바꾸는거 오나?");
      const {
        uploadAvatar: { ok, error },
      } = data;
      if (!ok) {
        return;
      }
      refetch();
    }
  };

  const [editProfile, { loading }] = useMutation(EDIT_PROFILE_MUTATION, {
    onCompleted,
  });
  const {
    register,
    handleSubmit,
    errors,
    watch,
    formState,
    getValues,
    setValue,
  } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    setValue("firstName", user?.firstName);
    setValue("lastName", user?.lastName);
    setValue("email", user?.email);
    setValue("username", user?.username);
    setValue("bio", user?.bio);
    // console.log("firstname", getValues("firstName"));
  }, [user, setValue]);

  const onSubmitValid = (data) => {
    alert("Saved Your Profile");
    // console.log("data", data);
    if (loading) {
      return;
    }
    editProfile({
      variables: {
        ...data,
      },
    });
  };

  const [uploadAvatar, { loading: uploadAvatarLoading }] = useMutation(
    UPLOAD_AVATAR_MUTATION,
    {
      onCompleted,
    }
  );

  const onSubmitAvatarValid = (data) => {
    alert("Saved Your Avatar");
    // console.log("Avatardata", data);
    if (uploadAvatarLoading) {
      return;
    }

    // const fileURL = data?.file[0];
    // console.log("fileURL", fileURL);

    // const file = new ReactNativeFile({
    //   uri: fileURL,
    //   name: `1.jpg`,
    //   // 아무거나 해도됨..어짜피 백앤드랑 아마존에서 이름 바꿀껏임
    //   //리액트 native가 jpg을 사용함
    //   type: "image/jpeg",
    // });

    // const file = new ReactNativeFile({
    //   uri: route.params.file,
    //   name: `1.jpg`,
    //   // 아무거나 해도됨..어짜피 백앤드랑 아마존에서 이름 바꿀껏임
    //   //리액트 native가 jpg을 사용함
    //   type: "image/jpeg",
    // });
    // console.log("file만보자", fileURL);

    uploadAvatar({
      variables: {
        file: data?.file[0],
      },
    });
  };

  const handleChange = (event) => {
    if (event.target.name === "firstName") {
      setValue("firstName", event.target.value);
    }
    if (event.target.name === "lastName") {
      setValue("lastName", event.target.value);
    }
    if (event.target.name === "email") {
      setValue("email", event.target.value);
    }
    if (event.target.name === "username") {
      setValue("username", event.target.value);
    }
    if (event.target.name === "bio") {
      setValue("bio", event.target.value);
    }
  };

  // console.log("user", user);
  return (
    <EditProfileContainer>
      <form onSubmit={handleSubmit(onSubmitValid)}>
        <AvatarContainer>
          <CircleAvatar src={user?.avatar}></CircleAvatar>
          <UserNameBox>
            <UserName>{user?.username}</UserName>
            <ButtonContainer>
              <UserAvatarButton>Change Profile Photo</UserAvatarButton>

              <AvatarInput
                type="file"
                name="file"
                accept="image/*"
                ref={register({ required: false })}
                onChange={handleSubmit(onSubmitAvatarValid)}
              ></AvatarInput>
            </ButtonContainer>
          </UserNameBox>
        </AvatarContainer>
        <FormContainer>
          First Name
          <Input
            ref={register}
            name="firstName"
            type="text"
            placeholder={user?.firstName}
            value={watch("firstName")}
            onChange={handleChange}
          />
          Last Name
          <Input
            ref={register}
            name="lastName"
            type="text"
            placeholder={user?.lastName}
            value={watch("lastName")}
            onChange={handleChange}
          />
          Email
          <Input
            ref={register}
            name="email"
            type="text"
            placeholder={user?.email}
            value={watch("email")}
            onChange={handleChange}
          />
          User Name
          <Input
            ref={register}
            name="username"
            type="text"
            placeholder={user?.username}
            value={watch("username")}
            onChange={handleChange}
          />
          Bio
          <Input
            ref={register}
            name="bio"
            type="bio"
            placeholder={
              user?.bio === null || user?.bio === "" ? "Bio" : user?.bio
            }
            value={watch("bio")}
            onChange={handleChange}
          />
          {/* <Input
            ref={register}
            name="password"
            type="password"
            placeholder="Password"
          /> */}
          <Button
            type="submit"
            value={loading ? "Loading..." : "Save"}
            disabled={!formState.isValid || loading}
          />
        </FormContainer>
      </form>
    </EditProfileContainer>
  );
}

export default EditProfile;
