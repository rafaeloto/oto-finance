import Image from "next/image";

type ImageAndLabelOptionParams = {
  src: string;
  label: string;
};

export const ImageAndLabelOption = ({
  src,
  label,
}: ImageAndLabelOptionParams) => {
  return (
    <div className="flex items-center space-x-5">
      <Image src={src} alt={label || "Bank Logo"} width={30} height={30} />
      <span>{label}</span>
    </div>
  );
};
