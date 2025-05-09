import Icon from "@atoms/Icon";
import SummaryCard from "./SummaryCard";
import ShouldRender from "@atoms/ShouldRender";

interface SummaryCardsProps {
  result: number;
  totalBalance: number;
  investmentsResult: number;
  investmentsEvolution: number;
  gainsTotal: number;
  expensesTotal: number;
  period: string;
}

const SummaryCards = async ({
  result,
  totalBalance,
  investmentsResult,
  investmentsEvolution,
  gainsTotal,
  expensesTotal,
  period,
}: SummaryCardsProps) => {
  const getTextColor = (value: number) => {
    if (value > 0) {
      return "text-primary";
    }
    if (value < 0) {
      return "text-red-500";
    }
    return "";
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <SummaryCard
          icon={<Icon name="Wallet" size={16} />}
          title="Saldo Total"
          amount={totalBalance}
          link="/accounts"
          size="large"
        />

        <SummaryCard
          icon={
            <Icon
              name="TrendingUpDown"
              size={16}
              className={getTextColor(result)}
            />
          }
          title="Resultado do mês"
          amount={result}
          link="/transactions"
          size="large"
          textColor={getTextColor(result)}
          period={period}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold">Investimentos</p>
            <ShouldRender if={!!period}>
              <span className="text-muted-foreground">-</span>
              <p className="text-muted-foreground">{period}</p>
            </ShouldRender>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <SummaryCard
              icon={
                <Icon
                  name="PiggyBank"
                  size={16}
                  className={getTextColor(investmentsEvolution)}
                />
              }
              title="Evolução"
              amount={investmentsEvolution}
              link="/transactions?type=INVESTMENT"
              textColor={getTextColor(investmentsEvolution)}
            />

            <SummaryCard
              icon={
                <Icon
                  name="TrendingUpDown"
                  size={16}
                  className={getTextColor(investmentsResult)}
                />
              }
              title="Resultado"
              amount={investmentsResult}
              link="/transactions?type=INVESTMENT"
              textColor={getTextColor(investmentsResult)}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold">Movimentações</p>
            <ShouldRender if={!!period}>
              <span className="text-muted-foreground">-</span>
              <p className="text-muted-foreground">{period}</p>
            </ShouldRender>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <SummaryCard
              icon={
                <Icon name="TrendingUp" size={16} className="text-primary" />
              }
              title="Receita"
              amount={gainsTotal}
              link="/transactions?type=GAIN"
            />

            <SummaryCard
              icon={
                <Icon name="TrendingDown" size={16} className="text-red-500" />
              }
              title="Despesas"
              amount={expensesTotal}
              link="/transactions?type=EXPENSE"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
