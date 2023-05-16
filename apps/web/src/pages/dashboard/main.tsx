import { LoggedLayout } from "../../components/layout/LoggedLayout";
import { Role } from "@prisma/client";
import { Header } from "../../components/users/Header";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Dashboard() {  
    const router = useRouter();

    const handleClick = (e: { preventDefault: () => void; }, route: string) => {
        e.preventDefault()
        router.push(route)
    }
    return (
        <LoggedLayout
        title="Dashboard | Leace"
        roles={[Role.ADMIN, Role.AGENCY, Role.OWNER]}
        >
        <div className="flex justify-center h-screen">
            <div className="flex flex-wrap justify-center">
                <div className="w-64 h-64 p-4 bg-gray-200 rounded-lg m-4">
                    <Link 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                        href={`/dashboard/expenses`}
                    >
                        Expenses
                    </Link>
                </div>
                <div className="w-64 h-64 p-4 bg-gray-200 rounded-lg m-4">
                    <Link 
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
                        href={`/dashboard/income`}
                    >
                        Income
                    </Link>
                </div>
                <div className="w-64 h-64 p-4 bg-gray-200 rounded-lg m-4">
                    <Link 
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
                        href={`/dashboard/available`}
                    >
                        Available
                    </Link>
                </div>
                <div className="w-64 h-64 p-4 bg-gray-200 rounded-lg m-4">
                    <Link 
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded w-full"
                        href={`/dashboard/occupied`}
                    >
                        Occupied
                    </Link>
                </div>
                <div className="w-64 h-64 p-4 bg-gray-200 rounded-lg m-4">
                    <Link 
                        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full"
                        href={`/dashboard/clients`}
                    >
                        Clients
                    </Link>
                </div>
                <div className="w-64 h-64 p-4 bg-gray-200 rounded-lg m-4">
                    <Link 
                        className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded w-full"
                        href={`/chat/all`}
                    >
                        Chat
                    </Link>
                </div>
            </div>
        </div>
        </LoggedLayout>
    );
}