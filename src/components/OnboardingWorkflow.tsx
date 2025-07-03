import { Card, CardContent } from "./ui/card";

interface OnboardingWorkflowProps {
  steps: string[];
}

export function OnboardingWorkflow({ steps }: OnboardingWorkflowProps) {
  return (
    <Card className="mt-4">
      <CardContent>
        <h3 className="font-semibold mb-2">Onboarding Workflow</h3>
        <ol className="list-decimal pl-4">
          {steps.map((name, index) => (
            <li
              key={index}
              className={index < 3 ? "text-green-600" : "text-gray-600"}
            >
              {name}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
