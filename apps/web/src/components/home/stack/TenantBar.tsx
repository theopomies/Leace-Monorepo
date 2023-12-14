import { User } from "@prisma/client";
import Link from "next/link";
import { calcAge } from "../../../utils/calcAge";
import { trpc } from "../../../utils/trpc";
import { Button } from "../../shared/button/Button";
import { UserImage } from "../../shared/user/UserImage";

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
      className={`flex h-36 w-full cursor-pointer items-center overflow-hidden rounded-xl bg-white shadow ${
        tenant.isPremium ? "border-2 border-yellow-300" : ""
      }`}
    >
      <Link href={"/users/" + tenant.id} className="flex h-full flex-grow p-4">
        <UserImage user={tenant} />
        <div className="p-2">
          <div className="flex gap-2">
            <h3 className="text-2xl">{tenant.firstName}</h3>
            <h3 className="text-2xl">{tenant.lastName}</h3>
            {tenant.isPremium && (
              <p className="m-auto rounded-full border border-yellow-500 p-0.5 px-1 text-xs text-yellow-500">
                Premium
              </p>
            )}
            {tenant.certified && (
              <p className="m-auto rounded-full border border-indigo-500 p-0.5 px-1 text-xs text-indigo-500">
                Certified
              </p>
            )}
          </div>
          <div className="flex items-center">
            {tenant.birthDate && (
              <p className="text-gray-500">{calcAge(tenant.birthDate)} ans</p>
            )}
            {tenant.job && (
              <p className="text-gray-500">
                <span className="mx-2">•</span>
                {tenant.job}
              </p>
            )}
          </div>
          <p className="mt-4 text-gray-500">Click to view profile</p>
        </div>
      </Link>
      <div className="flex w-1/4 cursor-auto flex-col justify-center gap-y-2 p-4">
        <Button loading={likeIsLoading} onClick={() => onLike(tenant.id)}>
          Accept
        </Button>
        <Button
          loading={dislikeIsLoading}
          onClick={() => onDislike(tenant.id)}
          overrideStyles
          className="rounded-md border-2 border-indigo-500 bg-white px-4 py-3 font-bold text-indigo-500 hover:border-gray-100 hover:bg-gray-500 hover:text-white"
        >
          Decline
        </Button>
      </div>
    </div>
  );
}
