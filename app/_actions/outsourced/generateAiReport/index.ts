"use server";
import { auth } from "@clerk/nextjs/server";
import { isMatch } from "date-fns";
import { generateAiReportSchema, GenerateAiReportSchema } from "./schema";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getUser } from "@data/getUser";
import { getTransactions } from "@data/getTransactions";
import { getCategoryById } from "@data/getCategoryById";

export const generateAiReport = async ({
  month,
  year,
}: GenerateAiReportSchema) => {
  generateAiReportSchema.parse({ month });

  if (!isMatch(month, "MM")) {
    throw new Error("Invalid month");
  }

  if (!isMatch(year, "yyyy")) {
    throw new Error("Invalid year");
  }

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await getUser();
  const userHasPremiumPlan = user.publicMetadata.subscriptionPlan === "premium";
  if (!userHasPremiumPlan) {
    throw new Error("User has no premium plan");
  }

  const transactions = await getTransactions({ month, year });

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("API key not found");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const transactionStrings = await Promise.all(
    transactions.map(async (transaction) => {
      const category = await getCategoryById({
        id: transaction.categoryId || "",
      });

      return `${transaction.date.toLocaleDateString("pt-BR")}-R$${transaction.amount}-${transaction.type}-${category?.name}`;
    }),
  );

  const prompt = `Gere um relatório com insights sobre as minhas finanças, com dicas e orientações de como melhorar minha vida financeira. As transações estão divididas por ponto e vírgula. A estrutura de cada uma é {DATA}-{TIPO}-{VALOR}-{CATEGORIA}. São elas: ${transactionStrings.join(";")}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return text;
};
