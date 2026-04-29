@echo off
title Knowhere - Uninstall

echo =========================================
echo       Uninstalling Knowhere...
echo =========================================
echo.

echo Removing node_modules...
if exist "node_modules\" rmdir /s /q node_modules

echo Removing dist directory...
if exist "dist\" rmdir /s /q dist

echo Removing package-lock.json...
if exist "package-lock.json" del /q package-lock.json

echo.
echo =========================================
echo Uninstallation complete! You can run INSTALL.bat to reinstall.
echo =========================================
pause
