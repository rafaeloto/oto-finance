"use client";

import { Button } from "@shadcn/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@shadcn/dialog";
import Icon from "@atoms/Icon";
import { useState } from "react";
import { generateAiReport } from "@actions/outsourced/generateAiReport";
import { ScrollArea } from "@shadcn/scroll-area";
import Markdown from "react-markdown";
import Link from "@atoms/Link";
import useIsDesktop from "@utils/useIsDesktop";

interface AiReportButtonProps {
  hasPremiumPlan: boolean;
  month: string;
  year: string;
}

const AiReportButton = ({
  month,
  year,
  hasPremiumPlan,
}: AiReportButtonProps) => {
  const [reportIsLoading, setReportIsLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const isDesktop = useIsDesktop();

  const handleGenerateReportClick = async () => {
    try {
      setReportIsLoading(true);
      const report = await generateAiReport({ month, year });
      setReport(report);
    } catch (error) {
      console.error(error);
    } finally {
      setReportIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full">
          {isDesktop ? "Relatório IA" : "IA"}
          <Icon name="Bot" />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[95svw] max-w-lg">
        {hasPremiumPlan ? (
          <>
            <DialogHeader>
              <DialogTitle>Relatório IA</DialogTitle>
              <DialogDescription>
                Use inteligência artificial para gerar um relatório com insights
                sobre suas finanças.
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="prose max-h-[450px] text-foreground prose-h2:text-foreground prose-h3:text-foreground prose-h4:text-foreground prose-strong:text-foreground">
              <Markdown>{report}</Markdown>
            </ScrollArea>

            <DialogFooter className="flex gap-3 md:gap-0">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>

              <Button
                onClick={handleGenerateReportClick}
                disabled={reportIsLoading}
              >
                {reportIsLoading && (
                  <Icon name="Loader2" className="mr-2 animate-spin" />
                )}
                Gerar relatório
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Relatório IA</DialogTitle>
              <DialogDescription>
                Você precisa de um plano premium para gerar os relatórios com
                IA.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex gap-3 md:gap-0">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>

              <Button asChild>
                <Link href="/subscription">Assinar plano premium</Link>
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AiReportButton;
