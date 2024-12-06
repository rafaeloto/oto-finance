// app/components/Providers.tsx
import { ClerkProvider } from "@clerk/nextjs";
import { AccountsProvider } from "../AccountsContext";
import { CreditCardsProvider } from "../CreditCardsContext";
import { InvoicesProvider } from "../InvoicesContext";
import { dark } from "@clerk/themes";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <AccountsProvider>
        <CreditCardsProvider>
          <InvoicesProvider>{children}</InvoicesProvider>
        </CreditCardsProvider>
      </AccountsProvider>
    </ClerkProvider>
  );
};

export default Providers;
