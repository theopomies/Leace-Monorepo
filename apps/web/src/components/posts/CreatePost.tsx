import React, {
  Dispatch,
  FormEventHandler,
  MouseEventHandler,
  SetStateAction,
  useState,
} from "react";
import { Header } from "../../components/users/Header";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { PostForm } from "./PostForm";
import axios from "axios";

export const CreatePost = () => {
  const router = useRouter();
  const post = trpc.post.createPost.useMutation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const updatePost = trpc.attribute.updatePostAttributes.useMutation();
  const uploadImage = trpc.image.putSignedPostUrl.useMutation();
  const [location, setLocation] = useState("");
  const [furnished, setFurnished] = useState(false);
  const [house, setHouse] = useState(false);
  const [appartment, setAppartment] = useState(false);
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
  const [images, setImages] = useState<File[] | undefined>();

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
      house,
      appartment,
      terrace,
      pets,
      smoker,
      garden,
      parking,
      elevator,
      pool,
      disability,
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
    router.push(`/posts/${postId}`);
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

  const handleImage =
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
        setHouse={handleBooleanChange(setHouse)}
        house={house}
        setAppartment={handleBooleanChange(setAppartment)}
        appartment={appartment}
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
        images={images}
      />
    </div>
  );
};
