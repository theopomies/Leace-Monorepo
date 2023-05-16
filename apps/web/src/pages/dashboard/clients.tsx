import Link from "next/link";

export default function Occupied() {
    
    return (
        <div>
        <div className="items-center justify-center right-0 left-0 top-80 bottom-80">
            <div className="text-3xl font-bold text-center items-center justify-center">No client available at the moment</div>
        </div>
        <div className="m-72 ml-96 mr-96">
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