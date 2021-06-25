import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useState } from "react";

const UPLOAD_PHOTO_MUTATION = gql`
  mutation uploadPhoto($file: Upload!, $caption: String) {
    # 프론트엔드와 모바일은 저기서 Upload! 형식이 뭔지 모른다.. 그래서 해결해줘야함
    uploadPhoto(file: $file, caption: $caption) {
      id
    }
  }
`;

const UploadContainer = styled.div`
  padding: 10px 10px;
  /* background-color: black; */
`;
const Title = styled.div`
  width: 100%;
  font-size: 20px;
  margin-bottom: 20px;
  /* background-color: red; */
`;
const AvatarInput = styled.input`
  width: 100%;
  cursor: pointer;
  color: #5ebcf7;
  font-weight: 600;
`;

const ImgBox = styled.div`
  width: 200px;
  height: 200px;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
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
  margin-top: 8px;
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
  margin-top: 25px;
  background-color: ${(props) => props.theme.accent};
  color: white;
  text-align: center;
  padding: 15px 0px;
  font-weight: 600;
  width: 100%;
  opacity: ${(props) => (props.disabled ? "0.2" : "1")};
`;

function UploadPhoto({ refetch, closeUploadModal }) {
  const [selectedPhoto, setSelectedPhoto] = useState();
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

  const onCompleted = (data) => {
    console.log("datadata?", data);

    const {
      uploadPhoto: { id },
    } = data;

    console.log("id", id);
    if (!id) {
      return;
    }
    //에러 만들어줘야함!!!!!!!!!!!!!!!!!!!!!
    //에러 만들어줘야함!!!!!!!!!!!!!!!!!!!!!
    //에러 만들어줘야함!!!!!!!!!!!!!!!!!!!!!

    refetch();
    closeUploadModal();
  };

  const [uploadPhotoMutation, { loading }] = useMutation(
    UPLOAD_PHOTO_MUTATION,
    {
      onCompleted,
    }
  );
  const handleChange = (event) => {
    setValue("caption", event.target.value);
  };

  const onSubmitValid = (data) => {
    alert("Uploaded Your Photo");
    // console.log("data", data);
    if (loading) {
      return;
    }

    uploadPhotoMutation({
      variables: {
        caption: data?.caption,
        file: data?.file[0],
      },
    });
  };

  return (
    <UploadContainer>
      <Title>Upload Your Photo</Title>
      <form onSubmit={handleSubmit(onSubmitValid)}>
        Caption
        <Input
          ref={register}
          name="caption"
          type="text"
          placeholder={"Text Here.."}
          value={watch("caption")}
          onChange={handleChange}
        />
        <AvatarInput
          type="file"
          name="file"
          accept="image/*"
          ref={register({ required: false })}
        ></AvatarInput>
        <Button
          type="submit"
          value={loading ? "Loading..." : "Upload This Photo"}
          disabled={!formState.isValid || loading}
        />
      </form>
    </UploadContainer>
  );
}

export default UploadPhoto;
