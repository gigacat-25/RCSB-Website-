import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { allEventsQuery } from "@/sanity/lib/queries";
import EventsClient from "./EventsClient";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming and past events by the Rotaract Club of Swarna Bengaluru.",
};

export const revalidate = 1800;

export default async function EventsPage() {
  const events = await client.fetch(allEventsQuery).catch(() => []);
  return <EventsClient events={events} />;
}
