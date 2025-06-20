import { useFormContext } from "react-hook-form";
import { useMemo, useState } from "react";
import { Category, TransactionType } from "@prisma/client";
import { FormField, FormItem, FormLabel } from "@shadcn/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shadcn/dialog";
import ShouldRender from "@atoms/ShouldRender";
import { Button } from "@shadcn/button";
import CategoryButton from "@components/category/CategoryButton";
import BackButton from "@atoms/BackButton";
import Icon from "@atoms/Icon";
import { cn } from "@/app/_lib/utils";
import { isLoanCategory } from "@utils/category";

export type openCategoryDialogProps = {
  category?: Category;
  parent?: Category;
};

type CategoryFieldProps = {
  categories: Category[];
  type: TransactionType;
  openCategoryDialog: (props: openCategoryDialogProps) => void;
};

const CategoryField = ({
  categories,
  type,
  openCategoryDialog,
}: CategoryFieldProps) => {
  const { control, setValue } = useFormContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Category | null>(null);

  const canCreateCategory = useMemo(() => {
    if (type === "INVESTMENT" || type === "TRANSFER") return false;
    return true;
  }, [type]);

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

      <Dialog
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setSelectedParent(null);
        }}
      >
        <DialogContent className="w-[95svw] max-w-lg">
          <DialogHeader className="m-3 space-y-3">
            <DialogTitle className="text-center">
              {selectedParent
                ? "Selecione uma subcategoria"
                : "Selecione uma categoria"}
            </DialogTitle>

            {/* Back button */}
            <BackButton
              onClick={() => setSelectedParent(null)}
              label="Voltar para categorias"
              shouldRender={!!selectedParent}
            />
          </DialogHeader>

          <div className="flex max-h-[60vh] flex-col justify-between overflow-y-auto">
            <ShouldRender if={!selectedParent}>
              <div className="space-y-2">
                {parentCategories.map((cat) => (
                  <div className="flex items-center gap-2" key={cat.id}>
                    <CategoryButton
                      category={cat}
                      onClick={() => {
                        if (canCreateCategory && !isLoanCategory(cat.id))
                          setSelectedParent(cat);
                        else {
                          setValue("categoryId", cat.id);
                          setModalOpen(false);
                          setSelectedParent(null);
                        }
                      }}
                    />

                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "text-muted-foreground",
                        !cat.userId && "hidden",
                      )}
                      onClick={() => openCategoryDialog({ category: cat })}
                    >
                      <Icon name="Pencil" />
                    </Button>
                  </div>
                ))}
              </div>
            </ShouldRender>

            <ShouldRender if={!!selectedParent}>
              <ShouldRender if={!!parentSubcategories.length}>
                <div className="space-y-2">
                  {parentSubcategories.map((cat) => (
                    <div className="flex items-center gap-2" key={cat.id}>
                      <CategoryButton
                        category={cat}
                        onClick={() => {
                          setValue("categoryId", cat.id);
                          setModalOpen(false);
                          setSelectedParent(null);
                        }}
                      />

                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "text-muted-foreground",
                          !cat.userId && "hidden",
                        )}
                        onClick={() => {
                          openCategoryDialog({
                            category: cat,
                            ...(selectedParent && { parent: selectedParent }),
                          });
                        }}
                      >
                        <Icon name="Pencil" />
                      </Button>
                    </div>
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

          <DialogFooter className="flex flex-col gap-3 md:flex-col md:gap-3 md:space-x-0">
            {/* Option to not select a subcategory */}
            <ShouldRender if={!!selectedParent}>
              <Button
                type="button"
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

            {/* Create category button */}
            <ShouldRender if={canCreateCategory}>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  openCategoryDialog({
                    ...(selectedParent && { parent: selectedParent }),
                  });
                }}
                className="w-full"
              >
                Criar {selectedParent ? "subcategoria" : "categoria"}
              </Button>
            </ShouldRender>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoryField;
