<#
gitee_setup.ps1
用途：在当前目录初始化 git、创建 docs/index.html 或根目录 index.html（若不存在），添加 remote origin 并 push 到 main 分支。
适用：Windows 10/11 PowerShell（内置 Git for Windows 亦可），不调用 Gitee API（无需 token）。
用法示例：
  PS> .\gitee_setup.ps1 -Remote "https://gitee.com/perspicace6019/projects.git" -DeployDir docs -Branch main -Username perspicace6019 -RepoName projects

参数:
  -Remote     : 远程仓库地址（必填，HTTPS 或 SSH，带 .git 更稳妥）
  -RepoName   : 仓库名（可选，用于输出提示）
  -Username   : Gitee 用户名（可选，用于输出提示）
  -DeployDir  : docs 或 root（默认为 docs）
  -Branch     : 要推送的分支（默认为 main）
#>

param(
  [Parameter(Mandatory=$false)][string]$Remote,
  [Parameter(Mandatory=$false)][string]$RepoName,
  [Parameter(Mandatory=$false)][string]$Username,
  [ValidateSet("docs","root")][string]$DeployDir = "docs",
  [string]$Branch = "main"
)

function Write-Info($msg){ Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Warn($msg){ Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Err($msg){ Write-Host "[ERROR] $msg" -ForegroundColor Red }

# 检查 git 是否已安装
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Err "未检测到 git。请先安装 Git for Windows（https://git-scm.com/download/win），然后重试。"
  exit 1
}

# 检查当前目录
$Root = (Get-Location).ProviderPath
Write-Info "当前项目根目录： $Root"

# 如果未提供 Remote，则提示用户输入（交互）
if ([string]::IsNullOrWhiteSpace($Remote)) {
  $Remote = Read-Host "请输入远程仓库地址（例如 https://gitee.com/用户名/仓库.git 或 git@gitee.com:用户名/仓库.git）"
}
if ([string]::IsNullOrWhiteSpace($Remote)) {
  Write-Err "未提供远程地址，脚本退出。"
  exit 1
}

if (-not $RepoName) {
  # 尝试从 remote 推断 repo name
  if ($Remote -match "/([^/]+)\.git$") { $RepoName = $Matches[1] }
}
if (-not $Username) {
  if ($Remote -match "gitee.com[:/]+([^/]+)/") { $Username = $Matches[1] }
}

Write-Info "将使用远程仓库： $Remote"
if ($RepoName) { Write-Info "仓库名： $RepoName" }
if ($Username) { Write-Info "用户名： $Username" }

# 初始化 git 仓库（若未初始化）
if (-not (Test-Path ".git")) {
  Write-Info "未检测到 .git，正在初始化 Git 仓库..."
  git init | Out-Null
} else {
  Write-Info "检测到已存在 Git 仓库（.git）"
}

# 创建 README.md（若不存在）
if (-not (Test-Path "README.md")) {
  Write-Info "创建 README.md"
  @"
# $RepoName

静态站点：部署到 Gitee Pages 的示例项目。
部署目录：$DeployDir
"@ | Out-File -FilePath README.md -Encoding UTF8
  git add README.md | Out-Null
}

# 创建 .gitignore（若不存在）
if (-not (Test-Path ".gitignore")) {
  Write-Info "创建 .gitignore"
  @"
node_modules/
.vscode/
*.log
.DS_Store
"@ | Out-File -FilePath .gitignore -Encoding UTF8
  git add .gitignore | Out-Null
}

# 创建部署示例文件（docs/index.html 或 根 index.html）
if ($DeployDir -eq "docs") {
  if (-not (Test-Path "docs")) {
    Write-Info "创建 docs/ 目录与示例 index.html"
    New-Item -ItemType Directory -Path docs | Out-Null
  }
  if (-not (Test-Path "docs/index.html")) {
    @"
<!doctype html>
<html>
<head><meta charset='utf-8'><title>示例站点</title></head>
<body>
  <h1>药物-靶点交互式学习平台（示例）</h1>
  <p>此页面由 gitee_setup.ps1 生成。请将你的静态文件放到 docs/ 以部署到 Gitee Pages。</p >
</body>
</html>
"@ | Out-File -FilePath docs/index.html -Encoding UTF8
    git add docs/index.html | Out-Null
  } else {
    Write-Info "检测到 docs/index.html，保留原文件"
  }
} else {
  # root
  if (-not (Test-Path "index.html")) {
    Write-Info "创建根目录 index.html 示例"
    @"
<!doctype html>
<html>
<head><meta charset='utf-8'><title>示例站点</title></head>
<body>
  <h1>药物-靶点交互式学习平台（示例 - root 部署）</h1>
  <p>请把静态文件放在仓库根目录以供 Gitee Pages 部署（选择根目录）。</p >
</body>
</html>
"@ | Out-File -FilePath index.html -Encoding UTF8
    git add index.html | Out-Null
  } else {
    Write-Info "检测到根目录 index.html，保留原文件"
  }
}

# 如果没有提交，做一次 commit（首次提交）
$hasHead = $false
try {
  git rev-parse --verify HEAD 2>$null | Out-Null
  $hasHead = $true
} catch { $hasHead = $false }

if (-not $hasHead) {
  Write-Info "执行首次 commit..."
  git add . | Out-Null
  git commit -m "chore: 初始化仓库与示例文件" | Out-Null
} else {
  Write-Info "已有提交，跳过首次 commit"
}

# 添加或更新远程 origin
$existingRemote = git remote | Select-String -Pattern "^origin$" -SimpleMatch
if ($existingRemote) {
  Write-Info "检测到已存在远程 origin，先移除再添加新地址"
  git remote remove origin
}
git remote add origin $Remote
Write-Info "已添加远程 origin -> $Remote"

# 切换 / 创建并切换到主分支
# git branch -M main 等价于：创建并重命名
try {
  git branch -M $Branch 2>$null
  Write-Info "本地分支已设置为: $Branch"
} catch {
  Write-Warn "设置本地分支为 $Branch 时遇到问题，但会继续"
}

# 推送到远程（upstream）
Write-Info "准备推送到远程 origin $Branch"
Write-Info "若提示输入用户名/密码，请使用你的 Gitee 登录信息（或 token 作为密码）"
try {
  git push -u origin $Branch
  Write-Info "推送成功！"
} catch {
  Write-Warn "git push 遇到错误："
  Write-Host $_.Exception.Message
  Write-Warn "如果是认证问题，请检查："
  Write-Host "  - 你是否在终端输入了正确的 Gitee 用户名/密码（HTTPS）；" -ForegroundColor Yellow
  Write-Host "  - 或者你想使用 SSH，请先在本地生成 SSH key 并将公钥添加到 Gitee（设置->SSH公钥），然后将 remote 换成 SSH 地址（git@gitee.com:用户名/仓库.git）" -ForegroundColor Yellow
  Write-Warn "你可以手动执行： git push -u origin $Branch"
}

# 输出后续在 Gitee 开启 Pages 的步骤提示
Write-Host ""
Write-Info "下一步：在 Gitee 网页端启用 Gitee Pages"
Write-Host "1) 登录 https://gitee.com 并进入仓库页面，或直接打开：" -ForegroundColor Cyan
if ($Username -and $RepoName) { Write-Host "   https://gitee.com/$Username/$RepoName" -ForegroundColor Cyan } else { Write-Host "   (打开你的仓库页面)" -ForegroundColor Cyan }
Write-Host "2) 仓库页面 -> 服务 -> Gitee Pages，点击“启动”，选择部署分支： $Branch，部署目录：" -ForegroundColor Cyan
if ($DeployDir -eq "docs") { Write-Host "   /docs" -ForegroundColor Cyan } else { Write-Host "   /（根目录）" -ForegroundColor Cyan }
Write-Host "3) 等待 1-5 分钟，访问分配的 URL（通常为：https://<用户名>.gitee.io/<仓库>/ ）" -ForegroundColor Cyan

Write-Info "脚本执行完毕。若需再次推送更新： git add . ; git commit -m '...' ; git push"