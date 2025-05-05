import { useFormContext } from "react-hook-form";
import { useMemo, useState } from "react";
import { Category } from "@prisma/client";
import { FormField, FormItem, FormLabel } from "@shadcn/form";
import Icon from "@atoms/Icon";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shadcn/dialog";
import ShouldRender from "@atoms/ShouldRender";
import { Button } from "@shadcn/button";
import CategoryButton from "./CategoryButton";

type CategoryFieldProps = {
  categories: Category[];
};

const CategoryField = ({ categories }: CategoryFieldProps) => {
  const { control, setValue } = useFormContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Category | null>(null);

  const parentCategories = useMemo(
    () => categories.filter((c) => c.parentId === null),
    [categories],
  );

  const subcategoriesMap = useMemo(() => {
    const map: Record<string, Category[]> = {};
    categories.forEach((cat) => {
      if (cat.parentId) {
        if (!map[cat.parentId]) map[cat.parentId] = [];
        map[cat.parentId].push(cat);
      }
    });
    return map;
  }, [categories]);

  const parentSubcategories = useMemo(() => {
    if (!selectedParent) return [];
    return subcategoriesMap[selectedParent.id] || [];
  }, [selectedParent, subcategoriesMap]);

  return (
    <>
      <div>
        <FormField
          control={control}
          name="categoryId"
          render={({ field }) => {
            const selected = categories.find((cat) => cat.id === field.value);
            const parent = categories.find(
              (cat) => cat.id === selected?.parentId,
            );

            return (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <CategoryButton
                  category={selected}
                  onClick={() => setModalOpen(true)}
                  parent={parent}
                />
              </FormItem>
            );
          }}
        />
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="w-[95svw] max-w-lg">
          <DialogHeader className="mb-3 space-y-2">
            <DialogTitle>
              {selectedParent
                ? "Selecione uma subcategoria"
                : "Selecione uma categoria"}
            </DialogTitle>

            <ShouldRender if={!!selectedParent}>
              {/* Back button */}
              <Button
                onClick={() => setSelectedParent(null)}
                variant="ghost"
                className="flex items-center justify-start gap-3 px-0"
              >
                <Icon name="ArrowLeft" />
                <p>Voltar para categorias</p>
              </Button>
            </ShouldRender>
          </DialogHeader>

          <div className="flex max-h-[60vh] flex-col justify-between overflow-y-auto">
            <ShouldRender if={!selectedParent}>
              <div className="min-h-[40vh] space-y-2">
                {parentCategories.map((cat) => (
                  <CategoryButton
                    key={cat.id}
                    category={cat}
                    onClick={() => setSelectedParent(cat)}
                  />
                ))}
              </div>
            </ShouldRender>

            <ShouldRender if={!!selectedParent}>
              <ShouldRender if={!!parentSubcategories.length}>
                <div className="min-h-[40vh] space-y-2">
                  {parentSubcategories.map((cat) => (
                    <CategoryButton
                      key={cat.id}
                      category={cat}
                      onClick={() => {
                        setValue("categoryId", cat.id);
                        setModalOpen(false);
                        setSelectedParent(null);
                      }}
                    />
                  ))}
                </div>
              </ShouldRender>

              <ShouldRender if={!parentSubcategories.length}>
                <p className="flex min-h-[30vh] items-center justify-center text-center text-muted-foreground selection:py-4">
                  Não existem subcategorias para esta categoria.
                </p>
              </ShouldRender>
            </ShouldRender>
          </div>

          <DialogFooter>
            {/* TODO: Add buttons for creating a new category */}

            {/* Option to not select a subcategory */}
            <ShouldRender if={!!selectedParent}>
              <Button
                onClick={() => {
                  setValue("categoryId", selectedParent?.id);
                  setModalOpen(false);
                  setSelectedParent(null);
                }}
                className="w-full"
              >
                Não selecionar subcategoria
              </Button>
            </ShouldRender>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoryField;
