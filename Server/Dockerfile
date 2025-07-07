# Node 20 LTS 이미지 사용
FROM node:20

# 작업 디렉토리 생성
WORKDIR /app

# package.json, package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install --production=false

# 소스 코드 복사
COPY . .

# 빌드 (NestJS/TypeScript)
RUN npm run build

# 3000 포트 오픈
EXPOSE 3000

# 앱 실행 (프로덕션)
CMD ["npm", "run", "start:prod"]
