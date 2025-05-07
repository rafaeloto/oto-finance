import ShouldRender from "@atoms/ShouldRender";
import { Button } from "@shadcn/button";
import Icon from "@atoms/Icon";

type BackButtonProps = {
  onClick: () => void;
  label: string;
  shouldRender?: boolean;
};

const BackButton = ({
  onClick,
  label,
  shouldRender = true,
}: BackButtonProps) => {
  return (
    <ShouldRender if={shouldRender}>
      <Button
        onClick={onClick}
        variant="ghost"
        className="flex items-center justify-start gap-3 px-0"
      >
        <Icon name="ArrowLeft" />
        <p>{label}</p>
      </Button>
    </ShouldRender>
  );
};

export default BackButton;
