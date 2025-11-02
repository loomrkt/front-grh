// ContactInfo.tsx
import Skeleton from "@/components/skeleton";
import { getRemoteComponent } from "@/services/get-remote-component";

interface ContactInfoProps {
  formData: {
    PhoneNumber: string[];
    Email: string[];
  };
  errors?: { propertyName: string; errorMessage: string }[]; // Add errors prop
  onChange: (field: keyof ContactInfoProps["formData"], value: string[]) => void;
}

const ContactInfo = ({ formData, onChange, errors }: ContactInfoProps) => {
  const { CustomInput } = getRemoteComponent();
  if (!CustomInput) return <div className="flex flex-col gap-2 items-start">
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
  </div>

  // Filter errors for specific fields
  const phoneErrors = errors?.filter((err) =>
    err.propertyName.includes("PhoneNumber")
  );
  const emailErrors = errors?.filter((err) => err.propertyName.includes("Email"));

  return (
    <div className="text-center mt-2 space-y-2 w-full">
      <div className="flex flex-col gap-2">
        <div>
          <CustomInput
            label="Téléphone"
            labelClassName="w-30"
            value={formData.PhoneNumber.join(", ")}
            onChange={(value: string) =>
              onChange("PhoneNumber", value.split(", ").map((num) => num.trim()))
            }
            placeholder="Ex: +33 6 12 34 56 78"
          />
          {phoneErrors && phoneErrors.length > 0 && (
            <div className="text-red-500 text-sm mt-1 self-start w-fit">
              {phoneErrors.map((err, index) => (
                <span>
                  {index > 0 && " | "}
                  <span key={index}>{err.errorMessage}</span>
                </span>
              ))}
            </div>
          )}
        </div>
        <div>
          <CustomInput
            label="Email"
            labelClassName="w-30"
            value={formData.Email.join(", ")}
            onChange={(value: string) =>
              onChange("Email", value.split(", ").map((email) => email.trim()))
            }
            placeholder="Ex: example@gmail.com"
          />
          {emailErrors && emailErrors.length > 0 && (
            <div className="text-red-500 text-sm mt-1 self-start w-fit">
              {emailErrors.map((err, index) => (
                <p key={index}>{err.errorMessage}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;