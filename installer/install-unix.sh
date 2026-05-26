#!/usr/bin/env bash
# Esharq  ·  Unix installer  (macOS + Linux)
# https://github.com/LOSTSTR/Esharq
# للدعم الفني: discord.gg/kDJYqWX3S3

set -euo pipefail

# ── Constants ──────────────────────────────────────────────────────────
REPO="LOSTSTR/Esharq"
ASAR="desktop.asar"
RELEASE_API="https://api.github.com/repos/${REPO}/releases/latest"
DISCORD_INVITE="https://discord.gg/kDJYqWX3S3"

# ── Terminal colors ────────────────────────────────────────────────────
if [ -t 1 ]; then
  C_RESET='\033[0m'
  C_BOLD='\033[1m'
  C_ACCENT='\033[38;5;105m'
  C_GREEN='\033[38;5;77m'
  C_RED='\033[38;5;203m'
  C_MUTED='\033[38;5;244m'
  C_WHITE='\033[38;5;255m'
else
  C_RESET='' C_BOLD='' C_ACCENT='' C_GREEN='' C_RED='' C_MUTED='' C_WHITE=''
fi

banner() {
  echo ""
  echo -e "${C_ACCENT}${C_BOLD}  ╔═══════════════════════════════════════════════╗${C_RESET}"
  echo -e "${C_ACCENT}${C_BOLD}  ║            ✦  Esharq Installer  v1.14         ║${C_RESET}"
  echo -e "${C_ACCENT}${C_BOLD}  ║       للدعم: discord.gg/kDJYqWX3S3            ║${C_RESET}"
  echo -e "${C_ACCENT}${C_BOLD}  ╚═══════════════════════════════════════════════╝${C_RESET}"
  echo ""
}

log()  { echo -e "  ${C_MUTED}→${C_RESET} $*"; }
ok()   { echo -e "  ${C_GREEN}✓${C_RESET} $*"; }
err()  { echo -e "  ${C_RED}✖${C_RESET} $*" >&2; }
die()  { err "$*"; exit 1; }
bold() { echo -e "  ${C_WHITE}${C_BOLD}$*${C_RESET}"; }

# ── Platform detection ─────────────────────────────────────────────────
detect_platform() {
  case "$(uname -s)" in
    Darwin) PLATFORM="macos" ;;
    Linux)  PLATFORM="linux" ;;
    *)      die "نظام التشغيل غير مدعوم: $(uname -s)" ;;
  esac
}

# ── Discord resources path discovery ──────────────────────────────────
find_discord_macos() {
  local variants=("Discord" "Discord PTB" "Discord Canary" "Discord Development")
  for v in "${variants[@]}"; do
    local app="/Applications/${v}.app/Contents/Resources"
    if [ -d "$app" ]; then
      echo "$app"
      return 0
    fi
  done
  return 1
}

find_discord_linux() {
  # Standard install locations
  local candidates=(
    "/usr/lib/discord/resources"
    "/usr/share/discord/resources"
    "/opt/discord/resources"
    "/opt/Discord/resources"
    "$HOME/.local/share/discord/resources"
  )
  for c in "${candidates[@]}"; do
    [ -d "$c" ] && { echo "$c"; return 0; }
  done

  # Flatpak
  local fp="$HOME/.var/app/com.discordapp.Discord/config/discord"
  if [ -d "$fp" ]; then
    local latest
    latest=$(find "$fp" -maxdepth 1 -name "app-*" -type d 2>/dev/null | sort | tail -1)
    [ -n "$latest" ] && [ -d "$latest/resources" ] && { echo "$latest/resources"; return 0; }
  fi

  # Snap
  local snap="/snap/discord/current/usr/share/discord/resources"
  [ -d "$snap" ] && { echo "$snap"; return 0; }

  return 1
}

find_discord() {
  if [ "$PLATFORM" = "macos" ]; then
    find_discord_macos
  else
    find_discord_linux
  fi
}

# ── Data directory ─────────────────────────────────────────────────────
data_dir() {
  if [ -n "${EQUICORD_USER_DATA_DIR:-}" ]; then
    echo "$EQUICORD_USER_DATA_DIR"
  elif [ "$PLATFORM" = "macos" ]; then
    echo "$HOME/Library/Application Support/Esharq"
  else
    echo "${XDG_DATA_HOME:-$HOME/.local/share}/Esharq"
  fi
}

# ── Download helpers ───────────────────────────────────────────────────
require_curl() {
  command -v curl >/dev/null 2>&1 || die "curl غير مثبَّت — الرجاء تثبيته أولاً"
}

fetch_latest_url() {
  local json url
  json=$(curl -fsSL -H "User-Agent: Esharq-Installer/1.14" "$RELEASE_API") \
    || die "تعذّر الوصول إلى GitHub API"
  url=$(echo "$json" | grep -o '"browser_download_url": *"[^"]*desktop\.asar[^"]*"' \
    | head -1 | grep -o 'https://[^"]*')
  [ -n "$url" ] || die "لم يُعثر على ملف ${ASAR} في أحدث إصدار"
  echo "$url"
}

fetch_latest_tag() {
  curl -fsSL -H "User-Agent: Esharq-Installer/1.14" "$RELEASE_API" 2>/dev/null \
    | grep -o '"tag_name": *"[^"]*"' | head -1 | grep -o '"[^"]*"$' | tr -d '"' \
    || echo "—"
}

download_with_progress() {
  local url="$1" dest="$2"
  if curl --version | grep -q "progress-bar" 2>/dev/null; then
    curl -fSL --progress-bar -H "User-Agent: Esharq-Installer/1.14" -o "$dest" "$url"
  else
    curl -fSL -H "User-Agent: Esharq-Installer/1.14" -o "$dest" "$url"
  fi
}

# ── Install ────────────────────────────────────────────────────────────
cmd_install() {
  local res_dir="${1:-}"

  if [ -z "$res_dir" ]; then
    log "جارٍ البحث عن تثبيت Discord..."
    res_dir=$(find_discord) || die "لم يُعثر على Discord — تأكد من تثبيته أو مرِّر المسار يدوياً"
    ok "عُثر على Discord في: ${C_WHITE}${res_dir}${C_RESET}"
  else
    [ -d "$res_dir" ] || die "المسار غير موجود: $res_dir"
    ok "مسار مخصص: ${C_WHITE}${res_dir}${C_RESET}"
  fi

  require_curl

  bold "جارٍ جلب معلومات آخر إصدار..."
  local tag url
  tag=$(fetch_latest_tag)
  url=$(fetch_latest_url)
  log "الإصدار: ${tag}"

  local data
  data=$(data_dir)
  mkdir -p "$data"

  local tmp
  tmp=$(mktemp "/tmp/esharq_XXXXXX.asar")
  trap 'rm -f "$tmp"' EXIT

  bold "جارٍ تنزيل ${ASAR}..."
  download_with_progress "$url" "$tmp"

  bold "جارٍ تطبيق التعديل..."

  # Kill Discord before patching
  if [ "$PLATFORM" = "macos" ]; then
    pkill -x "Discord" 2>/dev/null || true
    pkill -x "Discord PTB" 2>/dev/null || true
    pkill -x "Discord Canary" 2>/dev/null || true
    sleep 1
  else
    pkill -x discord 2>/dev/null || true
    sleep 1
  fi

  cp "$tmp" "${res_dir}/${ASAR}"
  cp "$tmp" "${data}/equicord.asar"

  ok "تم التثبيت — أعد تشغيل Discord لتفعيل Esharq"
  echo ""
  echo -e "  ${C_MUTED}للدعم الفني انضم إلى خادم Discord الرسمي:${C_RESET}"
  echo -e "  ${C_ACCENT}${DISCORD_INVITE}${C_RESET}"
  echo ""
}

# ── Uninstall ──────────────────────────────────────────────────────────
cmd_uninstall() {
  local res_dir="${1:-}"

  if [ -z "$res_dir" ]; then
    res_dir=$(find_discord) || die "لم يُعثر على Discord"
    ok "عُثر على Discord في: ${C_WHITE}${res_dir}${C_RESET}"
  fi

  local data
  data=$(data_dir)

  [ -f "${res_dir}/${ASAR}" ] && rm -f "${res_dir}/${ASAR}" && ok "تم حذف ${ASAR} من Discord"
  [ -f "${data}/equicord.asar" ] && rm -f "${data}/equicord.asar" && ok "تم حذف equicord.asar"
  ok "اكتملت الإزالة — أعد تشغيل Discord"
}

# ── Status ─────────────────────────────────────────────────────────────
cmd_status() {
  local data
  data=$(data_dir)
  local asar="${data}/equicord.asar"

  echo ""
  if [ -f "$asar" ]; then
    local mtime
    mtime=$(date -r "$asar" "+%Y-%m-%d" 2>/dev/null || stat -c "%y" "$asar" 2>/dev/null | cut -d' ' -f1)
    ok "Esharq مثبَّت  (${mtime})"
  else
    log "Esharq غير مثبَّت"
  fi

  local res_dir
  if res_dir=$(find_discord 2>/dev/null); then
    ok "Discord موجود في: ${res_dir}"
    if [ -f "${res_dir}/${ASAR}" ]; then
      ok "${ASAR} مطبَّق"
    else
      log "${ASAR} غير مطبَّق على هذا التثبيت"
    fi
  else
    log "لم يُعثر على Discord"
  fi
  echo ""
}

# ── Help ───────────────────────────────────────────────────────────────
usage() {
  echo ""
  bold "الاستخدام:"
  echo "  $0 install   [مسار-resources]   — تثبيت Esharq"
  echo "  $0 uninstall [مسار-resources]   — إزالة Esharq"
  echo "  $0 status                       — فحص حالة التثبيت"
  echo ""
  echo -e "  ${C_MUTED}للدعم: ${DISCORD_INVITE}${C_RESET}"
  echo ""
}

# ── Entry point ────────────────────────────────────────────────────────
main() {
  banner
  detect_platform

  local cmd="${1:-install}"
  shift 2>/dev/null || true

  case "$cmd" in
    install)   cmd_install   "${1:-}" ;;
    uninstall) cmd_uninstall "${1:-}" ;;
    status)    cmd_status ;;
    -h|--help|help) usage ;;
    *) err "أمر غير معروف: $cmd"; usage; exit 1 ;;
  esac
}

main "$@"
