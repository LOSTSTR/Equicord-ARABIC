$csc = "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
$dir = $PSScriptRoot
$result = & $csc /nologo /target:winexe /platform:anycpu /optimize+ /utf8output `
    "/win32manifest:$dir\Esharq.manifest" `
    "/win32icon:$dir\icon.ico" `
    /reference:System.Windows.Forms.dll `
    /reference:System.Drawing.dll `
    "/out:$dir\EsharqSetup.exe" `
    "$dir\Esharq-Installer.cs" 2>&1
$result | Out-File "$dir\build.log" -Encoding utf8
if (Test-Path "$dir\EsharqSetup.exe") {
    $info = Get-Item "$dir\EsharqSetup.exe"
    "SUCCESS: $($info.Length) bytes, $($info.LastWriteTime)" | Add-Content "$dir\build.log"
}
