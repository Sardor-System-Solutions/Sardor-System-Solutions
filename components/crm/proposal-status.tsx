"use client";

import { PROPOSAL_STATUSES, type ProposalStatus } from "@/types/crm";
import { setProposalStatusAction } from "@/app/admin/crm/actions";
import { StatusPicker } from "./status-picker";

const LABEL: Record<string, string> = {
    DRAFT: "Черновик", SENT: "Отправлено", VIEWED: "Просмотрено",
    NEGOTIATION: "Переговоры", ACCEPTED: "Принято", REJECTED: "Отказ",
};

export function ProposalStatusPicker({
    proposalId,
    status,
}: {
    proposalId: string;
    status: ProposalStatus;
}) {
    return (
        <StatusPicker
            value={status}
            options={PROPOSAL_STATUSES}
            labels={LABEL}
            onPick={(next) => setProposalStatusAction(proposalId, next)}
        />
    );
}

export const PROPOSAL_STATUS_LABEL = LABEL;
