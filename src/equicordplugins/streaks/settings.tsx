/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { Button } from "@components/Button";
import { Flex } from "@components/Flex";
import { OptionType } from "@utils/types";
import { UserStore } from "@webpack/common";

import { useAuthorizationStore } from "./stores/AuthorizationStore";
import { useStreaksStore } from "./stores/StreaksStore";

export const settings = definePluginSettings({
    account: {
        type: OptionType.COMPONENT,
        description: "تسجيل الدخول أو الخروج من واجهة برمجة تطبيقات Streaks",
        component() {
            const { isAuthorized, authorize, remove } = useAuthorizationStore();

            if (isAuthorized()) {
                return (
                    <Flex>
                        <Button
                            onClick={() => remove(UserStore.getCurrentUser()?.id)}
                            variant="dangerPrimary"
                        >
                            Log Out of Streaks API
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
                            Log In to Streaks API
                        </Button>
                    </Flex>
                );
            }
        }
    },
    eliteColor: {
        type: OptionType.STRING,
        description: "لون سلسلة النخبة (100+ يوم)",
        default: "#9b39fe"
    },
    diamondColor: {
        type: OptionType.STRING,
        description: "لون سلسلة الماس (60+ يوم)",
        default: "#f7409c"
    },
    platinumColor: {
        type: OptionType.STRING,
        description: "لون سلسلة البلاتين (45+ يوم)",
        default: "#856bfe"
    },
    goldColor: {
        type: OptionType.STRING,
        description: "لون سلسلة الذهب (30+ يوم)",
        default: "#f75340"
    },
    silverColor: {
        type: OptionType.STRING,
        description: "لون سلسلة الفضة (14+ يوم)",
        default: "#f57b0b"
    },
    bronzeColor: {
        type: OptionType.STRING,
        description: "لون سلسلة البرونز (7+ يوم)",
        default: "#b08d57"
    },
    defaultColor: {
        type: OptionType.STRING,
        description: "لون سلسلة افتراضي (1+ يوم)",
        default: "#f59e0b"
    }
});
