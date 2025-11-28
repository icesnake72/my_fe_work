@echo off
REM 프로젝트 의존성 설치 스크립트 (Windows)
REM 이 스크립트는 프로젝트에 필요한 모든 의존성을 설치합니다.

echo.
echo ========================================
echo 프로젝트 의존성 설치를 시작합니다...
echo ========================================
echo.

REM Node.js 설치 확인
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [오류] Node.js가 설치되어 있지 않습니다.
    echo Node.js 18 이상을 설치해주세요: https://nodejs.org/
    pause
    exit /b 1
)

echo [확인] Node.js 버전:
node -v
echo [확인] npm 버전:
npm -v
echo.

REM 기존 node_modules 확인
if exist "node_modules" (
    set /p DELETE_NODE_MODULES="기존 node_modules를 삭제하고 재설치하시겠습니까? (Y/N): "
    if /i "%DELETE_NODE_MODULES%"=="Y" (
        echo [삭제] 기존 node_modules 삭제 중...
        rmdir /s /q node_modules
    )
)

REM package-lock.json 확인
if exist "package-lock.json" (
    set /p DELETE_LOCK="package-lock.json을 삭제하고 재생성하시겠습니까? (Y/N): "
    if /i "%DELETE_LOCK%"=="Y" (
        echo [삭제] package-lock.json 삭제 중...
        del /f /q package-lock.json
    )
)

echo.
echo [설치] 의존성 설치 중...
echo.

npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo 의존성 설치가 완료되었습니다!
    echo ========================================
    echo.
    echo 다음 명령어로 개발 서버를 실행할 수 있습니다:
    echo   npm run dev
    echo.
) else (
    echo.
    echo [오류] 의존성 설치 중 오류가 발생했습니다.
    echo 다음 명령어로 문제를 해결해보세요:
    echo   npm cache clean --force
    echo   rmdir /s /q node_modules
    echo   del /f /q package-lock.json
    echo   npm install
    echo.
    pause
    exit /b 1
)

pause

