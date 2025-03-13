import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-gray-900 bg-opacity-50">
      <Loader2Icon className="animate-spin" size={50} />
      <div className="ml-2">Carregando</div>
    </div>
  );
}
