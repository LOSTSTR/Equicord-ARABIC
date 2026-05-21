/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./styles.css";

import { addProfileBadge, BadgePosition, BadgeUserArgs, ProfileBadge, removeProfileBadge } from "@api/Badges";
import { addMessageDecoration, removeMessageDecoration } from "@api/MessageDecorations";
import ErrorBoundary from "@components/ErrorBoundary";
import definePlugin from "@utils/types";
import { Tooltip, useRef } from "@webpack/common";
import type { JSX } from "react";

const BADGE_ID = "eq-arabic-brand";

// ─── Authorized user list ──────────────────────────────────────────────────────
// Stored as base64(discordSnowflakeId) — light obfuscation only.
// To add a user:  btoa("their-discord-id")  → paste result below.
// To remove:      delete the entry.
const _ENCODED = [
    "NjgxNDY1NzU4MTI3MjI2OTAw",
    "MTA3Mjk2MTQ3NTEyNTE4MjU2NA==",
    "NjgzMDMxNTQ4NjcyNjA2MjY0",
    "MTA0NjU0NTI5MjEwMDY1MzE3Nw==",
    "NTM4Njk5MzE2MjMyMDYwOTM4",
];

const BADGE_USERS: ReadonlySet<string> = new Set(_ENCODED.map(atob));

function hasBadge(userId: string): boolean {
    return BADGE_USERS.has(userId);
}

// ─── Badge visual — circular project icon with gold ring ─────────────────────

const PROJECT_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAABjiSURBVHhe7Z09ry1HVobnH1iIkcUw8hiNLTACj6yB0UiIABITQGDJIoDkJiZASEgjEicQIKQJIIDEE0CANCKAZCJnJGQkZPyfg55z6bn71j67e62qVV2rqt/gSXzde+/TXfXW+nir+hvvvPPOkxDimnyj/A9CiOsgARDiwkgAhLgwEgAhLowEQIgLIwEQ4sJIAC7G7/3wW4e8+81fuLtOrIkEYHI++uCbz5P2L/70u09/8+e/+vTTH3/8c/7zn7//9L8/+2Ez//Wvv/XW5/7dX/7a049effD8vb/98bt3v0nMgwRgAliRmWx/8offeZ54P/nr33j693/43t1EHcnXX33yLA78vlefvf/8e7/9LUUS2ZEAJIRV9c/++FeeJ/p//9sP7ibbTPzPf/zg6V/+9jefI5Tf+f4v3f2tYiwSgAR876N3n1fNFSb8ERKEXEgABrBN+H/88tef8+tyklwJCcJYJAAnwaT/8osPwwpzq0IERJFRYnAOEoCOUARjpc9WsJsFxJLIgE5HeW9FDBKADvzR73/7ObwvB7Sohw4DXRB1FmKRAARBiE8f/uo5fW+oGfz9X3309Ae/+8t3z0D4kQA08vmn7z397J8+uRuoWSEduTX1vER5TVYQW9qlci7WIwGohHA0S0HvJRMOfPc7v3j3u2sg7N4+czMjUbnPInwUDvlNSg/8SAAcsNKw4owI8wl9meSEvwx2QuAsNlzSn9KOPOIeIQR8f5TwXQEJgAFWFibdmYOa6ILJzoo7axWc+0ZBlEl5ZrSAWPKds963M5EA7MBKQu/+DHfeChP+CASBmgl9ftKW8h70gHu66v2MQALwAoT6THxWknJARYGorD7hj0BgEQTuQ2+RRXSUGtwjASggt+5Z3KN4xqRX5fptuB+IAfenvGdRIDLUcMrvvjISgP+H1aHX4CPcpUCmFcgG94mJ2itNoBUqq/FrLi8ArDxMzuhwf/O0Z6nUzwodBu5jjwIshcKrtw4vLQC0rqJXGdIHQvzyu0Q7dBSijUoIy5Wf1yUFgBCTwlM5GFqgzcUALb9LxEP4ztkJ5TNoAWEh2ii/a3UuJwCofWTFmYGjiT8G0qvoTVf4PcrvWZnLCAC5fuSqT8GQFKL8HnE+tFEjny2ifpWC7SUEgNAuKtcn9FRhLycIAQXDiIIutYErCPzyAkDIHzEgaB1p4s8Bq3dUarB6SrCsAESF/FevEs8Mpq6IyG/llGBJAYgK+Qknr94nnp0on8eqKcFyAhAR8sspth7UByKcnqulBEsJACt2+cA8yCu+PqQFra5ChGSVvRxLCAAPo1XdqResmueJt9l2e5ZjwAPGrxXSw+kFgIfQYg8lXVCR75qQ07dEA9i+Z9/KPbUAsGK3nDRDofCK9k/xBsZQywKCgMzcHp5WAFDeln37hPyr5HGiHYp75RixQu1o1g7BlAKA4taGbgr5xSNaUgLG1Yx7QqYTANpztZt5FPKLI1pTgtkWl6kEgBZObY9fIb/w0JISzOQVmEYAmPzljbai3r6ooWXBmUUEphAAcrOaB6F8X7TSknLOsPCkFwAKfjUPgMmvF0iKCBiDtR2n7AtQagGg1VdTlUUw5OUXkTAWazaYZV+I0goA1dga1eWamY0ZIi+4TmuMZ4hA1jGZUgBqb/QK1kyRm9p9J0SlGVvQ6QSAG1zTh11lc4bIT+1hMxkXqHQCUKOumvxiBDUiQB0h01hNJQA1+/lR1Uw3VFyLmgWLA2eymNLSCADtkvJGHZExpBLXojZl5bVk5WeNIIUAUBzxGn0oqmStrIprUVu0zrB5aLgAoKDe/ipioT6/yETN9nQWsdER7HAB8BZSshsrxHVhMntdq6PrAUMFoCbvz26tFNeGtNSbzo6sBwwTgJq8f4bNFULU7CIcVQ8YIgA1eT+pQvk5QmSFxaocw3uMqgcMEQBv3o9YjMyThKiBF8mWY3mPEfWA0wXAm/cTSmX0UAtxBO1Bb2fg7HrAqQLADj9vbqSin5gZ2tXeMX/mCcOnCoD3lc3K+8UKeOsBmIrOSgVOEwDvmX7K+8VKeOsBvNG4/IwenCIA3qq/8n6xGt56AHPgjHdVniIA3iOWlfeLFfHWA4gays+IprsA0Nv0/NHK+8XKENqXY36P3gah7gLg2S/NAaBnhD1CjMSzc5C0oWctrKsAoF7lH7THq8/ev/sMIVaD/QLl2N+j50tGugkAquU50hsXVPkZQqyK5/SrnkXxbgKAo6n8Q/bQ4R7iSpDqehZIUunyMyLoIgBex9/Z9kchMuC1xfcoCHYRAM/qjwrqUE9xVUh9yznxiB5RQLgAeFf/zz997+4zhLgK3oJgdKocLgCe1Z/TVMvrhbganjkTbQ4KFQBv5T9azYSYkZHzJlQAPLueopVMiJkZNXfCBGCkigkxO975E3V8WJgAjFIwIVbBs2kuqnUeIgBe9dLqL8Q9ng5a1HbhEAGglVf+wEdo9RfiMZ6OQEQUECIAnt1NequPEI/xRgGtJrpmAeCQg/KHPQKhKK8XQryNJwpo3UHbLACeXU09vMxCrIYnCmjdRdskABT/rC9D1OovhB3PCdotW4WbBMBT/NPqL4Qdzx6BL7/48O56K00CYD3uixZhee0oiFp48cLMRLR/elP+5iiiDDAzYN0p2DK/qgWAQVj+kEe0KFQ0DKDy981G9lOTPauXlyttIKPAV/79j0Acy+stVAuAx/nXkqNEIwHoj6eKXcMMEVAEtPisxcDa07SrBcDa+89W/JMA9MfjCq3hrLfmZMD6RiGEoub04CoB8IR4RArl9SORAPTF+wq4GrItKj3xnKxdMy6qBMAa4kX5lSORAPTF075qIVNa2RPPPpua+kiVAFh/UEbfvwSgHwxWa87aSqbCcm+sCy54uyRuAfCE/xl7/xKAfnhPuW2BN+aU378qnjnnHRtuAbBW/4kSaooSvZEA9IMQtPytPaltfc2Iteju7Qa4BcBalWSPQHltBiQAffD4QqLIOsZ6YF14vZGRWwCs3v+M4T9IAPrgfettBFmjzB54xq2nDuASAE8u0rpPuReeG5mVjALw9Ve2EDWaK50vwepe/v0v4RkfLgGwqnzmPq0EIB7PwhANbcfy96wK+X3597+E5564BMBa5Ik4qqgXEoB4PG2qaGodcDNi7bKQppfXPsIsAJ4eb9b8HyQA8Vh9Ib3Idj964Rm71oN3zQJAy6X8kkdkzf/BcxOzkmnAt1p/rXntHj1empkV6/2yWvDNAmA9szxz/g+RAsDKV+5XP4NM9upW6y91pYgIItM96Ym1DmB14ZoFYIX8HyIFwNtzXQ1PWvgITpWyHnyxh3XFm53oOoBZAKwPOnP+DxKAOKyDcQ9yVeuqtkfr4Ziz4Bm/lg1TJgHwuLwy5//guYFHXF0ArFHhHowXa3p5hGXAr4C1DmBZjE0CYC30zDAhJAAxeBaFR2yrtmfP+x4ISfk7V8Rqx7ccnGISAKsPeYZqrAQgBqspbI9twhIFlP9Ww1WeB1uhy7/9JSx7JUwCYDV6ZC8AggQghgjrLx2N7fOsu92O4E1V5W9dDWvtxVIXMQmA9fjv1tcUnYEEoJ0I629ZpbauakfMsAi1Yn0dn+W4cJMAWIsOM2zMkAC0Y40I9yj3rVsH9RGWQT87npTpqCh/KAD0essPfcQMZgwJQDsRxp2XFgvrQnPES5+9GtZt+Ucp0aEAWMM9fALltRmRALRh7Qjt8WgDT0RkAWV0sSJW8xRGq/LaWw4FwPr+v+wW4A0JQBut1l94tF2VomD5/9bwSGBWwvpW7qPDUw8FwNruefRQsyEBqCfC+gt7q1JEegF737EC1nl5tCfgUACsij+LCUMCUI+1/bTH0eocYQuGGTwpLVjNU0eR+aEAWO2esyiuBKAe61jY42hiRtQYIONLaSLB9lz+zS9xVJs7FACr4cN6AMFoJAB1RFh/4egsA6IDa4X7iBl8KbV4unPltbccCoC1NcPEKq/NiASgDmvOuQer0VFfGqxp5xEWJ9zMWOsle/f8UACsarz3JZmQANRhjQT3sL67ztp5sjDLwlRDxOJ8KADlhz2ivC4rkQJw9olAo3JaqxfkCGtIHtVtAMuOuFmxivLeNuldAbDmGUeFhkxECsDZHOXPvYgy6HgEzLrl9QgmSfnZq2AtyrJ4lNdu7AqAdbLMFApb/6aMjBIAa665hzX834hoOW7MUqD2IgGowPo3ZWSEAES15byhODWlqDTgyA03K1bPxN642RUAlKP8sJeYqdoqAfARVZHfK0Q9wrrCHbHqDsE0AuAN70YiAbATVYw7cqM9gqJh+Vm17IXBs2KtzexFX7sCYG3HHPmNMyEBsBOVh9faxKPMR7DiDkHrYap7939XAKwDYKabKwGwExWC77WhjrBuez0CP8veHoQZsZqz9k5J2hUAawgmATiHMwUgavVtbcNZB7mFWfarWIlYoHcFIOILsiEBsBE18Vor8JHPa6ZU1YL1tO6904FDBGCWswAgckCdzZkCYHWZHXF0JJWFqBODrXsRZqF7DUBdgFycJQBR1t8of4h1oFuw2pFnwHpfJAA3SACOsbaXjtgrPnmw7n23MNNYPaK7D8B641sLPWciATgmwvoLkb136843C549CZnpLgDWyRIV6p2B9W/KyN6DjCLK+hvtvot6cQjsGWNmwvrCnr1j0ncFwPoCgvItL5mRAOwTZf3dqzzXEPXiEKh1JmbD6tPYi8R2BQDKD3tEeV1WIgVgtfMAoqy/sLfq1BKVmkCLOSkLVpPU3m7IQwGwDojyuqxECsBMqY8Fa9vXAiE71edIolqT0OpPyIC1LrK3EetQACK+JBMSgMdYQ8oVWOHZWefmXuQYJgCzhFQSgJeJsv7OBGlVeR9movx7HlFed8uhAFhXBV5UUF6bEQnAy0RZf2ciulB5Jh7BLq+95VAArGez4Usur82IBOBlIvPrWZh5h6C1XXs0Rg8FwNp/nUVNJQD3RFl/Z2SWyLXEuhHo6E1MhwJgrQzPciyYBOCeKOvvjMy0ke0W6zM7smMfCoDVgBHt/OqFBOBtCIEj++uzcfSy0qxYXYBHm58OBcDqBoQZtlpKAN7GmkuuzBkOy2is3bkjQ9ahAID19WARe797IwF4myjr78wc5cnZsL6wB/Y8AGASAKvlcIYjlyQAb4g8e392jiZKJqxFW8sbu0wCYN12OIO9UgLwBmuB9wrM0sYG62ndlk1PJgGwmkRmOHNNAvAGq8nrCszSxQLrfLR0OEwCQK+0/PCXsCjOaCQAr4m8D6swi53dWrdhA1V5bYlJAKwnA83QUokc+DMLgHUVuRKWCZMB6yGplpqcSQA8VcfsGywkAK+JtP6OOmfP44e3MMPz9LTl984B2DAJAFhVJ7uKSgDs5i4rIwto0XWM7K1sazpujcbNAmC1Ho5aDaxIAOzP0gr3tPyOs7B64q1k39NifXbWeWgWgGjlGUWkAGCQKk+tOZOaiRdt/R1d+I18npDd0h4diZsFwJN7ZK4DRA+YkdTc52jrr3Wg9cRqVLNyZJ8dRY85aBYAiFafEVxdAKwtJCuWQlNvGG/l72oh67sue0ThLgGIzj9GcGUBiLb+ZqmBWNvUVjwT6Ex6zD+XAPRQoLO5sgBEW3+P9pqfSWRbEyw99LPpEYG7BKBHDnI2VxaA6JaZ9/t7Yj25ykq2HYK95p5LAMCqQlk3Bl1VAKL/7mzV8mhvA1Fsph2C1g1A3ujbLQDWPCRLflgSPRFG4hGAaOtvxkKZ9ZAMK0en6ZyJ9QQgT/4PbgGw1gHAM0DP4qoCEJ0jZ2yVYeIpf2cLWXYIEolYi7ee/B/cAuCpJGdcJa4oAD3CY0+YeRbcj/K3tlJjtorG43b0WpndAgDWdwVkHChXFABr2mbFss98FNbj66x4V9QeWOtuNWl3lQB40oBsBy5eTQCirb+Q7ZneYj29ygqpU/kdZ2I9/gtqxKpKADyDKls75WoCEG39JarLfPpz9N8L3rA6Ek97syZdqRIA8ISVmdopVxOAaOuvt8p8NixO1hqVlZEtbetCW/tcqgXAU1iiBVVeP4orCYCnYGslU2vsEdGiN8rz4IlmatOyagEAa2tpdB51C9EIarkCRxtxEIjymlYyRXOPYOKUv7uVEecFWoWsJS1rEgCPuWRkHiXEbHiit5auTJMAeM5km+HIcCGy4On9t5iymgQArBZFmCF8FGI0ni5ba32iWQA8W0wzbR8VIiue1b+1Q9EsAJ62S7YdVkJkw7P6w1Eh+IhmAQCPJ0BRgBCPoc1azplHRNTVQgTAs1tJUYAQj7H6/qGl+LcRIgCgKECINjx7bKKOYw8TAEUBQrThWf0Ri/L6GsIEAKzOJRj5OikhsjFi9YdQAfBsXaTSme2sACFGMWL1h1ABAOthIaBagBA+L03k6g/hAuCJAqC1jynEzOD59/T9o3djhgsAeKKALAcvCjECz0GmPdLmLgLgjQJq9zILMTPeedKjcN5FAMCzSQhlU1tQXA1P4a/H6g/dBIADFKy+ACAUKj9DiFXxWH4hsvJ/SzcBAM+BhqCCoLgCRLue48sjPP+P6CoAhCye1zVFtziEyIjn6HKi6JrTfq10FQDwOJygR6FDiCx4DtOF3gfqdhcA8LQFUbwRBzAK0Rt6/p6ImMN0exT+bjlFADwbhc76w4U4G89CCEfHvkdwigCA5wRhyPhiUSFq8RzzBS0n/Xo4TQBY0T19T5BBSKwAeb8nAj5zu/xpAgDe1zerHiBmx5v3w5mF8FMFADwtEFA9QMyMN+8/e2/M6QLAZLa+UmxD9QAxI968H3NQz57/S5wuAOC1CYPqAWImvHk/9LL77jFEAMBzCAJwM2UVFjNAAc+b9486HGeYAIC3HjAiRBLCA0U/b7eLvH9UnWuoANTUA1DWs1okQnhgPHu2wcPoRW2oAEBNPQCFrX0fuhC98JyKvTEi779luACAtx4AP/3xx8PCJiFKPC/G2RiV99+SQgDAWw+AnvukhbDitbnDyLz/ljQCUGMVBnkExEhqoleO9xqZ99+SRgCgpn0CP3r1wd1nCdEbXs7prV9la2enEgBAGT3HJW1IBMSZ1E7+iDf6RpJOAACFrBEBHSwqzoCw3zv5IaObNaUAQI3CAq2YDMUVsSY1BT/ofbRXLWkFAD7/9L27G2kBM4Z8AiKamlYfZGj3PSK1AIB3R9WGzEIiCiLKGpMPnHWyTy3pBQAo8JU31gIdhSztFjEnLCJee+8G12VPR6cQAKgxCgE910xtFzEPtKVrvCkwSwQ6jQBArQjQURjtuRZzwX7+Gk8KzDL5YSoBgNpCDHBt9pBMjIe6U00HCmYrQE8nAFDbigE82KoLiJdg4nrP8Ltlxhb0lAIANR7sDaUEoqQl5IfMrb49phUAYBLXhmrbQ5tNsUU8LSE/ZDX5WJhaAIB3DdTYhjeUElyX1pAf0cho7/UwvQAAbT7afeUDsoKA4DosP1esS2vIn3FjTw1LCACwirc8UKCCq2hgbVj12TRWPnsPLBireEuWEQBoDekAZcd5qNrAehCut6SLsFrKuJQAbLQWdYBoYoUQT7xOEZm45TP2smLReEkBgNYcb4OIQseQzwkR4ZdffHj3TL2s3DZeVgAgIiUAoomZWz1XhKJuS2F4Y7WQv2RpAdiISAmAiGL2ts/q0BbmyPjy2dWwYshfcgkBgKiUAPicV5+9v/zgmAlC9NqdeyUrh/wllxEAiEoJNggxiS4kBOMgIoua+LB6yF9yKQHYiMoPN1gxaB3OtAtsdpj4UREdXLXOc0kBgKgK8S0IAXmjugZ9INIi4oqc+HDlTs9lBWAjqkdcwqCSvTgGCnscBtNq4imR10MC8HMo6kUPMOAzsZ5ShCy/UzyGPJy0Knq1B7k93yABuIG0oPbYMQtff/XJc555pSKTB+4/QtwjIttgvwevpC+/+6pIAF6A1TqysvwSDEQKWVcvHLIK03LjNJ0Ir8YjKPoqJbtHArADE5RVuxxM0SA2FA+ZCKsLAhOevJsCbM+VfkOt2n0kAAYiTSYWVhMEinjk3FEOPQsya9mQADiItJl6QBAoJDKJ+A1Z96JT2+D3UedAwEbcK9m1fUgAKqBGEOkorIX0hEmGMLDaMfl6RwysqHwPk4zv5T6cEcofgUhexb4biQSgAVbinl2DFpiUiMMGRUcm7C2baGyT+RYm9u31I1ZzC/wuTfx6JAAB9OxZi3vkrYhDAhAMg7KHa028fvGGWnmxSAA6Qa7MYK19s6x4Dbk9qcpVvfq9kQCcAIOXXvQZnoIVoHePT0COvf5IAE6GwiFtMiKDns632aBoyaSnKFneM9EPCcBgqBlsglBOipXZJjyuQJl1xiEBSMYI19wZaMLnRAKQnNs+PVHCmZbkGm7NSdQ9+P2a8HmRAEwKBbLSdht5zNke1C74PtqdTHRW9az2ZLGPBGBRNoHYYJKWbj/66kxkXH/lv+Guu71eE3xNJABCXBgJgBAXRgIgxIWRAAhxYSQAQlwYCYAQF+b/AMhIqrUoLl/mAAAAAElFTkSuQmCC";

function EaBadgeIcon({ size }: { size: number }): JSX.Element {
    const clipId = useRef(`eqa-${Math.random().toString(36).slice(2, 9)}`).current;
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
        >
            <defs>
                <clipPath id={clipId}>
                    <circle cx="12" cy="12" r="10" />
                </clipPath>
            </defs>
            <circle cx="12" cy="12" r="12" fill="#f59e0b" />
            <image
                href={PROJECT_ICON}
                x="2"
                y="2"
                width="20"
                height="20"
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#${clipId})`}
            />
        </svg>
    );
}

function EqArabicBadge({ size }: { size: number }): JSX.Element {
    return (
        <ErrorBoundary noop>
            <Tooltip text="Dev Esharq" position="top">
                {({ onMouseEnter, onMouseLeave }) => (
                    <div
                        className="eq-arabic-badge"
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        style={{ width: size, height: size }}
                        role="img"
                        aria-label="Dev Esharq"
                    >
                        <EaBadgeIcon size={size} />
                    </div>
                )}
            </Tooltip>
        </ErrorBoundary>
    );
}

// ─── Profile badge ────────────────────────────────────────────────────────────

const profileBadge: ProfileBadge = {
    id: BADGE_ID,
    key: BADGE_ID,
    description: "Dev Esharq",
    position: BadgePosition.START,
    shouldShow: ({ userId }: BadgeUserArgs) => hasBadge(userId),
    component: (_props: ProfileBadge & BadgeUserArgs) => <EqArabicBadge size={22} />,
};

// ─── Core module ──────────────────────────────────────────────────────────────
// required: true → cannot be disabled
// hidden: true   → not listed in plugin settings

export default definePlugin({
    name: "EqArabicBrand",
    description: "Esharq brand badge",
    authors: [],
    required: true,
    hidden: true,
    dependencies: ["BadgesAPI", "MessageDecorationsAPI"],

    start() {
        addProfileBadge(profileBadge);

        addMessageDecoration(BADGE_ID, ({ message }) => {
            if (!hasBadge(message?.author?.id ?? "")) return null;
            return <EqArabicBadge size={18} />;
        });
    },

    stop() {
        removeProfileBadge(profileBadge);
        removeMessageDecoration(BADGE_ID);
    },
});
