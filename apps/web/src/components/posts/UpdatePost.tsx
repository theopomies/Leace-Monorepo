import React, {
  Dispatch,
  FormEventHandler,
  MouseEventHandler,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Header } from "../../components/users/Header";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { PostForm } from "./PostForm";
import { HomeType } from "../../types/homeType";
import axios from "axios";

export interface UpdatePostProps {
  postId: string;
}

export const UpdatePost = ({ postId }: UpdatePostProps) => {
  const router = useRouter();
  const { data: post } = trpc.post.getPostById.useQuery({ postId });
  const updatePost = trpc.post.updatePostById.useMutation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const updatePostAttributes =
    trpc.attribute.updatePostAttributes.useMutation();
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

  const { data: imagesGet } = trpc.image.getSignedPostUrl.useQuery(postId);
  const uploadImage = trpc.image.putSignedPostUrl.useMutation();
  const [images, setImages] = useState<File[] | undefined>();

  const { data: documentsGet } = trpc.document.getSignedUrl.useQuery({
    postId,
  });
  const uploadDocument = trpc.document.putSignedUrl.useMutation();
  const [documents, setDocuments] = useState<File[] | undefined>();

  useEffect(() => {
    if (post) {
      setTitle((title) => post.title ?? title);
      setDescription((description) => post.desc ?? description);
      setLocation((location) => post.attribute?.location ?? location);
      setFurnished((furnished) => post.attribute?.furnished ?? furnished);
      setHomeType((homeType) => post.attribute?.homeType ?? homeType);
      setTerrace((terrace) => post.attribute?.terrace ?? terrace);
      setPets((pets) => post.attribute?.pets ?? pets);
      setSmoker((smoker) => post.attribute?.smoker ?? smoker);
      setGarden((garden) => post.attribute?.garden ?? garden);
      setParking((parking) => post.attribute?.parking ?? parking);
      setElevator((elevator) => post.attribute?.elevator ?? elevator);
      setPool((pool) => post.attribute?.pool ?? pool);
      setDisability((disability) => post.attribute?.disability ?? disability);
      setSize((size) => post.attribute?.size ?? size);
      setPrice((price) => post.attribute?.price ?? price);
    }
  }, [post]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await updatePost.mutateAsync({
      postId,
      title,
      desc: description,
      content: "",
    });
    await updatePostAttributes.mutateAsync({
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
      price,
      size,
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

  const handleCancel: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    router.back();
  };

  const handleImages =
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
        setImages={handleImages(setImages)}
        images={images}
        imagesGet={imagesGet}
        setDocuments={handleDocuments(setDocuments)}
        documents={documents}
        documentsGet={documentsGet}
      />
    </div>
  );
};
