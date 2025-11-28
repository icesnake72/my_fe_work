#!/bin/bash

# 프로젝트 의존성 설치 스크립트
# 이 스크립트는 프로젝트에 필요한 모든 의존성을 설치합니다.

echo "🚀 프로젝트 의존성 설치를 시작합니다..."

# Node.js 버전 확인
if ! command -v node &> /dev/null; then
    echo "❌ Node.js가 설치되어 있지 않습니다."
    echo "Node.js 18 이상을 설치해주세요: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 버전이 18 미만입니다. 현재 버전: $(node -v)"
    echo "Node.js 18 이상을 설치해주세요."
    exit 1
fi

echo "✅ Node.js 버전 확인 완료: $(node -v)"
echo "✅ npm 버전: $(npm -v)"

# 기존 node_modules가 있으면 삭제 여부 확인
if [ -d "node_modules" ]; then
    read -p "기존 node_modules를 삭제하고 재설치하시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑️  기존 node_modules 삭제 중..."
        rm -rf node_modules
    fi
fi

# package-lock.json이 있으면 삭제 여부 확인
if [ -f "package-lock.json" ]; then
    read -p "package-lock.json을 삭제하고 재생성하시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑️  package-lock.json 삭제 중..."
        rm -f package-lock.json
    fi
fi

echo ""
echo "📦 의존성 설치 중..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 의존성 설치가 완료되었습니다!"
    echo ""
    echo "다음 명령어로 개발 서버를 실행할 수 있습니다:"
    echo "  npm run dev"
    echo ""
else
    echo ""
    echo "❌ 의존성 설치 중 오류가 발생했습니다."
    echo "다음 명령어로 문제를 해결해보세요:"
    echo "  npm cache clean --force"
    echo "  rm -rf node_modules package-lock.json"
    echo "  npm install"
    exit 1
fi

