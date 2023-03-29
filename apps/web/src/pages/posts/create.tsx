import React, { useState } from "react";
import Header from "../../components/users/Header";
import { useRouter } from "next/router";
import { trpc, RouterInputs } from "../../utils/trpc";
import { LoggedLayout } from "../../components/shared/layout/LoggedLayout";

const Create = () => {
  const post = trpc.post.createPost.useMutation();
  const session = trpc.auth.getSession.useQuery();
  const [postData, setPostData] = useState<RouterInputs["post"]["createPost"]>({
    content: "",
    title: "",
    desc: "",
  });

  const updatePost = trpc.attribute.updatePostAtt.useMutation();
  const [attData, setAttData] = useState<
    RouterInputs["attribute"]["updatePostAtt"]
  >({
    id: "",
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
    setPostData({
      ...postData,
      [event.target.name]: value,
    });
    setAttData({
      ...attData,
      [event.target.name]: value,
    });
  };

  const router = useRouter();
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const postUser = await post.mutateAsync(postData);
    if (!postUser) {
      return null;
    }
    attData.id = postUser.id;
    updatePost.mutate(attData);
    router.push("/users/me");
  };
  if (session.data?.role == "OWNER" || session.data?.role == "AGENCY") {
    return (
      <LoggedLayout title="Profile Page | Leace">
        <div className="w-full">
          <Header heading={"Création d'une annonce"} />
          <div className="flex justify-center p-5">
            <div className="m-14 flex w-2/5 justify-center rounded-lg bg-white p-5 shadow">
              <div className="h-auto p-4 text-center">
                <div className="m-4">
                  <input
                    className="w-full rounded-lg border-2 border-gray-400 bg-gray-50 p-4 text-xl text-gray-900 focus:border-blue-600 focus:outline-none"
                    type="text"
                    placeholder="Titre de l'annonce"
                    name="title"
                    onChange={handleChange}
                    value={postData.title}
                  />
                </div>
                <div className="m-4 mt-10">
                  <input
                    className="w-3/4 rounded-lg border-2 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none"
                    type="text"
                    placeholder="Dans quelle ville?"
                    name="location"
                    onChange={handleChange}
                    value={attData.location}
                  />
                </div>
                <div className="m-4">
                  <h2 className="pb-2 pt-4 text-xl font-medium text-gray-700">
                    Type de logement
                  </h2>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      name="house"
                      onChange={handleChange}
                      checked={attData.house}
                    />
                    <span className="ml-2">Maison</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      name="appartment"
                      onChange={handleChange}
                      checked={attData.appartment}
                    />
                    <span className="ml-2">Appartement</span>
                  </label>
                </div>
                <div className="m-4">
                  <h2 className="pb-2 pt-4 text-xl font-medium text-gray-700">
                    Critères
                  </h2>
                  <div className="flex justify-between">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        name="furnished"
                        onChange={handleChange}
                        checked={attData.furnished}
                      />
                      <span className="ml-2">Fournis</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        name="pool"
                        onChange={handleChange}
                        checked={attData.pool}
                      />
                      <span className="ml-2">Piscine</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        name="smoker"
                        onChange={handleChange}
                        checked={attData.smoker}
                      />
                      <span className="ml-2">Fumer</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        name="terrace"
                        onChange={handleChange}
                        checked={attData.terrace}
                      />
                      <span className="ml-2">Terasse</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        name="elevator"
                        onChange={handleChange}
                        checked={attData.elevator}
                      />
                      <span className="ml-2">Ascenseur</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        name="parking"
                        onChange={handleChange}
                        checked={attData.parking}
                      />
                      <span className="ml-2">Parking</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        name="garden"
                        onChange={handleChange}
                        checked={attData.garden}
                      />
                      <span className="ml-2">Jardin</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        name="pets"
                        onChange={handleChange}
                        checked={attData.pets}
                      />
                      <span className="ml-2">Animaux</span>
                    </label>
                  </div>
                </div>
                <div className="m-8">
                  <textarea
                    className="w-full rounded-lg border-2 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none"
                    rows={4}
                    placeholder="Description"
                    name="desc"
                    onChange={handleChange}
                    value={postData.desc}
                  />
                </div>
                <div className="m-10">
                  <div className="m-4">
                    <div className="flex justify-center">
                      <div className="relative rounded-md shadow-sm">
                        <input
                          type="number"
                          className="form-input block w-full rounded-lg border-2 border-gray-300 bg-gray-50 p-2.5 py-3 pr-10 text-sm leading-5 text-gray-900 transition duration-150 ease-in-out focus:border-blue-600 focus:outline-none sm:text-sm sm:leading-5"
                          placeholder="Surface"
                          aria-describedby="amount-prefix"
                          name="size"
                          onChange={handleChange}
                          value={attData.size}
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-gray-500 sm:text-sm sm:leading-5">
                            m²
                          </span>
                        </div>
                        <label className="pl-3">Surface</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="m-4">
                  <div className="flex justify-between">
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="number"
                        className="form-input block w-full rounded-lg border-2 border-gray-300 bg-gray-50 p-2.5 py-3 pr-10 text-sm leading-5 text-gray-900 transition duration-150 ease-in-out focus:border-blue-600 focus:outline-none sm:text-sm sm:leading-5"
                        placeholder="Prix"
                        aria-describedby="amount-prefix"
                        name="price"
                        onChange={handleChange}
                        value={attData.price}
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500 sm:text-sm sm:leading-5">
                          €
                        </span>
                      </div>
                      <label className="pl-3">Prix du loyer</label>
                    </div>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="number"
                        className="form-input block w-full rounded-lg border-2 border-gray-300 bg-gray-50 p-2.5 py-3 pr-10 text-sm leading-5 text-gray-900 transition duration-150 ease-in-out focus:border-blue-600 focus:outline-none sm:text-sm sm:leading-5"
                        placeholder="Charge"
                        aria-describedby="amount-prefix"
                        name="maxPrice"
                        //onChange={handleChange}
                        //value={attData.maxPrice}
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500 sm:text-sm sm:leading-5">
                          €
                        </span>
                      </div>
                      <label className="pl-3">Charge du loyer</label>
                    </div>
                  </div>
                  <h2 className="m-5 text-xl font-medium text-gray-700">
                    Photos
                  </h2>
                  <div className="flex justify-between">
                    <h2 className="pb-2 pt-4 text-xl font-medium text-gray-700">
                      n°1:
                    </h2>
                    <label className="focus:shadow-outline-blue relative inline-flex items-center rounded-lg  border-2  border-gray-300  bg-gray-50 p-2.5 px-4 py-2  text-sm font-medium leading-5 text-gray-900 hover:text-gray-500  focus:border-blue-600  focus:outline-none active:bg-gray-50 active:text-gray-800">
                      Upload
                      <input
                        hidden
                        accept="image/*"
                        multiple
                        type="file"
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                    </label>
                    <h2 className="pb-2 pt-4 text-xl font-medium text-gray-700">
                      n°2:
                    </h2>
                    <label className="focus:shadow-outline-blue relative inline-flex items-center rounded-lg  border-2  border-gray-300  bg-gray-50 p-2.5 px-4 py-2  text-sm font-medium leading-5 text-gray-900 hover:text-gray-500  focus:border-blue-600  focus:outline-none active:bg-gray-50 active:text-gray-800">
                      Upload
                      <input
                        hidden
                        accept="image/*"
                        multiple
                        type="file"
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                    </label>
                    <h2 className="pb-2 pt-4 text-xl font-medium text-gray-700">
                      n°3:
                    </h2>
                    <label className="focus:shadow-outline-blue relative inline-flex items-center rounded-lg  border-2  border-gray-300  bg-gray-50 p-2.5 px-4 py-2  text-sm font-medium leading-5 text-gray-900 hover:text-gray-500  focus:border-blue-600  focus:outline-none active:bg-gray-50 active:text-gray-800">
                      Upload
                      <input
                        hidden
                        accept="image/*"
                        multiple
                        type="file"
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                    </label>
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    className="rounded-lg bg-indigo-500 px-4 py-2 font-medium text-white hover:bg-indigo-600"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LoggedLayout>
    );
  } else {
    return (
      <div className="h-full bg-slate-100">
        <Header heading={"Création d'une annonce"} />
        <LoggedLayout title="pzkpiej">
          <div className="flex h-screen flex-col items-center justify-center text-center">
            <h1 className="text-4xl font-bold text-red-500">404 Not Found</h1>
            <p className="text-xl font-medium">
              The page you are looking for does not exist anymore.
            </p>
          </div>
        </LoggedLayout>
      </div>
    );
  }
};

export default Create;
