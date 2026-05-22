/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { Button } from "@components/Button";
import { Flex } from "@components/Flex";
import { t } from "@utils/esharqI18n";
import { OptionType } from "@utils/types";
import { UserStore } from "@webpack/common";

import { useAuthorizationStore } from "./stores/AuthorizationStore";
import { useStreaksStore } from "./stores/StreaksStore";

export const settings = definePluginSettings({
    account: {
        type: OptionType.COMPONENT,
        description: t("تسجيل الدخول أو الخروج من واجهة برمجة التطبيقات Streaks.", "Log in or out of the Streaks API."),
        component() {
            const { isAuthorized, authorize, remove } = useAuthorizationStore();

            if (isAuthorized()) {
                return (
                    <Flex>
                        <Button
                            onClick={() => remove(UserStore.getCurrentUser()?.id)}
                            variant="dangerPrimary"
                        >
                            {t("تسجيل الخروج من Streaks API", "Log Out of Streaks API")}
                        </Button>
                    </Flex>
                );
            } else {
                return (
                    <Flex>
                        <Button onClick={async () => {
                            await authorize();
                            await useStreaksStore.getState().migrate();
                            await useStreaksStore.getState().fetch();
                        }}>
                            {t("تسجيل الدخول إلى Streaks API", "Log In to Streaks API")}
                        </Button>
                    </Flex>
                );
            }
        }
    },
    eliteColor: {
        type: OptionType.STRING,
        description: t("لون النيزك Elite (100+ يوم)", "Elite streak color (100+ days)"),
        default: "#9b39fe"
    },
    diamondColor: {
        type: OptionType.STRING,
        description: t("لون النيزك Diamond (60+ يوم)", "Diamond streak color (60+ days)"),
        default: "#f7409c"
    },
    platinumColor: {
        type: OptionType.STRING,
        description: t("لون النيزك Platinum (45+ يوم)", "Platinum streak color (45+ days)"),
        default: "#856bfe"
    },
    goldColor: {
        type: OptionType.STRING,
        description: t("لون النيزك Gold (30+ يوم)", "Gold streak color (30+ days)"),
        default: "#f75340"
    },
    silverColor: {
        type: OptionType.STRING,
        description: t("لون النيزك Silver (14+ يوم)", "Silver streak color (14+ days)"),
        default: "#f57b0b"
    },
    bronzeColor: {
        type: OptionType.STRING,
        description: t("لون النيزك Bronze (7+ أيام)", "Bronze streak color (7+ days)"),
        default: "#b08d57"
    },
    defaultColor: {
        type: OptionType.STRING,
        description: t("لون النيزك الافتراضي (1+ يوم)", "Default streak color (1+ day)"),
        default: "#f59e0b"
    }
});
