import { useEffect, useState } from "react";
import type { Broker, ApiResponse } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Phone, Mail, MessageSquare } from "lucide-react";
import { OnboardingWorkflow } from "./OnboardingWorkflow";

export function BrokerOverview() {
  const [broker, setBroker] = useState<Broker | null>(null);
  const [steps, setSteps] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/sample-response.json")
      .then((res) => res.json())
      .then((data: ApiResponse) => {
        const brokerData = data.endpoints.find(
          (e) => e.name === "Get Broker Info"
        )?.response as Broker;
        const workflow = data.endpoints.find(
          (e) => e.name === "Get Onboarding Workflow"
        )?.response as { steps: string[] };
        setBroker(brokerData);
        setSteps(workflow?.steps || []);
      })
      .catch((error) => console.error("Error fetching broker:", error));
  }, []);

  if (!broker) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{broker.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-semibold">{broker.deals}</p>
            <p className="text-sm text-gray-600">Deals</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{broker.approval_rate}</p>
            <p className="text-sm text-gray-600">Approval Rate</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">
              ${broker.pending.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
        </div>
        <div className="mt-4 flex space-x-2">
          <Button className="flex-1">
            <Phone className="mr-2 h-5 w-5" /> Call
          </Button>
          <Button className="flex-1">
            <Mail className="mr-2 h-5 w-5" /> Email
          </Button>
          <Button className="flex-1">
            <MessageSquare className="mr-2 h-5 w-5" /> Chat
          </Button>
        </div>
        <OnboardingWorkflow steps={steps} />
        <div className="mt-4 flex items-center">
          <Switch id="e-ardsassist" />
          <label htmlFor="e-ardsassist" className="ml-2">
            E Ardsassist
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
