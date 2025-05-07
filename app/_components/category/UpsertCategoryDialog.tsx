"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Category, TransactionType } from "@prisma/client";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@shadcn/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shadcn/form";
import { Input } from "@shadcn/input";
import { Button } from "@shadcn/button";
import Icon, { type LucideIconName } from "@atoms/Icon";
import { upsertCategory } from "@actions/categories/upsertCategory";
import { useAllCategories } from "@utils/category";
import { ColorInput } from "@shadcn/color-input";
import IconPicker, { ICON_OPTIONS } from "@molecules/IconPicker";
import { useRouter } from "next/navigation";
import { TRANSACTION_TYPE_LABELS } from "@constants/transaction";
import ShouldRender from "@atoms/ShouldRender";
import CategoryButton from "./CategoryButton";
import BackButton from "@atoms/BackButton";

type UpsertCategoryDialogProps = {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  type: TransactionType;
  initialCategory?: Category;
  parentCategory?: Category;
};

const formSchema = z.object({
  name: z.string().trim().min(1, {
    message: "O nome é obrigatório",
  }),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/, {
    message: "Cor inválida. Use hexadecimal",
  }),
  icon: z
    .string()
    .refine(
      (val) =>
        typeof val === "string" && ICON_OPTIONS.includes(val as LucideIconName),
    ),
});

type FormSchema = z.infer<typeof formSchema>;
type CategoryLevel = "category" | "subcategory";
type Step = "initial" | "selectParent" | "form";

const UpsertCategoryDialog = ({
  open,
  setIsOpen,
  type,
  initialCategory,
  parentCategory,
}: UpsertCategoryDialogProps) => {
  const categoryId = initialCategory?.id;
  const isUpdate = !!categoryId;

  const { reload: reloadCategories, categories } = useAllCategories();
  const router = useRouter();

  const [upserting, setUpserting] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Category | null>(
    parentCategory ?? null,
  );
  const [categoryLevel, setCategoryLevel] = useState<CategoryLevel | null>(
    isUpdate
      ? !!initialCategory?.parentId
        ? "subcategory"
        : "category"
      : !!parentCategory
        ? "subcategory"
        : "category",
  );

  const parentCategories = useMemo(
    () => categories.filter((c) => c.parentId === null && c.type === type),
    [categories, type],
  );

  const isSubcategory = categoryLevel === "subcategory";
  const isCategory = categoryLevel === "category";

  const currentStep: Step = useMemo(() => {
    if (!categoryLevel) return "initial";
    if (isSubcategory && !selectedParent) return "selectParent";
    return "form";
  }, [categoryLevel, selectedParent, isSubcategory]);

  const defaultColor = useMemo(() => {
    if (type === "GAIN") return "#22C55E";
    if (type === "EXPENSE") return "#ef4444";
    return "#3b82f6";
  }, [type]);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialCategory?.name || "",
      color: initialCategory?.color || defaultColor,
      icon: initialCategory?.icon || "Ellipsis",
    },
  });

  const dialogTitle = useMemo(() => {
    if (isUpdate) {
      return `Atualizar ${isCategory ? "Categoria" : "Subcategoria"} de ${TRANSACTION_TYPE_LABELS[type]}`;
    }

    switch (currentStep) {
      case "initial":
        return "Selecione entre categoria ou subcategoria";
      case "selectParent":
        return "Selecione a categoria pai";
      case "form":
        return `Criar ${isCategory ? "Categoria" : "Subcategoria"} de ${TRANSACTION_TYPE_LABELS[type]}`;
    }
  }, [isUpdate, isCategory, type, currentStep]);

  const handleCloseDialog = () => {
    setIsOpen(false);
    form.reset();
    setSelectedParent(null);
    setCategoryLevel(null);
    router.replace("/transactions");
  };

  const onSubmit = async (data: FormSchema) => {
    setUpserting(true);

    try {
      await upsertCategory({
        ...data,
        type,
        id: categoryId,
        ...(isSubcategory && { parentId: selectedParent?.id }),
      });
      await reloadCategories(type);
      toast.success(
        `${isSubcategory ? "Subcategoria" : "Categoria"} ${isUpdate ? "atualizada" : "criada"} com sucesso!`,
      );
      handleCloseDialog();
    } catch (error) {
      console.error(error);
      toast.error(
        `Erro ao ${isUpdate ? "atualizar" : "criar"} ${isSubcategory ? "subcategoria" : "categoria!"}`,
      );
    } finally {
      setUpserting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!!open) setIsOpen(true);
        if (!open) handleCloseDialog();
      }}
    >
      <DialogContent className="w-[95svw] max-w-lg">
        <DialogHeader className="m-3 space-y-3">
          <DialogTitle className="text-center">{dialogTitle}</DialogTitle>

          {/* Back button to setp 1 */}
          <BackButton
            onClick={() => setCategoryLevel(null)}
            label="Voltar para o início"
            shouldRender={
              (currentStep === "selectParent" ||
                (currentStep === "form" && isCategory)) &&
              !isUpdate
            }
          />

          {/* Back button to step 2 */}
          <BackButton
            onClick={() => setSelectedParent(null)}
            label="Voltar para categorias"
            shouldRender={currentStep === "form" && isSubcategory && !isUpdate}
          />
        </DialogHeader>

        <ShouldRender if={currentStep === "form" && isSubcategory}>
          <DialogDescription className="mb-2 space-y-2">
            <p>Subcategoria para:</p>
            <div className="flex items-center gap-3">
              <Icon
                name={selectedParent?.icon as LucideIconName}
                {...(selectedParent?.color && { color: selectedParent.color })}
              />
              <p>{selectedParent?.name}</p>
            </div>
          </DialogDescription>
        </ShouldRender>

        <div className="flex max-h-[60vh] flex-col justify-between overflow-y-auto">
          {/* Step 1: select type */}
          <ShouldRender if={currentStep === "initial"}>
            <div className="flex flex-row items-center justify-center gap-3">
              <Button onClick={() => setCategoryLevel("category")}>
                Criar categoria
              </Button>
              <Button
                variant="outline"
                onClick={() => setCategoryLevel("subcategory")}
              >
                Criar subcategoria
              </Button>
            </div>
          </ShouldRender>

          {/* Step 2A: select parent category */}
          <ShouldRender if={currentStep === "selectParent"}>
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

          {/* Step 2B or 3: form */}
          <ShouldRender if={currentStep === "form"}>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex h-full flex-col"
              >
                <div className="mb-8 max-h-[60vh] flex-1 space-y-8 overflow-y-auto px-1 pr-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o nome..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ColorInput
                            defaultValue={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ícone</FormLabel>
                        <FormControl>
                          <IconPicker
                            value={field.value as LucideIconName}
                            onChange={field.onChange}
                            color={form.watch("color")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter className="flex gap-3 md:gap-0">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={upserting}
                    className="min-w-24"
                  >
                    {upserting ? (
                      <Icon name="Loader2" className="animate-spin" />
                    ) : isUpdate ? (
                      "Atualizar"
                    ) : (
                      "Adicionar"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </ShouldRender>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpsertCategoryDialog;
