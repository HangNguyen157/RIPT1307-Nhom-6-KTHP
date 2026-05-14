# Development server runner with Node v20
# This script sets up Node v20 in the PATH and runs the development server

param(
    [switch]$Install = $false
)

$nodePath = "c:\Users\admin\node-v20.15.0-win-x64"
$npmPath = Join-Path $nodePath "node_modules\npm\bin\npm-cli.js"
$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Add Node to PATH
$env:PATH = "$nodePath;$env:PATH"

# Change to project directory
Push-Location $projectDir

try {
    if ($Install) {
        Write-Host "Installing dependencies..."
        & $nodePath\node.exe $npmPath install
    }
    
    Write-Host "Starting development server..."
    & $nodePath\node.exe $npmPath run dev
}
finally {
    Pop-Location
}
