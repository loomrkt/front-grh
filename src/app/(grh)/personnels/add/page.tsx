import UserCard from "@/features/personnels/UserCard";

export default function Page() {
    return (
        <div className="flex flex-wrap gap-4 p-4 min-h-full">
            <div className="not-lg:w-full lg:w-fit flex justify-center items-center">
                <UserCard />
            </div>
            <div className="w-full lg:flex-1">
                hello
            </div>
        </div>
    );
}
