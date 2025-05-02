import * as LucideIcons from "lucide-react";
import type { ComponentProps } from "react";

type LucideIconName = keyof typeof LucideIcons;

type IconProps = {
  name: LucideIconName;
} & ComponentProps<typeof LucideIcons.Circle>;

const Icon = ({ name, ...props }: IconProps) => {
  const Icon = LucideIcons[name] as React.ComponentType<
    ComponentProps<typeof LucideIcons.Circle>
  >;
  return <Icon {...props} />;
};

export default Icon;
