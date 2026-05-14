@echo off
REM Development server runner with Node v20
REM This script sets up Node v20 in the PATH and runs the development server

setlocal enabledelayedexpansion

REM Add Node v20 to PATH first
set NODE_BIN=c:\Users\admin\node-v20.15.0-win-x64
set PATH=!NODE_BIN!;%PATH%

REM Change to project directory
cd /d "%~dp0"

REM Run npm dev
!NODE_BIN!\npm.cmd run dev

endlocal
pause
