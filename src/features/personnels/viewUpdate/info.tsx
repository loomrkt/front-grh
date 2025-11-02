import { Employe } from "@/models/employe.dto";
import { Result } from "@/models/Result";
import ProfileImage from "../ProfileImage";

interface InfoProps {
    employe: Result<Employe>;
}

const Info = ({ employe }: InfoProps) => {
    return ( <>
    <div className="flex max-w-md flex-col items-center justify-center text-center h-full w-fit xl:border-r-1 xl:pl-10 xl:pr-18 not-xl:mx-auto not-xl:mb-4">
        <ProfileImage 
            userId={employe.data.id}
            initialImage={employe.data.identity.profil?.url? process.env.NEXT_PUBLIC_BACKEND + "/uploads" + employe.data.identity.profil.url: undefined}
          />
        <div className="flex flex-col gap-4 p-4">
          <h1 className="text-2xl font-bold">
            {employe.data.identity.civility} {employe.data.identity.firstName} {employe.data.identity.lastName}
          </h1>
          <p className="text-gray-600">
            Genre: {employe.data.identity.gender || "Non renseigné"}
          </p>
          <p className="text-gray-600">
            Matricule: {employe.data.matricule || "Non renseigné"}
          </p>
          <p className="text-gray-600">
            Poste: {employe.data.postName || "Non renseigné"}
          </p>
          <p className="text-gray-600">
            Email: {employe.data.contact.email[0] || "Non renseigné"}
          </p>
          <p className="text-gray-600">
            Telephone: {employe.data.contact.phoneNumber[0] || "Non renseigné"}
          </p>
        </div>
      </div>
    </> );
}
 
export default Info;