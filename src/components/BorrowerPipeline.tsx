import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import type { Borrower, ApiResponse, PipelineResponse } from "../types"; // Add 'type'
import { Card, CardContent, CardHeader } from "./ui/card";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

export function BorrowerPipeline() {
  const { activeTab, setActiveTab, setActiveBorrower } = useStore();
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);

  useEffect(() => {
    fetch("/api/sample-response.json")
      .then((res) => res.json())
      .then((data: ApiResponse) => {
        const pipeline = data.endpoints.find(
          (e) => e.name === "Get Borrower Pipeline"
        )?.response as PipelineResponse;
        if (pipeline) {
          setBorrowers([
            ...pipeline.new,
            ...pipeline.in_review,
            ...pipeline.approved,
          ]);
        }
      })
      .catch((error) => console.error("Error fetching borrowers:", error));
  }, []);

  const filteredBorrowers = borrowers.filter(
    (b) =>
      b.status === activeTab || (activeTab === "New" && b.status === "Renew")
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {["New", "In Review", "Approved"].map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <h3 className="uppercase text-sm font-semibold text-gray-600 mb-2">
          F-SANATISED ACTIVE
        </h3>
        {filteredBorrowers.map((borrower) => (
          <Card
            key={borrower.id}
            className="mb-2 cursor-pointer hover:bg-gray-100"
            onClick={() => setActiveBorrower(borrower)}
          >
            <CardContent className="flex justify-between p-4">
              <div>
                <p className="font-semibold">{borrower.name}</p>
                <p className="text-sm text-gray-600">{borrower.loan_type}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  ${borrower.amount.toLocaleString()}
                </p>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-sm bg-${
                    borrower.status === "New" || borrower.status === "Renew"
                      ? "blue"
                      : borrower.status === "In Review"
                      ? "yellow"
                      : "green"
                  }-200`}
                >
                  {borrower.status}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
