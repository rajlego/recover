import { decisionWafflingProtocol } from "./decisionWaffling";
import { overwhelmProtocol } from "./overwhelm";
import { focusingProtocol } from "./focusing";
import { timeHorizonProtocol } from "./timeHorizon";
import { artOfAccomplishmentProtocols } from "./artOfAccomplishment";
import { journalSpeakProtocol } from "./journalSpeak";
import { locallyOptimalProtocol } from "./locallyOptimal";
import type { Protocol, ProtocolCategory } from "../models/types";

export const protocols: Protocol[] = [
  decisionWafflingProtocol,
  overwhelmProtocol,
  focusingProtocol,
  timeHorizonProtocol,
  ...artOfAccomplishmentProtocols,
  journalSpeakProtocol,
  locallyOptimalProtocol,
];

export function getProtocolById(id: string): Protocol | undefined {
  return protocols.find((p) => p.id === id);
}

export function getProtocolsByCategory(category: ProtocolCategory): Protocol[] {
  return protocols.filter((p) => p.category === category);
}
