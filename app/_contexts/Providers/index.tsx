import { CustomClerkProvider } from "../CustomClerkProvider";
import { AccountsProvider } from "../AccountsContext";
import { CreditCardsProvider } from "../CreditCardsContext";
import { InvoicesProvider } from "../InvoicesContext";
import { CategoriesProvider } from "../CategoriesContext";
import { ThemeProvider } from "next-themes";
import { ProgressBar } from "@molecules/ProgressBar";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <CustomClerkProvider>
        <ProgressBar>
          <AccountsProvider>
            <CategoriesProvider>
              <CreditCardsProvider>
                <InvoicesProvider>{children}</InvoicesProvider>
              </CreditCardsProvider>
            </CategoriesProvider>
          </AccountsProvider>
        </ProgressBar>
      </CustomClerkProvider>
    </ThemeProvider>
  );
};

export default Providers;
