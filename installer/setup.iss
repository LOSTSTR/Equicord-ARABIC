; ════════════════════════════════════════════════════════════════════
;  Equicord-ARABIC  —  Inno Setup Script
;  يُنتج: EquicordArabicSetup.exe
;  الترجمة: Inno Setup 6.x
;  Copyright (c) 2026 LOSTSTR  —  GPL-3.0
; ════════════════════════════════════════════════════════════════════

#define AppName      "Equicord-ARABIC"
#define AppVersion   "1.0.0"
#define AppPublisher "LOSTSTR"
#define AppURL       "https://github.com/LOSTSTR/Equicord-ARABIC"
#define AppExeName   "EquicordArabic-Setup.exe"

[Setup]
; ── Identity ─────────────────────────────────────────────────────
AppId                    = {{E3A1F4B2-7C8D-4E9A-B5F6-2D3C4A5E6F7B}
AppName                  = {#AppName}
AppVersion               = {#AppVersion}
AppVerName               = {#AppName} v{#AppVersion}
AppPublisher             = {#AppPublisher}
AppPublisherURL          = {#AppURL}
AppSupportURL            = {#AppURL}/issues
AppUpdatesURL            = {#AppURL}/releases

; ── Files ────────────────────────────────────────────────────────
DefaultDirName           = {autopf}\{#AppName}
DefaultGroupName         = {#AppName}
OutputDir                = ..\dist\Installer
OutputBaseFilename       = EquicordArabicSetup
SetupIconFile            = icon.ico
UninstallDisplayIcon     = {app}\EquicordArabic-Setup.exe

; ── Appearance ───────────────────────────────────────────────────
WizardStyle              = modern
WizardResizable          = no
WizardSizePercent        = 110

; ── Behaviour ────────────────────────────────────────────────────
Compression              = lzma2/ultra64
SolidCompression         = yes
PrivilegesRequired       = lowest
PrivilegesRequiredOverridesAllowed = dialog
DisableProgramGroupPage  = yes
DisableDirPage           = yes
DisableReadyPage         = yes
DisableFinishedPage      = no
CreateUninstallRegKey    = yes
Uninstallable            = yes

; ── Version info embedded in EXE ─────────────────────────────────
VersionInfoVersion       = {#AppVersion}.0
VersionInfoCompany       = {#AppPublisher}
VersionInfoDescription   = Equicord-ARABIC Discord Mod Installer
VersionInfoCopyright     = Copyright (c) 2026 LOSTSTR
VersionInfoProductName   = {#AppName}
VersionInfoProductVersion= {#AppVersion}

; ── Code signing (توقيع رقمي) ────────────────────────────────────
; SignTool = signtool sign /a /fd sha256 /tr http://timestamp.digicert.com /td sha256 $f
; SignedUninstaller = yes

[Languages]
Name: "arabic";  MessagesFile: "compiler:Languages\Arabic.isl"
Name: "english"; MessagesFile: "compiler:Default.isl"

[Files]
; PowerShell installer script
Source: "EquicordArabic-Setup.ps1"; DestDir: "{app}"; Flags: ignoreversion
; Icon for the launcher EXE
Source: "icon.ico";                 DestDir: "{app}"; Flags: ignoreversion
; License
Source: "..\LICENSE";              DestDir: "{app}"; DestName: "LICENSE.txt"; Flags: ignoreversion

[Icons]
Name: "{group}\{#AppName}";           Filename: "{app}\EquicordArabic-Setup.exe"
Name: "{group}\إلغاء التثبيت";       Filename: "{uninstallexe}"
Name: "{commondesktop}\{#AppName}";   Filename: "{app}\EquicordArabic-Setup.exe"; Tasks: desktopicon

[Tasks]
Name: "desktopicon"; Description: "إنشاء اختصار على سطح المكتب"; GroupDescription: "إضافات:"

[Run]
; Launch the PS installer after setup completes
Filename: "powershell.exe";                               \
  Parameters: "-ExecutionPolicy Bypass -File ""{app}\EquicordArabic-Setup.ps1"""; \
  Description: "تشغيل Equicord-ARABIC Installer الآن";   \
  Flags: nowait postinstall skipifsilent

[UninstallRun]
; Nothing extra — the uninstaller removes the app dir automatically

[Code]
// ─────────────────────────────────────────────────────────────────
//  Custom welcome page with gold branding
// ─────────────────────────────────────────────────────────────────
procedure InitializeWizard;
begin
  WizardForm.WelcomeLabel1.Caption := 'Equicord-ARABIC';
  WizardForm.WelcomeLabel2.Caption :=
    'مرحباً بك في مُثبِّت Equicord-ARABIC' + #13#10 +
    'النسخة العربية الكاملة من Equicord لتعديل Discord.' + #13#10#13#10 +
    'بمجرد اكتمال التثبيت ستنفتح واجهة التثبيت التفاعلية' + #13#10 +
    'لاختيار نسخة Discord وتثبيت المود.';
end;

function InitializeSetup(): Boolean;
var
  PSVersion: String;
begin
  // Check PowerShell 5.1+
  if not RegQueryStringValue(HKLM,
    'SOFTWARE\Microsoft\PowerShell\3\PowerShellEngine',
    'PowerShellVersion', PSVersion) then
  begin
    MsgBox(
      'يتطلب هذا المُثبِّت PowerShell 5.1 أو أحدث.' + #13#10 +
      'الرجاء تحديث Windows ثم أعد التشغيل.',
      mbError, MB_OK);
    Result := False;
    Exit;
  end;
  Result := True;
end;
