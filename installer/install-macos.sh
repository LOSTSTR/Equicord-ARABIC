#!/usr/bin/env bash
# Esharq — مُثبِّت macOS التفاعلي
# https://github.com/LOSTSTR/Esharq
# يدعم: Apple Silicon (ARM64) و Intel (x86_64)

set -euo pipefail

REPO="LOSTSTR/Equicord-ARABIC"
ASAR_FILENAME="equicord.asar"
DATA_DIR="${EQUICORD_USER_DATA_DIR:-$HOME/Library/Application Support/Esharq}"
ASAR_PATH="$DATA_DIR/$ASAR_FILENAME"

DISCORD_APPS=(
    "/Applications/Discord.app"
    "/Applications/DiscordPTB.app"
    "/Applications/DiscordCanary.app"
    "/Applications/DiscordDevelopment.app"
)

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
    echo "  ║          Esharq — مُثبِّت macOS            ║"
    echo "  ║   النسخة العربية الرسمية من Equicord     ║"
    echo "  ╚══════════════════════════════════════════╝"
    echo -e "${NC}"
    echo -e "  ${CYAN}المستودع:${NC} https://github.com/$REPO"
    echo ""
}

check_requirements() {
    if ! command -v curl &>/dev/null; then
        echo -e "${RED}❌ الأداة 'curl' غير موجودة. يرجى تثبيتها أولاً.${NC}"
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
    || path.join(os.homedir(), "Library", "Application Support", "Esharq");

require(path.join(dataDir, "equicord.asar"));
INDEXJS
}

inject_into_discord() {
    local app_path="$1"
    local app_name
    app_name=$(basename "$app_path" .app)
    local resources="$app_path/Contents/Resources"

    if [[ ! -d "$resources" ]]; then
        echo -e "  ${YELLOW}⚠️  مجلد Resources غير موجود في: $app_path${NC}"
        return 1
    fi

    # Detect existing injection
    if [[ -f "$resources/app/index.js" ]]; then
        echo -e "  ${CYAN}♻️  تحديث حقن موجود مسبقاً في: $app_name${NC}"
    else
        echo -e "  ${BLUE}🔧 حقن Esharq في: $app_name${NC}"
    fi

    write_bootstrap "$resources"
    echo -e "  ${GREEN}✅ تم بنجاح: $app_name${NC}"
    return 0
}

uninstall_from_discord() {
    local app_path="$1"
    local app_name
    app_name=$(basename "$app_path" .app)
    local resources="$app_path/Contents/Resources"
    local app_dir="$resources/app"

    if [[ ! -d "$app_dir" ]]; then
        echo -e "  ${YELLOW}⚠️  لا يوجد حقن في: $app_name${NC}"
        return 0
    fi

    rm -rf "$app_dir"
    echo -e "  ${GREEN}✅ تمت إزالة الحقن من: $app_name${NC}"
    return 0
}

find_discord_apps() {
    local found=()
    for app in "${DISCORD_APPS[@]}"; do
        if [[ -d "$app" ]]; then
            found+=("$app")
        fi
    done
    printf '%s\n' "${found[@]}"
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

    # Detect architecture
    local arch
    arch=$(uname -m)
    if [[ "$arch" == "arm64" ]]; then
        echo -e "  ${CYAN}🖥️  المعالج: Apple Silicon (ARM64)${NC}"
    else
        echo -e "  ${CYAN}🖥️  المعالج: Intel (x86_64)${NC}"
    fi

    # macOS version check
    local macos_ver
    macos_ver=$(sw_vers -productVersion 2>/dev/null || echo "غير محدد")
    echo -e "  ${CYAN}🍎 إصدار macOS: $macos_ver${NC}"
    echo ""

    check_requirements

    # Find Discord installations
    echo -e "${BLUE}🔍 البحث عن إصدارات Discord المثبتة...${NC}"
    local found_apps=()
    while IFS= read -r app; do
        [[ -n "$app" ]] && found_apps+=("$app")
    done < <(find_discord_apps)

    if [[ ${#found_apps[@]} -eq 0 ]]; then
        echo -e "${RED}❌ لم يتم العثور على أي إصدار من Discord.${NC}"
        echo -e "${YELLOW}   يرجى تثبيت Discord من: https://discord.com/download${NC}"
        exit 1
    fi

    echo -e "${GREEN}تم العثور على ${#found_apps[@]} إصدار(ات):${NC}"
    for app in "${found_apps[@]}"; do
        echo -e "  ✓ $(basename "$app")"
    done
    echo ""

    local choice
    choice=$(show_menu)

    case "$choice" in
        1)
            download_asar
            echo -e "${BLUE}🔧 جارٍ الحقن في Discord...${NC}"
            local injected=0
            for app in "${found_apps[@]}"; do
                if inject_into_discord "$app"; then
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
                echo -e "${YELLOW}   حاول تشغيل السكريبت بـ: sudo bash install-macos.sh${NC}"
                exit 1
            fi
            ;;
        2)
            echo -e "${YELLOW}🗑️  جارٍ إزالة Esharq...${NC}"
            for app in "${found_apps[@]}"; do
                uninstall_from_discord "$app"
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
