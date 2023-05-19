import { PostType } from "@prisma/client";
import { PostCard } from "../posts/card";
import Link from "next/link";
import { trpc } from "../../utils/trpc";

interface AvailablePropertiesListProps {
    userId: string; 
}

export function AvailablePropertiesList({ userId }: AvailablePropertiesListProps) {
    const availableProperties = trpc.post.getPostsByUserId.useQuery({userId, postType: PostType.TO_BE_RENTED});

    return (
        <div className="container mx-auto p-4">
            <div className="mb-20 mt-20 mx-5 items-center justify-center top-0 left-0 right-0">
                <div className="text-3xl font-bold text-center items-center justify-center mb-20">Available Accommodation</div>
                {availableProperties.data && availableProperties.data.length > 0 ?
                    <div className="flex flex-row items-center justify-center top-0 left-0 right-0 flex-wrap">
                        {availableProperties.data.map(item => {
                            return (
                                <div key={item.id} className="mb-10">
                                    <PostCard title={item.title} desc={item.desc} content={item.content} income={undefined} expenses={undefined} />
                                </div>
                            )
                        })}
                    </div>
                    :
                    <div className="items-center justify-center right-0 left-0 top-80 bottom-80">
                        <div className="text-3xl font-bold text-center items-center justify-center">No property available at the moment</div>
                    </div>
                }
                <Link 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 flex items-center justify-center rounded bottom-0 left-0 right-0"
                    href={`/dashboard/main`}
                    >
                    Return
                </Link>
            </div>
    </div>
    )
}