#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────
#  Esharq — macOS Installer
#  https://github.com/LOSTSTR/Esharq
#  للدعم الفني: discord.gg/kDJYqWX3S3
# ─────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO="LOSTSTR/Esharq"
ASAR="desktop.asar"
RELEASE_API="https://api.github.com/repos/${REPO}/releases/latest"
DISCORD_URL="https://discord.gg/kDJYqWX3S3"
DATA_DIR="${HOME}/Library/Application Support/Esharq"

# ── Colors ────────────────────────────────────────────────────────────
if [ -t 1 ]; then
  R='\033[0m' B='\033[1m'
  CA='\033[38;5;105m' CG='\033[38;5;77m'
  CR='\033[38;5;203m' CM='\033[38;5;244m' CW='\033[38;5;255m'
else
  R='' B='' CA='' CG='' CR='' CM='' CW=''
fi

banner() {
  echo ""
  echo -e "${CA}${B}  ╔══════════════════════════════════════════════╗${R}"
  echo -e "${CA}${B}  ║        ✦  Esharq  •  macOS Installer        ║${R}"
  echo -e "${CA}${B}  ║     للدعم: discord.gg/kDJYqWX3S3            ║${R}"
  echo -e "${CA}${B}  ╚══════════════════════════════════════════════╝${R}"
  echo ""
}

log()  { echo -e "  ${CM}→${R} $*"; }
ok()   { echo -e "  ${CG}✓${R} $*"; }
err()  { echo -e "  ${CR}✖${R} $*" >&2; }
die()  { err "$*"; exit 1; }
hdr()  { echo -e "  ${CW}${B}$*${R}"; }

# ── Verify macOS ──────────────────────────────────────────────────────
[ "$(uname -s)" = "Darwin" ] || die "هذا السكريبت مخصص لـ macOS فقط — للينكس استخدم install-linux.sh"

# ── Discord detection ─────────────────────────────────────────────────
find_discord() {
  local variants=("Discord" "Discord PTB" "Discord Canary" "Discord Development")
  for v in "${variants[@]}"; do
    local res="/Applications/${v}.app/Contents/Resources"
    if [ -d "$res" ]; then
      echo "$res"
      return 0
    fi
  done
  return 1
}

# ── GitHub helpers ────────────────────────────────────────────────────
require_curl() {
  command -v curl >/dev/null 2>&1 || die "curl غير مثبَّت — قم بتثبيته أولاً"
}

fetch_json() {
  curl -fsSL -H "User-Agent: Esharq-Installer/1.14 (macOS)" "$RELEASE_API" \
    || die "تعذّر الوصول إلى GitHub API — تحقق من اتصال الإنترنت"
}

latest_tag() {
  fetch_json | grep -o '"tag_name": *"[^"]*"' | head -1 \
    | grep -o '"[^"]*"$' | tr -d '"' || echo "—"
}

latest_url() {
  fetch_json \
    | grep -o '"browser_download_url": *"[^"]*desktop\.asar[^"]*"' \
    | head -1 | grep -o 'https://[^"]*' \
    || die "لم يُعثر على ملف ${ASAR} في أحدث إصدار"
}

download_asar() {
  local url="$1" dest="$2"
  curl -fSL --progress-bar \
    -H "User-Agent: Esharq-Installer/1.14 (macOS)" \
    -o "$dest" "$url"
}

kill_discord() {
  pkill -x "Discord"          2>/dev/null || true
  pkill -x "Discord PTB"      2>/dev/null || true
  pkill -x "Discord Canary"   2>/dev/null || true
  sleep 1
}

# ── Commands ──────────────────────────────────────────────────────────

cmd_install() {
  local res_dir="${1:-}"

  if [ -z "$res_dir" ]; then
    log "جارٍ البحث عن Discord في /Applications..."
    res_dir=$(find_discord) \
      || die "لم يُعثر على Discord — تأكد من تثبيته أو مرِّر المسار يدوياً:\n  $0 install /path/to/Discord.app/Contents/Resources"
    ok "عُثر على Discord في: ${CW}${res_dir}${R}"
  else
    [ -d "$res_dir" ] || die "المسار غير موجود: $res_dir"
    ok "مسار مخصص: ${CW}${res_dir}${R}"
  fi

  require_curl

  hdr "جارٍ جلب معلومات آخر إصدار..."
  local tag url
  tag=$(latest_tag)
  url=$(latest_url)
  log "الإصدار: ${tag}"

  mkdir -p "$DATA_DIR"
  local tmp
  tmp=$(mktemp "/tmp/esharq_XXXXXX.asar")
  trap 'rm -f "$tmp"' EXIT

  hdr "جارٍ تنزيل ${ASAR}..."
  download_asar "$url" "$tmp"

  hdr "جارٍ تطبيق التعديل..."
  kill_discord

  cp "$tmp" "${res_dir}/${ASAR}"
  cp "$tmp" "${DATA_DIR}/equicord.asar"

  echo ""
  ok "تم التثبيت — أعد تشغيل Discord لتفعيل Esharq"
  echo ""
  echo -e "  ${CM}للدعم الفني انضم للخادم الرسمي:${R}"
  echo -e "  ${CA}${DISCORD_URL}${R}"
  echo ""
}

cmd_uninstall() {
  local res_dir="${1:-}"

  if [ -z "$res_dir" ]; then
    res_dir=$(find_discord) || die "لم يُعثر على Discord"
    ok "عُثر على Discord في: ${CW}${res_dir}${R}"
  fi

  kill_discord

  [ -f "${res_dir}/${ASAR}" ] \
    && rm -f "${res_dir}/${ASAR}" \
    && ok "تم حذف ${ASAR} من Discord"

  [ -f "${DATA_DIR}/equicord.asar" ] \
    && rm -f "${DATA_DIR}/equicord.asar" \
    && ok "تم حذف equicord.asar"

  ok "اكتملت الإزالة — أعد تشغيل Discord"
}

cmd_status() {
  echo ""
  local asar="${DATA_DIR}/equicord.asar"

  if [ -f "$asar" ]; then
    local mtime
    mtime=$(date -r "$asar" "+%Y-%m-%d" 2>/dev/null || echo "مجهول")
    ok "Esharq مثبَّت  (${mtime})"
  else
    log "Esharq غير مثبَّت"
  fi

  local res_dir
  if res_dir=$(find_discord 2>/dev/null); then
    ok "Discord موجود في: ${res_dir}"
    [ -f "${res_dir}/${ASAR}" ] \
      && ok "${ASAR} مطبَّق على هذا التثبيت" \
      || log "${ASAR} غير مطبَّق على هذا التثبيت"
  else
    log "لم يُعثر على Discord في /Applications"
  fi
  echo ""
}

usage() {
  echo ""
  hdr "الاستخدام  (macOS):"
  echo "  $0 install   [مسار-Resources]   — تثبيت Esharq"
  echo "  $0 uninstall [مسار-Resources]   — إزالة Esharq"
  echo "  $0 status                       — فحص حالة التثبيت"
  echo ""
  echo -e "  ${CM}مثال:  sudo bash $0 install${R}"
  echo -e "  ${CM}للدعم: ${DISCORD_URL}${R}"
  echo ""
}

# ── Entry ─────────────────────────────────────────────────────────────
banner
cmd="${1:-install}"; shift 2>/dev/null || true

case "$cmd" in
  install)   cmd_install   "${1:-}" ;;
  uninstall) cmd_uninstall "${1:-}" ;;
  status)    cmd_status ;;
  -h|--help|help) usage ;;
  *) err "أمر غير معروف: $cmd"; usage; exit 1 ;;
esac
