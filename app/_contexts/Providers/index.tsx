import { CustomClerkProvider } from "../CustomClerkProvider";
import { AccountsProvider } from "../AccountsContext";
import { CreditCardsProvider } from "../CreditCardsContext";
import { InvoicesProvider } from "../InvoicesContext";
import { CategoriesProvider } from "../CategoriesContext";
import { ThemeProvider } from "next-themes";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <CustomClerkProvider>
        <AccountsProvider>
          <CategoriesProvider>
            <CreditCardsProvider>
              <InvoicesProvider>{children}</InvoicesProvider>
            </CreditCardsProvider>
          </CategoriesProvider>
        </AccountsProvider>
      </CustomClerkProvider>
    </ThemeProvider>
  );
};

export default Providers;
