import { BorrowerPipeline } from "./BorrowerPipeline";
import { BorrowerDetail } from "./BorrowerDetail";
import { BrokerOverview } from "./BrokerOverview";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Search, HelpCircle, Bell } from "lucide-react";

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font">DemoApp</h1>
        <div className="flex space-x-4">
          <Search className="h-6 w-6" />
          <HelpCircle className="h-6 w-6" />
          <Bell className="h-6 w-6" />
        </div>
      </header>
      <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <BorrowerPipeline />
        <BorrowerDetail />
        <div className="md:block">
          <Accordion type="single" collapsible className="md:hidden">
            <AccordionItem value="broker-overview">
              <AccordionTrigger>Broker Overview</AccordionTrigger>
              <AccordionContent>
                <BrokerOverview />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="hidden md:block">
            <BrokerOverview />
          </div>
        </div>
      </div>
    </div>
  );
}
