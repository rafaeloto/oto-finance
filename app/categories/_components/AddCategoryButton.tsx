"use client";

import { useState } from "react";
import FloatingActionMenu from "@shadcn/floating-action-menu";
import Icon from "@atoms/Icon";
import UpsertCategoryDialog from "@components/category/UpsertCategoryDialog";
import { Category, TransactionType } from "@prisma/client";
import useIsDesktop from "@utils/useIsDesktop";

type AddCategoryButtonProps = {
  modal?: "open" | "closed";
  type?: TransactionType;
  parentCategory?: Category;
  category?: Category;
};

const AddCategoryButton = ({
  modal,
  type,
  parentCategory,
  category,
}: AddCategoryButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(modal === "open");
  const [dialogType, setDialogType] = useState<TransactionType>(
    type || "EXPENSE",
  );

  const isDesktop = useIsDesktop();

  const handleOpenDialog = (type: TransactionType) => {
    setDialogType(type);
    setIsDialogOpen(true);
  };

  const options = [
    {
      label: "Despesa",
      Icon: <Icon name="ArrowDown" className="h-4 w-4 text-red-500" />,
      onClick: () => handleOpenDialog("EXPENSE"),
    },
    {
      label: "Receita",
      Icon: <Icon name="DollarSign" className="h-4 w-4 text-green-500" />,
      onClick: () => handleOpenDialog("GAIN"),
    },
  ];

  return (
    <>
      <FloatingActionMenu
        options={options}
        className="rounded-full font-bold"
        triggerLabel={isDesktop ? "Adicionar categoria" : "Adicionar"}
        divLeftAdjustment={105}
      />

      <UpsertCategoryDialog
        key={dialogType}
        open={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        type={dialogType}
        parentCategory={parentCategory}
        initialCategory={category}
      />
    </>
  );
};

export default AddCategoryButton;
