import { Category } from "@prisma/client";
import Icon, { type LucideIconName } from "@atoms/Icon";
import ShouldRender from "@atoms/ShouldRender";

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
          {category ? (
            <>
              <Icon
                name={category.icon as LucideIconName}
                {...(category.color && { color: category.color })}
              />
              <div className="flex flex-col items-start">
                <span>{category.name}</span>
                <ShouldRender if={!!parent}>
                  <p className="text-xs text-muted-foreground">
                    {parent?.name}
                  </p>
                </ShouldRender>
              </div>
            </>
          ) : (
            <span className="text-muted-foreground">
              Selecione uma categoria...
            </span>
          )}
        </div>
        <Icon name="ArrowRight" />
      </div>
    </button>
  );
};

export default CategoryButton;
