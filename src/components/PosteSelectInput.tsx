"use client";
import { getRemoteComponent } from "@/services/get-remote-component";
import Skeleton from "@/components/skeleton";
import { Poste } from "@/models/Poste";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PaginatedResult } from "@/models/PaginatedResult";
import { getPostesList } from "@/services/poste";

interface PosteSelectInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PosteSelectInput({
  value,
  onChange,
}: PosteSelectInputProps) {
  const { data: postes, error } = useSuspenseQuery<PaginatedResult<Poste>>({
    queryKey: ["AllPostes"],
    queryFn: () => getPostesList(),
  });

  const { CustomInput } = getRemoteComponent();
  const options = postes.data.map((poste) => {
    const option = {
      label: `${poste.posteTitle} (${poste.posteCode})`,
      value: poste.postId,
    };
    return option;
  });

  return CustomInput ? (
    <CustomInput
      type="select"
      label="Poste"
      labelClassName="w-40"
      value={value}
      onChange={(val: string) => {
        onChange(val);
      }}
      selectOptions={options}
    />
  ) : (
    <Skeleton className="h-10 w-full" />
  );
}