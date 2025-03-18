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
      <Image
        src={src}
        alt={label || "Bank Logo"}
        width={20}
        height={20}
        {...(label === "C6" && { className: "bg-white" })}
      />
      <span>{label}</span>
    </div>
  );
};
