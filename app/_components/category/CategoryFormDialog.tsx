import { zodResolver } from "@hookform/resolvers/zod";
import { Category, TransactionType } from "@prisma/client";
import { useState } from "react";
import { Form, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shadcn/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shadcn/form";
import { Input } from "@shadcn/input";
import { Button } from "@shadcn/button";
import Icon from "@atoms/Icon";
import { upsertCategory } from "@actions/categories/upsertCategory";
import { useAllCategories } from "@utils/category";

type CategoryFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: TransactionType;
  initialCategory?: Category;
  parentCategory?: Category;
  onSuccess?: (category: Category) => void;
};

const CategoryFormDialog = ({
  open,
  onOpenChange,
  type,
  initialCategory,
  parentCategory,
  onSuccess,
}: CategoryFormDialogProps) => {
  const categoryId = initialCategory?.id;
  const isUpdate = !!categoryId;

  const { reload } = useAllCategories();

  const formSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
  });

  type FormSchema = z.infer<typeof formSchema>;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialCategory?.name || "",
    },
  });

  const [upserting, setUpserting] = useState(false);

  const onSubmit = async (data: FormSchema) => {
    setUpserting(true);

    try {
      const category = await upsertCategory({
        ...data,
        type,
        id: categoryId,
        parentId: parentCategory?.id,
      });
      toast.success(
        `Categoria ${isUpdate ? "atualizada" : "criada"} com sucesso!`,
      );
      onOpenChange(false);
      form.reset();
      reload(type);
      if (onSuccess) onSuccess(category);
    } catch (error) {
      console.error(error);
      toast.error(`Erro ao ${isUpdate ? "atualizar" : "criar"} categoria!`);
    } finally {
      setUpserting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isUpdate
              ? "Editar categoria"
              : parentCategory
                ? "Criar subcategoria"
                : "Criar categoria"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-full flex-col"
          >
            <div className="mb-8 flex-1 space-y-8 px-1">
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
            </div>

            <DialogFooter className="flex gap-3 md:gap-0">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={upserting} className="min-w-24">
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
      </DialogContent>
    </Dialog>
  );
};

export default CategoryFormDialog;
