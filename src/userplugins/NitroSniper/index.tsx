/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { showNotification } from "@api/Notifications";
import { definePluginSettings } from "@api/Settings";
import { t } from "@utils/esharqI18n";
import { Logger } from "@utils/Logger";
import definePlugin, { OptionType } from "@utils/types";
import { findByPropsLazy } from "@webpack";
import { NavigationRouter, UserStore } from "@webpack/common";

const logger = new Logger("NitroSniper");
const GiftActions = findByPropsLazy("redeemGiftCode");

let startTime = 0;
let claiming = false;
const codeQueue: Array<{ code: string; channelId: string; guildId?: string; messageId: string; }> = [];

const settings = definePluginSettings({
    notifyOnRedeem: {
        type: OptionType.BOOLEAN,
        default: true,
        description: t("عرض إشعار عند استبدال كود نيترو بنجاح.", "Show a notification when a Nitro code is successfully redeemed.")
    },
    notifyOnFail: {
        type: OptionType.BOOLEAN,
        default: true,
        description: t("عرض إشعار عند فشل استبدال كود نيترو.", "Show a notification when a Nitro code fails to redeem.")
    }
});

function processQueue() {
    if (claiming || !codeQueue.length) return;

    claiming = true;
    const { code, channelId, guildId, messageId } = codeQueue.shift()!;

    logger.log(`Attempting to redeem code: ${code} (channel: ${channelId}, guild: ${guildId ?? "dm"})`);

    GiftActions.redeemGiftCode({
        code,
        onRedeemed: (gift: any) => {
            logger.log(`Successfully redeemed code: ${code} (channel: ${channelId}, guild: ${guildId ?? "dm"})`);

            if (settings.store.notifyOnRedeem) {
                const user = UserStore.getCurrentUser();
                const giftType = gift?.subscription_plan?.name || "Nitro";

                showNotification({
                    title: "Nitro Sniped! 🎉",
                    body: `Successfully redeemed ${giftType} code`,
                    color: "#5865F2",
                    icon: user.getAvatarURL(),
                    onClick: () => {
                        NavigationRouter.transitionTo(`/channels/${guildId ?? "@me"}/${channelId}/${messageId}`);
                    }
                });
            }

            claiming = false;
            processQueue();
        },

        onError: (err: Error) => {
            logger.error(`Failed to redeem code: ${code} (channel: ${channelId}, guild: ${guildId ?? "dm"})`, err);

            if (settings.store.notifyOnFail) {
                const user = UserStore.getCurrentUser();

                showNotification({
                    title: "Nitro Redeem Failed ❌",
                    body: `Failed to redeem code: ${code}`,
                    color: "#ED4245",
                    icon: user.getAvatarURL(),
                    onClick: () => {
                        NavigationRouter.transitionTo(`/channels/${guildId ?? "@me"}/${channelId}/${messageId}`);
                    }
                });
            }

            claiming = false;
            processQueue();
        }
    });
}

export default definePlugin({
    name: "NitroSniper",
    get description() { return t("يستبدل تلقائياً روابط هدايا نيترو المُرسلة في الدردشة\n\n⚠️ WARNING: This plugin automatically redeems Nitro gift codes found in chat. This may violate Discord's Terms of Service and could result in account suspension. Use at your own risk.\n\n⚠️ تحذير: تقوم هذه الإضافة تلقائياً باسترداد أكواد هدايا نيترو من الدردشة، مما قد ينتهك شروط خدمة Discord ويُعرّض حسابك للتعليق. استخدمها على مسؤوليتك الخاصة.", "Automatically redeems Nitro gift links sent in chat.\n\n⚠️ WARNING: This plugin automatically redeems Nitro gift codes found in chat. This may violate Discord's Terms of Service and could result in account suspension. Use at your own risk."); },
    tags: ["Utility", "Fun"],
    authors: [
        { name: "neoarz", id: 1015372540937502851n },
        { name: "irritably", id: 928787166916640838n }
    ],

    settings,

    start() {
        startTime = Date.now();
        codeQueue.length = 0;
        claiming = false;
    },

    flux: {
        MESSAGE_CREATE({ message }) {
            if (!message.content) return;

            const match = message.content.match(/(?:discord\.gift\/|discord\.com\/gifts?\/)([a-zA-Z0-9]{16,24})/);
            if (!match) return;

            if (new Date(message.timestamp).getTime() < startTime) return;

            codeQueue.push({
                code: match[1],
                channelId: message.channel_id,
                guildId: message.guild_id,
                messageId: message.id
            });
            processQueue();
        }
    }
});
