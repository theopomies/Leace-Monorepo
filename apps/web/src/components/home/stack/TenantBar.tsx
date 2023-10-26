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
      className={`h-56 cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow ${
        tenant.isPremium ? "border-2 border-yellow-300" : ""
      }`}
    >
      <Link href={"/users/" + tenant.id}>
        <div className="flex h-2/3 flex-grow items-center gap-4 p-4">
          <img
            src={tenant.image || "/defaultImage.png"}
            referrerPolicy="no-referrer"
            alt="image"
            className="h-full w-auto flex-shrink-0 overflow-hidden rounded-full"
          />
          <div className="p-2">
            <div className="flex gap-2">
              <h3 className="text-2xl">{tenant.firstName}</h3>
              <h3 className="text-2xl">{tenant.lastName}</h3>
              {tenant.isPremium && (
                <p className="m-auto rounded-full border border-yellow-500 p-0.5 px-1 text-xs text-yellow-500">
                  Premium
                </p>
              )}
            </div>
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
