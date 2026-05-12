/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { CustomCommandDefinition } from "../../registry";
import type { CommandTemplateId } from "./types";

export interface TemplateConfig {
    id: CommandTemplateId;
    label: string;
    description: string;
    apply(command: CustomCommandDefinition): CustomCommandDefinition;
}

export const TEMPLATE_CONFIGS: TemplateConfig[] = [
    {
        id: "command",
        label: "Alias",
        description: "تشغيل أمر آخر من لوحة الأوامر.",
        apply: command => ({
            ...command,
            action: { type: "command", commandId: "" }
        })
    },
    {
        id: "settings",
        label: "Open Settings Page",
        description: "الانتقال مباشرةً إلى صفحة إعدادات ديسكورد.",
        apply: command => ({
            ...command,
            action: { type: "settings", route: "My Account" }
        })
    },
    {
        id: "url",
        label: "Quicklink",
        description: "فتح رابط في ديسكورد أو خارجياً.",
        apply: command => ({
            ...command,
            action: { type: "url", url: "https://", openExternal: true }
        })
    },
    {
        id: "macro",
        label: "Sequence",
        description: "تشغيل أوامر متعددة بالترتيب.",
        apply: command => ({
            ...command,
            action: { type: "macro", steps: [] }
        })
    }
];

export function getTemplateByActionType(actionType: CommandTemplateId): TemplateConfig {
    return TEMPLATE_CONFIGS.find(template => template.id === actionType) ?? TEMPLATE_CONFIGS[0];
}
