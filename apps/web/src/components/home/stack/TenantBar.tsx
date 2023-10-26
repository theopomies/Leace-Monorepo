/* eslint-disable @next/next/no-img-element */
import { Button } from "../../shared/button/Button";
import { calcAge } from "../../../utils/calcAge";
import { trpc } from "../../../utils/trpc";
import { User } from "@prisma/client";
import Link from "next/link";

export interface TenantBarProps {
  postId: string;
  tenant: User;
}

export function TenantBar({ postId, tenant }: TenantBarProps) {
  const utils = trpc.useContext();
  const { mutateAsync: likeHandler, isLoading: likeIsLoading } =
    trpc.relationship.likeTenantForPost.useMutation({
      async onSuccess() {
        await utils.post.getUsersToBeSeen.invalidate();
      },
    });
  const { mutateAsync: dislikeHandler, isLoading: dislikeIsLoading } =
    trpc.relationship.dislikeTenantForPost.useMutation({
      async onSuccess() {
        await utils.post.getUsersToBeSeen.invalidate();
      },
    });

  const onLike = async (userId: string) => {
    await likeHandler({ postId, userId });
  };

  const onDislike = async (userId: string) => {
    await dislikeHandler({ postId, userId });
  };

  return (
    <div
      className={`relative h-56 cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow-md ${
        tenant.isPremium ? "border-4 border-yellow-300" : ""
      }`}
    >
      {tenant.isPremium && (
        <div className="absolute left-0 top-[8%] w-full translate-x-[-40%] rotate-[-45deg] bg-yellow-300 px-2 text-center font-bold text-white">
          Premium
        </div>
      )}
      <Link href={"/users/" + tenant.id}>
        <div className="flex h-2/3 items-center justify-evenly gap-4 p-2">
          {tenant.image && (
            <img
              className="h-full object-cover"
              src={tenant.image}
              alt="User Image"
            />
          )}
          <div className="p-2">
            <h3 className="text-2xl font-bold">{tenant.firstName}</h3>
            <div className="flex items-center">
              {tenant.birthDate && (
                <p className="text-gray-500">{calcAge(tenant.birthDate)} ans</p>
              )}
              <span className="mx-2">•</span>
              <p className="text-gray-500">{tenant.job}</p>
            </div>
            <p className="mt-4 text-gray-500">Click to view profile</p>
          </div>
        </div>
      </Link>
      <div className="flex cursor-auto gap-4 bg-gray-100 p-4">
        <Button
          loading={likeIsLoading}
          onClick={() => onLike(tenant.id)}
          className="w-1/2"
        >
          Accept
        </Button>
        <Button
          loading={dislikeIsLoading}
          onClick={() => onDislike(tenant.id)}
          theme="grey"
          className="w-1/2"
        >
          Decline
        </Button>
      </div>
    </div>
  );
}
