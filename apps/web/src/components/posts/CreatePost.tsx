import React, { MouseEventHandler, useState } from "react";
import { Header } from "../../components/users/Header";
import { useRouter } from "next/router";
import { trpc, RouterInputs } from "../../utils/trpc";
import { Button } from "../shared/button/Button";
import { Input } from "../shared/forms/Input";
import { Checkbox } from "../shared/forms/Checkbox";
import { TextArea } from "../shared/forms/TextArea";
import { NumberInput } from "../shared/forms/NumberInput";
import { FileInput } from "../shared/forms/FileInput";

export const CreatePost = () => {
  const router = useRouter();
  const post = trpc.post.createPost.useMutation();
  const [postData, setPostData] = useState<RouterInputs["post"]["createPost"]>({
    content: "",
    title: "",
    desc: "",
  });

  const updatePost = trpc.attribute.updatePostAttributes.useMutation();
  const [attributes, setAttributes] = useState<
    RouterInputs["attribute"]["updatePostAttributes"]
  >({
    postId: "",
    location: "",
    price: 0,
    size: 0,
    rentStartDate: new Date(),
    rentEndDate: new Date(),
    furnished: false,
    house: false,
    appartment: false,
    terrace: false,
    pets: false,
    smoker: false,
    disability: false,
    garden: false,
    parking: false,
    elevator: false,
    pool: false,
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    let value: string | number | boolean | Date;

    if (
      event.target.type === "checkbox" &&
      event.target instanceof HTMLInputElement
    ) {
      value = event.target.checked ? true : false;
    } else if (event.target.type === "number") {
      value = event.target.value ? parseInt(event.target.value) : 0;
    } else if (event.target.type === "date") {
      value = event.target.value ? new Date(event.target.value) : new Date();
    } else if (event.target.type === "text") {
      value = event.target.value ? event.target.value : "";
    } else {
      value = event.target.value;
    }
    if (event.target.name in postData) {
      setPostData({
        ...postData,
        [event.target.name]: value,
      });
    }
    if (event.target.name in attributes) {
      setAttributes({
        ...attributes,
        [event.target.name]: value,
      });
    }
  };

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    const { id: postId } = await post.mutateAsync(postData);
    attributes.postId = postId;
    await updatePost.mutateAsync(attributes);

    router.push(`/posts/${postId}`);
  };

  return (
    <div className="w-full">
      <Header heading={"Création d'une annonce"} />
      <div className="flex justify-center">
        <div className="flex justify-center rounded-lg bg-white p-12 shadow">
          <div className="h-auto">
            <div className="flex w-full">
              <label className="w-full">
                <div className="text-lg font-medium">Title</div>
                <Input
                  placeholder="Appartment in Central Park"
                  name="title"
                  onChange={handleChange}
                  value={postData.title}
                  className="w-full"
                />
              </label>
            </div>
            <div className="mt-6 flex w-full">
              <label className="w-full">
                <div className="text-lg font-medium">Location</div>
                <Input
                  placeholder="Central Park, New York"
                  name="location"
                  onChange={handleChange}
                  value={attributes.location}
                  className="w-full"
                />
              </label>
            </div>

            <div className="mt-6">
              <h2 className="text-center text-xl font-medium text-gray-700">
                Type de logement
              </h2>
              <div className="flex justify-center gap-4 p-4">
                <Checkbox
                  type="checkbox"
                  name="house"
                  onChange={handleChange}
                  checked={attributes.house}
                >
                  Maison
                </Checkbox>
                <Checkbox
                  type="checkbox"
                  name="appartment"
                  onChange={handleChange}
                  checked={attributes.appartment}
                >
                  Appartement
                </Checkbox>
              </div>
            </div>
            <div>
              <TextArea
                placeholder="Description"
                name="desc"
                onChange={handleChange}
                value={postData.desc}
                className="w-full"
              />
            </div>
            <div className="mt-6">
              <h2 className="text-center text-xl font-medium text-gray-700">
                Critères
              </h2>
              <div className="flex flex-wrap justify-center gap-4 p-4">
                <Checkbox
                  name="furnished"
                  onChange={handleChange}
                  checked={attributes.furnished}
                >
                  Fournis
                </Checkbox>
                <Checkbox
                  name="pool"
                  onChange={handleChange}
                  checked={attributes.pool}
                >
                  Piscine
                </Checkbox>
                <Checkbox
                  name="smoker"
                  onChange={handleChange}
                  checked={attributes.smoker}
                >
                  Fumer
                </Checkbox>
                <Checkbox
                  name="terrace"
                  onChange={handleChange}
                  checked={attributes.terrace}
                >
                  Terasse
                </Checkbox>
                <Checkbox
                  name="elevator"
                  onChange={handleChange}
                  checked={attributes.elevator}
                >
                  Ascenseur
                </Checkbox>
                <Checkbox
                  name="parking"
                  onChange={handleChange}
                  checked={attributes.parking}
                >
                  Parking
                </Checkbox>
                <Checkbox
                  name="garden"
                  onChange={handleChange}
                  checked={attributes.garden}
                >
                  Jardin
                </Checkbox>
                <Checkbox
                  name="pets"
                  onChange={handleChange}
                  checked={attributes.pets}
                >
                  Animaux
                </Checkbox>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap justify-around gap-4">
              <label>
                <div>Surface</div>
                <NumberInput
                  placeholder="Surface"
                  aria-describedby="amount-prefix"
                  name="size"
                  onChange={handleChange}
                  value={attributes.size}
                  unit="m²"
                />
              </label>
              <label>
                <div>Prix du loyer</div>
                <NumberInput
                  placeholder="Prix"
                  aria-describedby="amount-prefix"
                  name="price"
                  onChange={handleChange}
                  value={attributes.price}
                  unit="€"
                />
              </label>
              <label>
                <div>Charges</div>
                <NumberInput
                  placeholder="Charge"
                  aria-describedby="amount-prefix"
                  name="maxPrice"
                  unit="€"
                />
              </label>
            </div>
            <div className="mt-6">
              <h2 className="text-center text-xl font-medium text-gray-700">
                Photos
              </h2>
              <div className="mt-2 flex flex-wrap justify-center gap-4">
                <FileInput multiple={false}>Upload First Image</FileInput>
                <FileInput multiple={false}>Upload Second Image</FileInput>
                <FileInput multiple={false}>Upload Third Image</FileInput>
              </div>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <Button theme="danger" onClick={handleSubmit}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Submit</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
