import { ListXIcon } from "lucide-react";

interface EmptyListFeedbackProps {
  message: string;
}

const EmptyListFeedback = ({ message }: EmptyListFeedbackProps) => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <ListXIcon size={42} className="text-muted-foreground" />
      <p className="text-lg text-muted-foreground">{message}</p>
    </div>
  );
};

export default EmptyListFeedback;
