interface LoadingProps {
  message?: string;
}
const Loading = ({ message = "Chargement des données...." }) => {
  return (
    <div>
      <Loader message={message} />
    </div>
  );
};

function Loader({ message }: LoadingProps) {
  return (
    <div className="flex flex-col min-h-[100svh] w-screen justify-center items-center bg-gray-100 p-4">
      <div className="flex flex-row gap-2">
        <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
        <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
        <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
      </div>
      <p>{message}</p>
    </div>
  );
}

export default Loading;