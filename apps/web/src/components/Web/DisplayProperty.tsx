/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useRouter } from "next/router";
import { trpc, RouterInputs } from "../../utils/trpc";
import { Attribute, Post, Roles } from ".prisma/client";
import DeletePost from "./DeletePost";
import LoggedLayout from "../LoggedLayout";
import Header from "./Header";

export default function displayPost(props: {
  post: Post;
  attribute: Attribute;
}) {
  const { data: session } = trpc.auth.getSession.useQuery();
  const router = useRouter();
  return (
    <LoggedLayout>
      <Header heading={"Annonce"} />
      <div className="flex justify-center p-5">
        <div>
          {session?.user.role != Roles.TENANT && (
            <DeletePost post={props.post.id} />
          )}
        </div>
        <div>
          <button
            className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
            onClick={(e) => {
              e.preventDefault();
              router.push(`/users/ModifyPost?id=${props.post.id}`);
            }} //handleReportForm}
          >
            Modifier
          </button>
          {/* {showReportForm && (
                <ReportForm
                  onClose={handleCloseContent}
                  userId="cldgtjmh70000v2842ehc9afc"
                />
              )} */}
        </div>
        <div className="m-14 flex w-2/5 justify-center rounded-lg bg-white p-5 shadow">
          <div className="h-auto p-4 text-center">
            <div className="flex justify-center">
              <div className="pr-20 pt-4 pb-2">
                <h2 className="text-xl font-bold text-gray-700">Lieu:</h2>
                <b>{props.attribute.location}</b>
              </div>
              <div className="pt-4 pb-2">
                <h2 className="text-xl font-bold text-gray-700">
                  Type de logement:
                </h2>
                <b>
                  {props.attribute.house === true ? (
                    <p>Maison</p>
                  ) : (
                    <p>Appartement</p>
                  )}
                </b>
              </div>
            </div>
            <hr className="my-4" />
            <h2 className="text-xl font-bold text-gray-400">Critères:</h2>
            <div className="flex justify-between">
              Une terrasse :
              {props.attribute.terrace === true ? <p>Oui</p> : <p>Non</p>}
              Une piscine :
              {props.attribute.pool === true ? <p>Oui</p> : <p>Non</p>}
            </div>
            <div className="flex justify-between">
              Fumeur :
              {props.attribute.smoker === true ? <p>Oui</p> : <p>Non</p>}
              Animal :{props.attribute.pets === true ? <p>Oui</p> : <p>Non</p>}
            </div>
            <div className="flex justify-between">
              Handicap :
              {props.attribute.disability === true ? <p>Oui</p> : <p>Non</p>}
              Garage :
              {props.attribute.parking === true ? <p>Oui</p> : <p>Non</p>}
            </div>
            <div className="flex justify-between">
              Ascenseur :
              {props.attribute.elevator === true ? <p>Oui</p> : <p>Non</p>}
              Jardin :
              {props.attribute.garden === true ? <p>Oui</p> : <p>Non</p>}
            </div>
            <hr className="my-4" />
            <div className="m-4 pt-5">
              <h2 className="text-xl font-bold text-gray-700">
                Le prix demandé:
                <b className="pl-3 text-black">{props.attribute.minPrice} €</b>
              </h2>
              <h2 className="pt-3 text-xl font-bold text-gray-700">
                Les charges:
                <b className="pl-3 text-black">{props.attribute.maxPrice} €</b>
              </h2>
              <h2 className="pt-3 text-xl font-bold text-gray-700">
                Surface:
                <b className="pl-3 text-black">{props.attribute.minSize} m²</b>
              </h2>
            </div>
            <hr className="my-4" />
            <h2 className="text-xl font-bold text-gray-700">Description:</h2>
            <p className="m-4">{props.post.desc}</p>
            <hr className="my-8 border-t-2 border-gray-300" />
            <div className="m-4 justify-between">
              <img src="/photos2.jpeg" alt="Pic2" className="m-4" />
              <img src="/photos1.jpeg" alt="Pic1" className="m-4" />
              <img src="/photos3.jpeg" alt="Pic3" className="m-4" />
            </div>
            {/*           <div className="flex justify-center pt-16">
            <button className="w-1/2 rounded-lg bg-blue-500 py-2 px-4 text-white hover:bg-blue-600">
              <b>Modify</b>
            </button>
          </div> */}
          </div>
        </div>
      </div>
    </LoggedLayout>
  );
}
