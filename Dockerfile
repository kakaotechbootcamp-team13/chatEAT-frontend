# 1. Base image로 Node.js 사용 (빌드 단계)
FROM node:18 AS build

# 2. 작업 디렉터리 설정
WORKDIR /app

# 3. 패키지 관련 파일들을 복사하고 의존성 설치
COPY package*.json ./
RUN npm install

# 4. 애플리케이션 소스 코드 복사 및 빌드
COPY . .
RUN npm run build

# 5. 최종 이미지를 Nginx로 설정 (프로덕션 단계)
FROM nginx:alpine

# 6. Nginx 설정 파일을 덮어씁니다 (필요한 경우)
# Vite는 단일 페이지 애플리케이션으로 작동하므로, nginx 설정에서 404 페이지를 index.html로 리디렉션하는 설정이 필요할 수 있습니다.
# 기본적으로 Nginx는 이 설정이 포함되지 않으므로, 필요하다면 nginx.conf를 아래 경로로 복사합니다.
# COPY ./nginx.conf /etc/nginx/nginx.conf

# 7. 빌드된 파일들을 Nginx 기본 제공 경로로 복사
COPY --from=build /app/dist /usr/share/nginx/html

# 8. Nginx를 실행
CMD ["nginx", "-g", "daemon off;"]

