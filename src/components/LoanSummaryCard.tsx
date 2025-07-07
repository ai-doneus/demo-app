import type { BorrowerDetails } from "../types"; // Add 'type'
import { Card, CardContent } from "./ui/card";
import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
interface LoanSummaryCardProps {
  details: BorrowerDetails;
}

export function LoanSummaryCard({ details }: LoanSummaryCardProps) {
  return (
    <Card className="mt-4">
      <CardContent>
        <h3 className="font-semibold mb-2">Loan Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Employment</p>
            <p>{details.employment}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Income</p>
            <p>${details.income.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Existing Loan</p>
            <p>${details.existing_loan.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Credit Score</p>
            <p>{details.credit_score}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Source of Funds</p>
            <p>{details.source_of_funds}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center text-yellow-600">
          <AlertTriangle className="mr-2 h-5 w-5" />
          <p>{details.risk_signal}</p>
        </div>
        <Button
          className="mt-4 w-full"
          onClick={() =>
            console.log("Escalate to Credit Committee:", {
              id: details.id,
              response: {
                success: true,
                message: "Escalated to Credit Committee.",
              },
            })
          }
          disabled={!details.ai_flags.length}
        >
          Escalate to Credit Committee
        </Button>
      </CardContent>
    </Card>
  );
}
