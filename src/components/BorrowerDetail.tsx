import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import type { BorrowerDetails, ApiResponse } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { LoanSummaryCard } from "@/components/LoanSummaryCard";

export function BorrowerDetail() {
  const { activeBorrower } = useStore();
  const [details, setDetails] = useState<BorrowerDetails | null>(null);
  
  useEffect(() => {
  if (activeBorrower) {
    fetch("/api/sample-response.json")
      .then((res) => res.json())
      .then((data: ApiResponse) => {
        const detailEndpoint = data.endpoints.find(
          (e) => e.name === "Get Borrower Detail"
        );

        // Try to access the borrower detail using the ID as key
        const detailMap = (detailEndpoint as any)?.responses;
        const detail = detailMap?.[String(activeBorrower.id)];
        if (detail) {
          setDetails(detail);
        } else {
          console.warn("No borrower detail found for ID:", activeBorrower.id);
        }
      })
      .catch((error) => console.error("Error fetching details:", error));
  }
}, [activeBorrower]);

  if (!activeBorrower || !details) {
    return (
      <Card>
        <CardContent className="p-4">Select a borrower</CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{details.name}</CardTitle>
        <p className="font-semibold">{details.name}</p>
        <p>{details.email}</p>
        <p>{details.phone}</p>
        <p className="font-semibold">${details.loan_amount.toLocaleString()}</p>
        <span
          className={`inline-block px-2 py-1 rounded-full text-sm bg-${
            details.status === "New" || details.status === "Renew"
              ? "blue"
              : details.status === "In Review"
              ? "yellow"
              : "green"
          }-200`}
        >
          {details.status}
        </span>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="ai-explainability">
            <AccordionTrigger>AI Explainability</AccordionTrigger>
            <AccordionContent>
              {details.ai_flags.map((flag, index) => (
                <div key={index} className="flex items-center text-red-600 mb-2">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  <p>{flag}</p>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="mt-4 flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
          <Button
            onClick={() =>
              console.log("Request Documents:", {
                id: details.id,
                response: { success: true, message: "Documents requested." },
              })
            }
          >
            Request Documents
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              console.log("Send to Valuer:", {
                id: details.id,
                response: { success: true, message: "Valuer notified." },
              })
            }
          >
            Send to Valuer
          </Button>
          <Button
            onClick={() =>
              console.log("Approve:", {
                id: details.id,
                response: { success: true, message: "Loan approved." },
              })
            }
          >
            Approve
          </Button>
        </div>
        <LoanSummaryCard details={details} />
      </CardContent>
    </Card>
  );
}