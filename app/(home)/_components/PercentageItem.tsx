import { ReactNode } from "react";

interface PercentageItemProps {
  icon: ReactNode;
  title: string;
  value: number;
}

const PercentageItem = (props: PercentageItemProps) => {
  const { icon, title, value } = props;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {icon}
        <p className="text-muted-foreground">{title}</p>
      </div>
      <p className="font-bold">{value}%</p>
    </div>
  );
};

export default PercentageItem;
