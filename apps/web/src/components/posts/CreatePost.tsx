import React, {
  Dispatch,
  FormEventHandler,
  MouseEventHandler,
  SetStateAction,
  useState,
} from "react";
import { Header } from "../shared/Header";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { PostForm } from "./PostForm";
import { HomeType } from "../../types/homeType";
import axios from "axios";

export const CreatePost = () => {
  const router = useRouter();
  const post = trpc.post.createPost.useMutation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const updatePost = trpc.attribute.updatePostAttributes.useMutation();
  const [location, setLocation] = useState("");
  const [furnished, setFurnished] = useState(false);
  const [homeType, setHomeType] = useState<HomeType | undefined>();
  const [terrace, setTerrace] = useState(false);
  const [pets, setPets] = useState(false);
  const [smoker, setSmoker] = useState(false);
  const [garden, setGarden] = useState(false);
  const [parking, setParking] = useState(false);
  const [elevator, setElevator] = useState(false);
  const [disability, setDisability] = useState(false);
  const [pool, setPool] = useState(false);
  const [size, setSize] = useState(0);
  const [price, setPrice] = useState(0);

  const uploadImage = trpc.image.putSignedPostUrl.useMutation();
  const [images, setImages] = useState<File[] | undefined>();

  const uploadDocument = trpc.document.putSignedUrl.useMutation();
  const [documents, setDocuments] = useState<File[] | undefined>();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const { id: postId } = await post.mutateAsync({
      title,
      desc: description,
      content: "",
    });
    await updatePost.mutateAsync({
      postId,
      location,
      furnished,
      homeType,
      terrace,
      pets,
      smoker,
      garden,
      parking,
      elevator,
      pool,
      disability,
      size,
      price,
    });
    if (images && images.length > 0) {
      images.map(async (image) => {
        await uploadImage
          .mutateAsync({
            postId,
            fileType: image.type,
          })
          .then((url) => {
            axios.put(url, image);
          });
      });
    }
    if (documents && documents.length > 0) {
      documents.map(async (document) => {
        await uploadDocument
          .mutateAsync({
            postId,
            fileType: document.type,
          })
          .then((url) => {
            if (url) axios.put(url, document);
          });
      });
    }
    setTimeout(() => {
      router.push(`/posts/${postId}`);
    }, 500);
  };

  const handleChange =
    (setter: Dispatch<SetStateAction<string>>) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(event.target.value);
    };

  const handleBooleanChange =
    (setter: Dispatch<SetStateAction<boolean>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setter(event.target.checked);
    };

  const handleNumberChange =
    (setter: Dispatch<SetStateAction<number>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setter(event.target.valueAsNumber);
    };

  const handleHomeTypeChange =
    (setter: Dispatch<SetStateAction<HomeType | undefined>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value as HomeType);
    };

  const handleImage =
    (setter: Dispatch<SetStateAction<File[] | undefined>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        setter(Array.from(event.target.files));
      }
    };

  const handleDocuments =
    (setter: Dispatch<SetStateAction<File[] | undefined>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        setter(Array.from(event.target.files));
      }
    };

  const handleCancel: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    router.back();
  };

  return (
    <div className="w-full">
      <Header heading={"Création d'une annonce"} />
      <PostForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        setTitle={handleChange(setTitle)}
        title={title}
        setLocation={handleChange(setLocation)}
        location={location}
        setHomeType={handleHomeTypeChange(setHomeType)}
        homeType={homeType}
        setDescription={handleChange(setDescription)}
        description={description}
        setFurnished={handleBooleanChange(setFurnished)}
        furnished={furnished}
        setPool={handleBooleanChange(setPool)}
        pool={pool}
        setSmoker={handleBooleanChange(setSmoker)}
        smoker={smoker}
        setTerrace={handleBooleanChange(setTerrace)}
        terrace={terrace}
        setElevator={handleBooleanChange(setElevator)}
        elevator={elevator}
        setParking={handleBooleanChange(setParking)}
        parking={parking}
        setGarden={handleBooleanChange(setGarden)}
        garden={garden}
        setPets={handleBooleanChange(setPets)}
        pets={pets}
        setDisability={handleBooleanChange(setDisability)}
        disability={disability}
        setSize={handleNumberChange(setSize)}
        size={size}
        setPrice={handleNumberChange(setPrice)}
        price={price}
        setImages={handleImage(setImages)}
        setDocuments={handleDocuments(setDocuments)}
        documents={documents}
        images={images}
      />
    </div>
  );
};
