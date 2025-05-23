import { Badge } from "@shadcn/badge";
import { Card, CardContent, CardHeader } from "@shadcn/card";
import Icon from "@atoms/Icon";
import AquirePlanButton from "./AquirePlanButton";
import ShouldRender from "@atoms/ShouldRender";

type PlanCardProps = {
  isActive: boolean;
  title: string;
  value: number;
  includedFeatures?: string[];
  notIncludedFeatures?: string[];
  showAquirePlanButton?: boolean;
};

const PlanCard = (props: PlanCardProps) => {
  const {
    isActive,
    title,
    value,
    includedFeatures,
    notIncludedFeatures,
    showAquirePlanButton = false,
  } = props;

  return (
    <Card className="w-full max-w-96">
      <CardHeader className="relative border-b border-solid py-8">
        {isActive && (
          <Badge className="absolute left-4 top-8 bg-primary/10 text-base text-primary">
            Ativo
          </Badge>
        )}
        <h2 className="text-center text-2xl font-semibold">{title}</h2>
        <div className="flex items-center justify-center gap-3">
          <span className="text-4xl">R$</span>
          <span className="text-6xl font-semibold">{value}</span>
          <span className="text-2xl text-muted-foreground">/mês</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 py-8">
        {includedFeatures?.map((feature) => (
          <div className="flex items-center gap-2" key={feature}>
            <Icon name="Check" className="text-primary" />
            <p>{feature}</p>
          </div>
        ))}

        {notIncludedFeatures?.map((feature) => (
          <div className="flex items-center gap-2" key={feature}>
            <Icon name="X" />
            <p>{feature}</p>
          </div>
        ))}

        <ShouldRender if={showAquirePlanButton}>
          <AquirePlanButton />
        </ShouldRender>
      </CardContent>
    </Card>
  );
};

export default PlanCard;
