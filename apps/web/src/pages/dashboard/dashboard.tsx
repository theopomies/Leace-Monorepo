import React from 'react'
import { useRouter } from 'next/router';

export default function Dashboard() {

    const router = useRouter();

    const handleClick = (e: { preventDefault: () => void; }, route: string) => {
        e.preventDefault()
        router.push(route)
    }

    return (
        <div className="flex justify-center h-screen">
            <div className="flex flex-wrap justify-center">
                <div className="w-64 h-64 p-4 bg-gray-200 rounded-lg m-4">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                        Expenses
                    </button>
                </div>
                <div className="w-64 h-64 p-4 bg-gray-200 rounded-lg m-4">
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full">
                        Income
                    </button>
                </div>
                <div className="w-64 h-64 p-4 bg-gray-200 rounded-lg m-4">
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full" onClick={(e) => handleClick(e, 'available')}>
                        Available
                    </button>
                </div>
                <div className="w-64 h-64 p-4 bg-gray-200 rounded-lg m-4">
                    <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded w-full" onClick={(e) => handleClick(e, 'occupied')}>
                        Occupied
                    </button>
                </div>
                <div className="w-64 h-64 p-4 bg-gray-200 rounded-lg m-4">
                    <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full">
                        Clients
                    </button>
                </div>
                <div className="w-64 h-64 p-4 bg-gray-200 rounded-lg m-4">
                    <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded w-full" onClick={(e) => handleClick(e, 'chat')}>
                        Chat
                    </button>
                </div>
            </div>
        </div>
    );
}


