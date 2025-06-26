"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { PeopleTable } from "@/app/(dashboard)/mailboxes/[mailbox_slug]/dashboard/peopleTable";
import { ReactionsChart } from "@/app/(dashboard)/mailboxes/[mailbox_slug]/dashboard/reactionsChart";
import { useIsMobile } from "@/components/hooks/use-mobile";
import { PageHeader } from "@/components/pageHeader";
import { Panel } from "@/components/panel";
import { DashboardAlerts } from "./dashboardAlerts";
import { StatusByTypeChart } from "./statusByTypeChart";
import { TimeRangeSelector } from "./timeRangeSelector";

export type TimeRange = "24h" | "custom" | "7d" | "30d" | "1y";

type Props = {
  mailboxSlug: string;
  currentMailbox: { name: string; slug: string };
};

const RealtimeEvents = dynamic(() => import("./realtimeEvents"), { ssr: false });

export function DashboardContent({ mailboxSlug, currentMailbox }: Props) {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [customDate, setCustomDate] = useState<DateRange>();
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto min-h-0">
        {isMobile && <PageHeader title="Dashboard" variant="mahogany" />}
        <DashboardAlerts mailboxSlug={mailboxSlug} />

        <div className="p-4 flex flex-col gap-4 bg-sidebar">
          <div className="flex justify-between items-center">
            <h3 className="scroll-m-20 text-3xl text-white tracking-tight">At a glance</h3>
            <TimeRangeSelector
              value={timeRange}
              onValueChange={(value) => {
                setTimeRange(value);
                if (value !== "custom") {
                  setCustomDate(undefined);
                }
              }}
              customDate={customDate}
              onCustomDateChange={(date) => setCustomDate(date)}
              mailboxSlug={mailboxSlug}
            />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Panel className="h-[800px] md:h-[400px] md:col-span-2">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <h4 className="scroll-m-20 mb-2 text-sm font-semibold tracking-tight uppercase">Ticket Status</h4>
                  <StatusByTypeChart mailboxSlug={mailboxSlug} timeRange={timeRange} customDate={customDate} />
                </div>
                <div className="flex flex-col">
                  <h4 className="scroll-m-20 mb-2 text-sm font-semibold tracking-tight uppercase">Replies by Agent</h4>
                  <PeopleTable mailboxSlug={mailboxSlug} timeRange={timeRange} customDate={customDate} />
                </div>
              </div>
            </Panel>
            <Panel title="Reactions" className="h-[400px] md:-order-1">
              <ReactionsChart mailboxSlug={mailboxSlug} timeRange={timeRange} customDate={customDate} />
            </Panel>
          </div>

          <h3 className="mt-6 scroll-m-20 text-3xl text-white tracking-tight">What's happening?</h3>
          <RealtimeEvents mailboxSlug={mailboxSlug} />
        </div>
      </div>
    </div>
  );
}
