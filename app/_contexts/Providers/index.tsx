import { ClerkProvider } from "@clerk/nextjs";
import { AccountsProvider } from "../AccountsContext";
import { CreditCardsProvider } from "../CreditCardsContext";
import { InvoicesProvider } from "../InvoicesContext";
import { CategoriesProvider } from "../CategoriesContext";
import { customAppearance, customPtBR } from "@/app/_lib/clerk";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider appearance={customAppearance} localization={customPtBR}>
      <AccountsProvider>
        <CategoriesProvider>
          <CreditCardsProvider>
            <InvoicesProvider>{children}</InvoicesProvider>
          </CreditCardsProvider>
        </CategoriesProvider>
      </AccountsProvider>
    </ClerkProvider>
  );
};

export default Providers;
