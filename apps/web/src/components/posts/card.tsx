/* eslint-disable @next/next/no-img-element */
export const PostCard = ({ title, desc, content, income, expenses }: { title: string | null, desc: string | null, content: string | null, income: number | undefined, expenses: number | undefined }) => {

    return (

        <div className="bg-gray-300 flex-row max-w-sm rounded-lg overflow-hidden border mx-2">
            <img src="https://www.gridky.com/blog/wp-content/uploads/2020/07/Comment-acheter-un-immeuble-de-rapport.jpg" alt="" className="h-80" />
            <div className="ml-5 mt-5">
                <div className="font-bold text-xl mb-2">{title}</div>
                <div className="text-gray-700 text-base mb-0.5">
                    {desc}
                </div>
                <div className="text-gray-700 text-base">
                    {content}
                </div>
                {income !== undefined ? <div className="text-gray-700 text-base">Income: {income}</div> : <></>}
                {expenses !== undefined ? <div className="text-gray-700 text-base">Expenses: {expenses}</div> : <></>}
            </div>
        </div>
    )
};