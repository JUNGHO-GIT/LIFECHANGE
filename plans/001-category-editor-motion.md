# 001 — 카테고리 편집기 모션 일관성 교정

- **Status**: DONE
- **Commit**: 272f98a
- **Severity**: HIGH
- **Category**: Easing & duration, Accessibility
- **Estimated scope**: 1 file, CSS 선언 2곳

## Problem

카테고리 행의 제거 모션이 `ease-in`으로 끝나 사용자 입력 직후 느리게 출발함.
`client/src/assets/styles/Extra.css:187`의 현재 코드는 다음과 같음.

```css
/* client/src/assets/styles/Extra.css:187 — current */
.cat-row-out {
  animation: catRowOut 0.2s ease-in forwards;
  pointer-events: none;
}
```

`ease-in`은 UI 종료 모션에서 반응을 지연시키므로 강한 `ease-out`을 써야 함. 같은 파일의 추가 버튼은
포인터 종류를 구분하지 않고 hover 확대를 적용해 터치 탭 뒤 거짓 hover 상태가 남을 수 있음.

```css
/* client/src/assets/styles/Extra.css:281 — current */
.cat-add {
  transition: transform 0.16s ease;
}
.cat-add:hover {
  transform: scale(1.16);
}
```

## Target

행 제거 시간은 현재의 200ms를 유지하되 저장소의 강한 종료 곡선을 사용함. 추가 버튼의 hover 확대는
정밀 포인터가 hover를 지원할 때만 적용함.

```css
/* target */
.cat-row-out {
  animation: catRowOut 0.2s var(--ease-out) forwards;
  pointer-events: none;
}
.cat-add {
  transition: transform 0.16s ease;
}
@media (hover: hover) and (pointer: fine) {
  .cat-add:hover {
    transform: scale(1.16);
  }
}
```

## Repo conventions to follow

- `client/src/assets/styles/Core.css:34`에
  `--ease-out: cubic-bezier(0.23, 1, 0.32, 1);` 토큰이 이미 있음. 새 곡선을 만들지 않음.
- `client/src/assets/styles/Mui.css:286`은 hover 동작을
  `@media (hover: hover) and (pointer: fine)`로 제한함. 동일한 미디어 쿼리 형식을 사용함.
- `client/src/assets/styles/Extra.css:336`의 `prefers-reduced-motion` 블록은 `.cat-row-out`의
  애니메이션과 `.cat-add`의 전환/변형을 이미 제거함. 이 계약을 그대로 유지함.

## Steps

1. `client/src/assets/styles/Extra.css`의 `.cat-row-out`에서 `ease-in`을 `var(--ease-out)`으로 교체함.
2. 같은 파일의 독립된 `.cat-add:hover` 규칙을
   `@media (hover: hover) and (pointer: fine)` 안으로 이동함. `.cat-add`의 160ms `ease` 전환은 유지함.
3. `@media (prefers-reduced-motion: reduce)`의 `.cat-row-out`, `.cat-add`, `.cat-add:hover` 처리는
   삭제하거나 약화하지 않음.

## Boundaries

- `client/src/assets/styles/Extra.css` 이외의 파일을 수정하지 않음.
- 카테고리 마크업, 삭제 상태, 드래그 정렬 로직을 변경하지 않음.
- `catRowOut` 키프레임의 opacity와 transform 값을 변경하지 않음.
- 새 의존성이나 새 모션 토큰을 추가하지 않음.
- 커밋 `272f98a` 이후 코드가 이 계획의 발췌와 다르면 임의로 맞추지 말고 중단 후 보고함.

## Verification

- **Mechanical**: `client`에서 `bun run typecheck`, `bun run lint`, `bun run build`를 실행하고 모두
  종료 코드 0인지 확인함.
- **Feel check**: 데이터가 있는 카테고리 편집 화면을 열고 행 삭제와 추가 버튼 hover를 확인함.
  - 행 제거가 즉시 빠르게 출발하고 200ms 안에 오른쪽으로 사라지는지 확인함.
  - 마우스 hover에서만 추가 버튼이 `scale(1.16)`으로 확대되는지 확인함.
  - 터치 에뮬레이션에서 탭 후 확대 상태가 남지 않는지 확인함.
  - DevTools Animations 패널의 10% 재생 속도에서 제거 모션이 초반에 정지한 듯 보이지 않는지 확인함.
  - `prefers-reduced-motion: reduce`에서 행 제거 이동과 추가 버튼 확대가 모두 사라지는지 확인함.
- **Done when**: 두 CSS 선언이 Target과 일치하고 기계 검증 및 포인터별 feel check가 모두 통과함.
