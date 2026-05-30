/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "تثبيت الإضافات المستخدم بنقرة زر بسيطة",
        "en": "Install user plugins with a single button click."
    },
    "options": {
        "allowlistedChannels": {
            "ar": "قائمة معرّفات القنوات مفصولة بفواصل لعرض زر تثبيت الإضافة فيها",
            "en": "Comma-separated list of channel IDs where the install plugin button is shown."
        },
        "notifyIfUpdate": {
            "ar": "إظهار إشعار Vencord إذا احتاجت الإضافات المستخدم إلى تحديث",
            "en": "Show a Vencord notification if installed user plugins need updating."
        },
        "neverNotifyForPlugins": {
            "ar": "لا تعرض إشعارات التحديث لهذه الإضافات (لا يزال بإمكانك تحديثها من تبويب UserPlugins)",
            "en": "Do not show update notifications for these plugins (you can still update them from the UserPlugins tab)."
        }
    }
});
