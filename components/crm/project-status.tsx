"use client";

import { CLIENT_PROJECT_STATUSES, type ClientProjectStatus } from "@/types/crm";
import { setProjectStatusAction } from "@/app/admin/crm/actions";
import { StatusPicker } from "./status-picker";

const LABEL: Record<string, string> = {
    PLANNING: "Планирование", DESIGN: "Дизайн", DEVELOPMENT: "Разработка",
    TESTING: "Тестирование", LAUNCH: "Запуск", COMPLETED: "Завершён",
    PAUSED: "Пауза", CANCELLED: "Отменён",
};

export function ProjectStatusPicker({
    projectId,
    status,
}: {
    projectId: string;
    status: ClientProjectStatus;
}) {
    return (
        <StatusPicker
            value={status}
            options={CLIENT_PROJECT_STATUSES}
            labels={LABEL}
            onPick={(next) => setProjectStatusAction(projectId, next)}
        />
    );
}

export const PROJECT_STATUS_LABEL = LABEL;
