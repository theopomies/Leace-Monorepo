import { useRouter } from "next/router";
import { PostCard } from "../../components/postCard";
import { trpc } from "../../utils/trpc";
import { PostType } from '@prisma/client'

export default function Occupied() {

    const occupied = trpc.post.getMyPost.useQuery(PostType.RENTED)

    const router = useRouter();

    const handleClick = (e: { preventDefault: () => void; }, route: string) => {
        e.preventDefault()
        router.push(route)
    }

    return (
        <div className="mb-20 mt-20 mx-5 items-center justify-center top-0 left-0 right-0">
            <div className="text-3xl font-bold text-center items-center justify-center mb-20">Occupied Housing</div>
            {occupied.data && occupied.data.length > 0 ?
                <div className="flex flex-row items-center justify-center top-0 left-0 right-0 flex-wrap">
                    {occupied.data.map(item => {
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
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 flex items-center justify-center rounded bottom-0 left-0 right-0" onClick={(e) => handleClick(e, '/dashboard')}>
                Return
            </button>
        </div>
    )
}
