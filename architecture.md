# LIFECHANGE Architecture

## 목적
기록형 기능을 서버 API와 웹 클라이언트로 나누어 관리한다.

## 구성
- `src/routers/`: 기능별 요청 진입점
- `src/services/`: 기능 로직
- `src/repositories/`: 데이터 접근
- `src/middlewares/`: 공통 처리 계층
- `client/src/`: 화면, 상태, 공통 UI

## 흐름
1. 클라이언트가 사용자 입력을 수집한다.
2. 서버 라우터와 미들웨어가 요청을 정리한다.
3. 서비스와 저장 계층이 데이터를 처리한다.

## 경계
- 실제 사용자 데이터 구조, 인증 토큰, 외부 연동 정보는 문서화하지 않는다.
