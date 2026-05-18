#!/usr/bin/env bash
# Esharq — مُثبِّت Linux التفاعلي
# https://github.com/LOSTSTR/Esharq
# يدعم: Ubuntu/Debian, Fedora/RHEL, Arch Linux, والتوزيعات المشتقة

set -euo pipefail

REPO="LOSTSTR/Esharq"
ASAR_FILENAME="equicord.asar"
DATA_DIR="${EQUICORD_USER_DATA_DIR:-$HOME/.config/Esharq}"
ASAR_PATH="$DATA_DIR/$ASAR_FILENAME"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

print_banner() {
    echo -e "${BLUE}${BOLD}"
    echo "  ╔══════════════════════════════════════════╗"
    echo "  ║          Esharq — مُثبِّت Linux            ║"
    echo "  ║   النسخة العربية الرسمية من Equicord     ║"
    echo "  ╚══════════════════════════════════════════╝"
    echo -e "${NC}"
    echo -e "  ${CYAN}المستودع:${NC} https://github.com/$REPO"
    echo ""
}

check_requirements() {
    local missing=()
    for cmd in curl find; do
        if ! command -v "$cmd" &>/dev/null; then
            missing+=("$cmd")
        fi
    done
    if [[ ${#missing[@]} -gt 0 ]]; then
        echo -e "${RED}❌ الأدوات التالية مفقودة: ${missing[*]}${NC}"
        echo -e "${YELLOW}   قم بتثبيتها باستخدام مدير الحزم الخاص بتوزيعتك.${NC}"
        exit 1
    fi
}

download_asar() {
    echo -e "${BLUE}⬇️  جارٍ تحميل أحدث إصدار من Esharq...${NC}"

    local api_url="https://api.github.com/repos/$REPO/releases/latest"
    local download_url
    download_url=$(curl -fsSL "$api_url" \
        | grep '"browser_download_url"' \
        | grep 'desktop\.asar' \
        | head -1 \
        | cut -d'"' -f4)

    if [[ -z "$download_url" ]]; then
        echo -e "${RED}❌ تعذّر الحصول على رابط التحميل.${NC}"
        echo -e "${YELLOW}   تحقق من اتصالك بالإنترنت وأن المستودع يحتوي على إصدار.${NC}"
        exit 1
    fi

    mkdir -p "$DATA_DIR"
    echo -e "   ${CYAN}المصدر:${NC} $download_url"
    curl -fL --progress-bar "$download_url" -o "$ASAR_PATH"
    echo -e "${GREEN}✅ تم تحميل الملف إلى:${NC} $ASAR_PATH"
    echo ""
}

write_bootstrap() {
    local resources_dir="$1"
    local app_dir="$resources_dir/app"

    mkdir -p "$app_dir"

    cat > "$app_dir/package.json" << 'PKGJSON'
{
    "name": "discord",
    "main": "index.js"
}
PKGJSON

    cat > "$app_dir/index.js" << INDEXJS
// Esharq Loader — https://github.com/LOSTSTR/Esharq
const path = require("path");
const os = require("os");

const dataDir = process.env.EQUICORD_USER_DATA_DIR
    || path.join(os.homedir(), ".config", "Esharq");

require(path.join(dataDir, "equicord.asar"));
INDEXJS
}

find_discord_resources() {
    local resources_dirs=()

    # Standard installation paths (deb/rpm packages)
    local standard_paths=(
        "/usr/lib/discord/resources"
        "/usr/lib/discord-ptb/resources"
        "/usr/lib/discord-canary/resources"
        "/usr/lib/discord-development/resources"
        "/opt/discord/resources"
        "/opt/discord-ptb/resources"
        "/opt/discord-canary/resources"
    )

    # Flatpak paths
    local flatpak_base="$HOME/.var/app"
    local flatpak_ids=(
        "com.discordapp.Discord"
        "com.discordapp.DiscordPTB"
        "com.discordapp.DiscordCanary"
    )

    # Snap paths
    local snap_base="/snap"
    local snap_names=("discord" "discord-ptb" "discord-canary")

    for path_entry in "${standard_paths[@]}"; do
        if [[ -d "$path_entry" ]]; then
            resources_dirs+=("$path_entry")
        fi
    done

    for fid in "${flatpak_ids[@]}"; do
        local fp="$flatpak_base/$fid/current/active/files/discord/resources"
        if [[ -d "$fp" ]]; then
            resources_dirs+=("$fp")
        fi
    done

    for snap in "${snap_names[@]}"; do
        if [[ -d "$snap_base/$snap" ]]; then
            local snap_res
            snap_res=$(find "$snap_base/$snap" -maxdepth 5 -name "resources" -type d 2>/dev/null | head -1)
            [[ -n "$snap_res" ]] && resources_dirs+=("$snap_res")
        fi
    done

    printf '%s\n' "${resources_dirs[@]}"
}

inject_into_discord() {
    local resources="$1"
    local label="$2"

    if [[ -f "$resources/app/index.js" ]]; then
        echo -e "  ${CYAN}♻️  تحديث حقن موجود مسبقاً في: $label${NC}"
    else
        echo -e "  ${BLUE}🔧 حقن Esharq في: $label${NC}"
    fi

    write_bootstrap "$resources"
    echo -e "  ${GREEN}✅ تم بنجاح: $label${NC}"
}

uninstall_from_discord() {
    local resources="$1"
    local label="$2"
    local app_dir="$resources/app"

    if [[ ! -d "$app_dir" ]]; then
        echo -e "  ${YELLOW}⚠️  لا يوجد حقن في: $label${NC}"
        return 0
    fi

    rm -rf "$app_dir"
    echo -e "  ${GREEN}✅ تمت إزالة الحقن من: $label${NC}"
}

show_menu() {
    echo -e "${BOLD}اختر العملية:${NC}"
    echo -e "  ${GREEN}1)${NC} تثبيت / تحديث Esharq"
    echo -e "  ${YELLOW}2)${NC} إلغاء التثبيت"
    echo -e "  ${RED}3)${NC} خروج"
    echo ""
    printf "أدخل اختيارك [1-3]: "
    read -r choice
    echo ""
    echo "$choice"
}

main() {
    print_banner

    local arch
    arch=$(uname -m)
    echo -e "  ${CYAN}🖥️  المعالج: $arch${NC}"

    local distro
    distro=$(grep -oP '(?<=^ID=).+' /etc/os-release 2>/dev/null | tr -d '"' || echo "غير محدد")
    echo -e "  ${CYAN}🐧 التوزيعة: $distro${NC}"
    echo ""

    check_requirements

    echo -e "${BLUE}🔍 البحث عن إصدارات Discord المثبتة...${NC}"
    local found_dirs=()
    local found_labels=()

    while IFS= read -r dir; do
        if [[ -n "$dir" ]]; then
            found_dirs+=("$dir")
            found_labels+=("$(echo "$dir" | sed 's|.*/\([^/]*\)/resources|\1|')")
        fi
    done < <(find_discord_resources)

    if [[ ${#found_dirs[@]} -eq 0 ]]; then
        echo -e "${RED}❌ لم يتم العثور على أي إصدار من Discord.${NC}"
        echo -e "${YELLOW}   يرجى تثبيت Discord من: https://discord.com/download${NC}"
        echo -e "${YELLOW}   أو من Flatpak: flatpak install flathub com.discordapp.Discord${NC}"
        exit 1
    fi

    echo -e "${GREEN}تم العثور على ${#found_dirs[@]} إصدار(ات):${NC}"
    for label in "${found_labels[@]}"; do
        echo -e "  ✓ $label"
    done
    echo ""

    local choice
    choice=$(show_menu)

    case "$choice" in
        1)
            download_asar
            echo -e "${BLUE}🔧 جارٍ الحقن في Discord...${NC}"
            local injected=0
            for i in "${!found_dirs[@]}"; do
                if inject_into_discord "${found_dirs[$i]}" "${found_labels[$i]}"; then
                    ((injected++))
                fi
            done
            echo ""
            if [[ $injected -gt 0 ]]; then
                echo -e "${GREEN}${BOLD}"
                echo "  ╔══════════════════════════════════════════╗"
                echo "  ║     ✅ تم التثبيت بنجاح!                ║"
                echo "  ║  أعد تشغيل Discord لتفعيل التعديلات    ║"
                echo "  ╚══════════════════════════════════════════╝"
                echo -e "${NC}"
            else
                echo -e "${RED}❌ فشل الحقن. قد تحتاج إلى صلاحيات مدير.${NC}"
                echo -e "${YELLOW}   حاول تشغيل السكريبت بـ: sudo bash install-linux.sh${NC}"
                exit 1
            fi
            ;;
        2)
            echo -e "${YELLOW}🗑️  جارٍ إزالة Esharq...${NC}"
            for i in "${!found_dirs[@]}"; do
                uninstall_from_discord "${found_dirs[$i]}" "${found_labels[$i]}"
            done
            if [[ -f "$ASAR_PATH" ]]; then
                rm -f "$ASAR_PATH"
                echo -e "${GREEN}✅ تم حذف: $ASAR_PATH${NC}"
            fi
            echo ""
            echo -e "${GREEN}✅ تمت إزالة Esharq. أعد تشغيل Discord.${NC}"
            ;;
        3)
            echo -e "${CYAN}خروج.${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ اختيار غير صالح.${NC}"
            exit 1
            ;;
    esac
}

main "$@"
