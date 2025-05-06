import { cn } from "@/app/_lib/utils";
import Icon, { type LucideIconName } from "@atoms/Icon";

type IconPickerProps = {
  value: LucideIconName;
  onChange: (iconName: LucideIconName) => void;
  color?: string;
  size?: number;
};

// Available icons
export const ICON_OPTIONS: LucideIconName[] = [
  // Expense
  "ShoppingCart",
  "Utensils",
  "Car",
  "Home",
  "HeartPulse",
  "Gamepad2",
  "Fuel",
  "Plane",
  "Shirt",
  "Train",

  // Gain
  "DollarSign",
  "Wallet",
  "Coins",
  "Banknote",
  "PiggyBank",
  "Activity",
  "BadgeDollarSign",
  "Briefcase",

  // Transfer
  "Repeat",
  "ArrowLeftRight",
  "Send",
  "Ellipsis",

  // Investiment
  "BarChart",
  "LineChart",
  "PieChart",
  "TrendingUp",
  "TrendingDown",
  "TrendingUpDown",

  // Generic
  "Tag",
  "List",
  "Star",
  "Gift",
  "Camera",
  "GraduationCap",
  "Lightbulb",
  "Phone",
];

const IconPicker = ({ value, onChange, color, size }: IconPickerProps) => {
  return (
    <div className="grid grid-cols-6 gap-2">
      {ICON_OPTIONS.map((iconName) => (
        <button
          key={iconName}
          type="button"
          onClick={() => onChange(iconName)}
          className={cn(
            "flex items-center justify-center rounded-lg border p-2 transition-colors hover:bg-muted",
            value === iconName && "border-primary bg-primary/10",
          )}
        >
          <Icon
            name={iconName}
            {...(!!color && { color })}
            {...(!!size && { size })}
          />
        </button>
      ))}
    </div>
  );
};

export default IconPicker;
