import { ClerkProvider } from "@clerk/nextjs";
import { AccountsProvider } from "../AccountsContext";
import { CreditCardsProvider } from "../CreditCardsContext";
import { InvoicesProvider } from "../InvoicesContext";
import { dark } from "@clerk/themes";
import { CategoriesProvider } from "../CategoriesContext";
import { ptBR } from "@clerk/localizations";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }} localization={ptBR}>
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
