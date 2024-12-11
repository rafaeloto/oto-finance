import Navbar from "@/app/_components/navbar";

interface CardDetailsProps {
  searchParams: {
    id: string;
  };
}

const CreditCardDetails = async ({
  searchParams: { id },
}: CardDetailsProps) => {
  return (
    <>
      <Navbar />

      <div className="flex h-screen flex-col space-y-6 overflow-hidden px-20 py-10">
        <div className="flex w-full items-center">
          <h1 className="text-2xl font-bold">Detalhes do cartão</h1>
        </div>
        <div>Detalhes do cartão: {id}</div>
        <h1 className="text-5xl font-bold">Página sob construção</h1>
      </div>
    </>
  );
};

export default CreditCardDetails;
