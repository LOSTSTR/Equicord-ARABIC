/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import * as DataStore from "@api/DataStore";
import { proxyLazy } from "@utils/lazy";
import { Logger } from "@utils/Logger";
import { openModal } from "@utils/modal";
import { OAuth2AuthorizeModal, showToast, Toasts, UserStore, zustandCreate, zustandPersist } from "@webpack/common";

import { AUTHORIZE_URL, CLIENT_ID } from "../constants";
import { useStreaksStore } from "./StreaksStore";

interface AuthorizationState {
    token: string | null;
    tokens: Record<string, string>;
    init: () => void;
    authorize: () => Promise<void>;
    setToken: (token: string) => void;
    remove: (id: string) => void;
    isAuthorized: () => boolean;
}

const indexedDBStorage = {
    async getItem(name: string): Promise<string | null> {
        return DataStore.get(name).then(v => v ?? null);
    },
    async setItem(name: string, value: string): Promise<void> {
        await DataStore.set(name, value);
    },
    async removeItem(name: string): Promise<void> {
        await DataStore.del(name);
    },
};

export const useAuthorizationStore = proxyLazy(() => zustandCreate(
    zustandPersist(
        (set: any, get: any) => ({
            token: null,
            tokens: {},
            init: () => { set({ token: get().tokens[UserStore.getCurrentUser()?.id] ?? null }); },
            setToken: (token: string) => {
                const id = UserStore.getCurrentUser()?.id;
                if (!id) return;
                set({ token, tokens: { ...get().tokens, [id]: token } });
            },
            remove: (id: string) => {
                const { tokens, init } = get();
                const newTokens = { ...tokens };
                delete newTokens[id];
                set({ tokens: newTokens });
                init();
                useStreaksStore.getState().clear();
            },
            authorize: async () => {
                const { setToken } = get();
                return new Promise<void>((resolve, reject) => {
                    openModal((props: any) => (
                        <OAuth2AuthorizeModal
                            {...props}
                            scopes={["identify"]}
                            responseType="code"
                            redirectUri={AUTHORIZE_URL}
                            permissions={0n}
                            clientId={CLIENT_ID}
                            cancelCompletesFlow={false}
                            callback={async ({ location }: { location: string; }) => {
                                try {
                                    const url = new URL(location);
                                    const res = await fetch(url, { headers: { Accept: "application/json" } });
                                    const { token } = await res.json();
                                    setToken(token);
                                    showToast("Logged in to Streaks API!", Toasts.Type.SUCCESS);
                                    resolve();
                                } catch (e) {
                                    new Logger("Streaks").error(e);
                                    showToast("Failed to log in to Streaks API!", Toasts.Type.FAILURE);
                                    reject(e);
                                }
                            }}
                        />
                    ));
                });
            },
            isAuthorized: () => get().token !== null,
        }) as AuthorizationState,
        {
            name: "equicord-streaks-auth",
            storage: indexedDBStorage,
        }
    )
));
