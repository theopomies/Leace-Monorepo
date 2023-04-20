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

  useEffect(() => {
    if (post) {
      setTitle((title) => post.title ?? title);
      setDescription((description) => post.desc ?? description);
      setLocation((location) => post.attribute?.location ?? location);
      setFurnished((furnished) => post.attribute?.furnished ?? furnished);
      setHouse((house) => post.attribute?.house ?? house);
      setAppartment((appartment) => post.attribute?.appartment ?? appartment);
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
      />
    </div>
  );
};
