"use server";
import { db } from "@/app/_lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { isMatch } from "date-fns";
import { generateAiReportSchema, GenerateAiReportSchema } from "./schema";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

  const user = await clerkClient().users.getUser(userId);
  const userHasPremiumPlan = user.publicMetadata.subscriptionPlan === "premium";
  if (!userHasPremiumPlan) {
    throw new Error("User has no premium plan");
  }

  const transactions = await db.transaction.findMany({
    where: {
      date: {
        gte: new Date(`${year}-${month}-01`),
        lt: new Date(`${year}-${month}-31`),
      },
    },
  });

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("API key not found");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Gere um relatório com insights sobre as minhas finanças, com dicas e orientações de como melhorar minha vida financeira. As transações estão divididas por ponto e vírgula. A estrutura de cada uma é {DATA}-{TIPO}-{VALOR}-{CATEGORIA}. São elas:
        ${transactions
          .map((transaction) => {
            // Identify the category based on the transaction type
            let category = "";
            switch (transaction.type) {
              case "GAIN":
                category = transaction.gainCategory || "Não especificado";
                break;
              case "EXPENSE":
                category = transaction.expenseCategory || "Não especificado";
                break;
              case "INVESTMENT":
                category = transaction.investmentCategory || "Não especificado";
                break;
              case "TRANSFER":
                category = transaction.transferCategory || "Não especificado";
                break;
              default:
                category = "Não especificado";
            }

            // Generate the transaction format in the expected format
            return `${transaction.date.toLocaleDateString("pt-BR")}-R$${transaction.amount}-${transaction.type}-${category}`;
          })
          .join(";")}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return text;
};
