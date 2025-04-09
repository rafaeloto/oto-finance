import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@shadcn/alert-dialog";
import { Button } from "@shadcn/button";
import { TrashIcon } from "lucide-react";
import { deleteTransaction } from "@actions/transactions/deleteTransaction";
import { toast } from "sonner";
import { cn } from "@/app/_lib/utils";

interface DeleteTransactionButtonProps {
  transactionId: string;
  noPadding?: boolean;
}

const DeleteTransactionButton = ({
  transactionId,
  noPadding = false,
}: DeleteTransactionButtonProps) => {
  const handleConfirmDeleteClick = async () => {
    try {
      await deleteTransaction({ transactionId });
      toast.success("Transação deletada com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao deletar transação!");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size={noPadding ? "sm" : "icon"}
          className={cn("text-muted-foreground", noPadding && "p-0")}
        >
          <TrashIcon />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-[85%] max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Você deseja realmente deletar essa transação?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. Irá deletar permanentemente essa
            transação e remover os dados dos nossos servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmDeleteClick}>
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTransactionButton;
