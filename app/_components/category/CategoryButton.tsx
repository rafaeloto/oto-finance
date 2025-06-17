import { Category } from "@prisma/client";
import Icon, { type LucideIconName } from "@atoms/Icon";
import ShouldRender from "@atoms/ShouldRender";
import LoanTooltip from "@molecules/LoanTooltip";
import { isLoanCategory } from "@utils/category";

type CategoryButtonProps = {
  category: Category | undefined;
  onClick: () => void;
  parent?: Category;
};

const CategoryButton = ({ category, onClick, parent }: CategoryButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg border p-4 hover:bg-muted"
      type="button"
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex w-full items-center gap-3">
          <ShouldRender if={!!category}>
            <Icon
              name={category?.icon as LucideIconName}
              {...(category?.color && { color: category.color })}
            />
            <div className="flex flex-col items-start">
              <span>{category?.name}</span>
              <ShouldRender if={!!parent}>
                <span className="text-xs text-muted-foreground">
                  {parent?.name}
                </span>
              </ShouldRender>
            </div>
            <ShouldRender if={isLoanCategory(category?.id)}>
              <LoanTooltip position="top" context="category" />
            </ShouldRender>
          </ShouldRender>

          <ShouldRender if={!category}>
            <span className="text-muted-foreground">
              Selecione uma categoria...
            </span>
          </ShouldRender>
        </div>
        <Icon name="ArrowRight" />
      </div>
    </button>
  );
};

export default CategoryButton;
