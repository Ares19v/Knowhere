@echo off
title Knowhere - Run Project

echo =========================================
echo       Starting Knowhere Tracker...
echo =========================================
echo.

echo Starting development server...
start http://localhost:5173
npm run dev

pause
