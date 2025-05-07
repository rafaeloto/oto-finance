import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@molecules/Navbar";
import { TransactionType } from "@prisma/client";
import { getCategoryById } from "@data/getCategoryById";
import AddCategoryButton from "./_components/AddCategoryButton";

type CategoriesProps = {
  searchParams: {
    modal?: "open" | "closed";
    type?: TransactionType;
    parentId?: string;
  };
};

const Categories = async ({
  searchParams: { modal, type, parentId },
}: CategoriesProps) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const parentCategory = parentId
    ? await getCategoryById({ id: parentId })
    : undefined;

  console.log({ parentCategory });

  return (
    <>
      <div className="sticky top-0 z-10 md:static md:z-0">
        <Navbar />
        <div className="flex w-full items-center justify-between p-6 md:px-20 md:pt-10">
          <h1 className="text-2xl font-bold">Categorias</h1>
          <AddCategoryButton
            modal={modal}
            type={type}
            {...(!!parentCategory && { parentCategory })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 overflow-y-auto px-6 pb-6 md:gap-10 md:px-20 md:pb-10">
        {/* TODO: Implement page content */}
      </div>
    </>
  );
};

export default Categories;
