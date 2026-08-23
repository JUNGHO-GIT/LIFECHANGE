/**
 * @file CategoryEdit.tsx
 * @description foo
 * @author Jungho
 * @since 2026-08-18
 */

import { Btn, Div, Icons } from "@exportComponents";
import { Input } from "@interfaces/containers/Input";
import { React, memo, useCallback, useEffect, useMemo, useRef, useState } from "@exportReacts";
import { useStoreAlert, useStoreLanguage } from "@exportStores";
import type {
  CategoryEditGroup,
  CategoryEditRemove,
  CategoryEditRename,
  CategoryEditResult,
} from "@exportTypes";

// 편집 행 계약: uid로 이름 변경/삭제/정렬을 원본(origin)과 대조 ------------------------------
declare interface CategoryRow {
  uid: string;
  name: string;
  origin: string;
}
// 길게 누르기 대기 상태(아직 드래그 아님) ----------------------------------------------------
declare interface PressCtx {
  uid: string;
  index: number;
  part: string;
  pointerId: number;
  element: HTMLDivElement;
  x: number;
  y: number;
}
// 드래그 진행 컨텍스트: 좌표 계산은 목록 스크롤 기준(content 좌표)으로 고정 -------------------
declare interface DragCtx {
  uid: string;
  part: string;
  pointerId: number;
  element: HTMLDivElement;
  from: number;
  to: number;
  step: number;
  startY: number;
  startScroll: number;
  clientY: number;
  rects: { top: number; height: number }[];
  lastTo: number;
  lastDy: number;
}
declare interface DragState {
  uid: string;
  from: number;
  to: number;
  dy: number;
  step: number;
}
declare interface SettleState {
  uid: string;
  dy: number;
}
declare interface CategoryEditProps {
  groups: CategoryEditGroup[];
  activePart?: string;
  limit?: number;
  onClose: () => void;
  onSave: (_result: CategoryEditResult) => void;
}

// animation/transition 이벤트 유실 시 상태 고착 방지 --------------------------
const REMOVE_FALLBACK_MS: number = 500;
const SETTLE_FALLBACK_MS: number = 600;
const NAME_MAX: number = 20;
const LIST_GAP: number = 8;
// 스마트폰 기준 길게 누르기 임계값과 스크롤 판정 허용 이동량 ----------------------------------
const PRESS_MS: number = 320;
const MOVE_TOL: number = 8;
const EDGE_PX: number = 28;
const EDGE_STEP: number = 8;

// 지원 기기에서만 짧은 햅틱 -------------------------------------------------------------------
const haptic = (duration: number): void => {
  const nav: Navigator & {
    vibrate?: (_pattern: number | number[]) => boolean;
  } = navigator;
  nav.vibrate?.(duration);
};

// 목록 밖으로 끌어내릴 때 진행적 저항: 딱 멈추는 하드 스톱 대신 고무줄 반응 ------------
const rubberband = (overshoot: number, dimension: number): number => {
  const constant: number = 0.55;
  const span: number = dimension > 0 ? dimension : 1;
  return (overshoot * span * constant) / (span + constant * Math.abs(overshoot));
};

// -------------------------------------------------------------------------------------------------
export const CategoryEdit = memo((
  {
    groups, activePart, limit, onClose, onSave,
  }: CategoryEditProps,
) => {

  // 1. common ----------------------------------------------------------------------------------
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const maxCount: number = limit ?? 20;

  // 2-2. useState -------------------------------------------------------------------------------
  const [ ROWS, setROWS ] = useState<Record<string, CategoryRow[]>>(() => {
    const initial: Record<string, CategoryRow[]> = {};
    groups.forEach((group: CategoryEditGroup) => {
      initial[group.part] = group.titles.map((title: string, idx: number) => ({
        uid: `${group.part}-${idx}`,
        name: title,
        origin: title,
      }));
    });
    return initial;
  });
  const [ PART, setPART ] = useState<string>(() => (
    groups.some((group: CategoryEditGroup) => group.part === activePart)
      ? (activePart ?? ``)
      : (groups[0]?.part ?? ``)
  ));
  const [ EDITING, setEDITING ] = useState<string>(``);
  const [ DRAFT, setDRAFT ] = useState<string>(``);
  const [ REMOVING, setREMOVING ] = useState<string>(``);
  const [ ENTERING, setENTERING ] = useState<string>(``);
  const [ PRESSING, setPRESSING ] = useState<string>(``);
  const [ SETTLE, setSETTLE ] = useState<SettleState | null>(null);
  const [ DRAG, setDRAG ] = useState<DragState | null>(null);

  // 2-3. useRef --------------------------------------------------------------------------------
  const uidRef: React.RefObject<number> = useRef<number>(0);
  const listRef: React.RefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);
  const pressRef: React.RefObject<PressCtx | null> = useRef<PressCtx | null>(null);
  const dragRef: React.RefObject<DragCtx | null> = useRef<DragCtx | null>(null);
  const frameRef: React.RefObject<number | null> = useRef<number | null>(null);
  const settleFrameRef: React.RefObject<number | null> = useRef<number | null>(null);
  const suppressRef: React.RefObject<boolean> = useRef<boolean>(false);
  const removePartRef: React.RefObject<string> = useRef<string>(``);
  const pressTimerRef: React.RefObject<ReturnType<typeof setTimeout> | null> = useRef<
    ReturnType<typeof setTimeout> | null
  >(null);
  const removeTimerRef: React.RefObject<ReturnType<typeof setTimeout> | null> = useRef<
    ReturnType<typeof setTimeout> | null
  >(null);
  const settleTimerRef: React.RefObject<ReturnType<typeof setTimeout> | null> = useRef<
    ReturnType<typeof setTimeout> | null
  >(null);
  const inputRefs: React.RefObject<Record<string, HTMLInputElement | null>> = useRef<
    Record<string, HTMLInputElement | null>
  >({});

  // 3. rows ------------------------------------------------------------------------------------
  const rows: CategoryRow[] = useMemo(() => (ROWS[PART] ?? []), [ ROWS, PART ]);

  // 4-1. handle: 입력 중인 이름 확정 -------------------------------------------------------------
  const commitDraft = useCallback(() => {
    if (!EDITING) {
      return;
    }
    const nextName: string = DRAFT.trim();
    setROWS((prev) => ({
      ...prev,
      [PART]: (prev[PART] ?? []).map((row: CategoryRow) => {
        if (row.uid !== EDITING) {
          return row;
        }
        // 표시 라벨을 그대로 확정하면 기본 분류의 다국어 키가 사라지므로 원본 유지
        if (nextName === `` || nextName === translate(row.name)) {
          return row;
        }
        return { ...row, name: nextName };
      }),
    }));
    setEDITING(``);
    setDRAFT(``);
  }, [ EDITING, DRAFT, PART, translate ]);

  // 4-2. handle: 대분류 전환 --------------------------------------------------------------------
  const handlePart = useCallback((part: string) => {
    commitDraft();
    setPART(part);
  }, [commitDraft]);

  // 4-3. handle: 소분류 추가 --------------------------------------------------------------------
  const handleAdd = useCallback(() => {
    if (rows.length >= maxCount) {
      setALERT({
        open: true,
        msg: translate(`cantBeAddedMoreItem`),
        severity: `error`,
      });
      return;
    }
    commitDraft();
    uidRef.current = (uidRef.current ?? 0) + 1;
    const uid: string = `new-${uidRef.current}`;
    setROWS((prev) => ({
      ...prev,
      [PART]: [ ...(prev[PART] ?? []), { uid: uid, name: ``, origin: `` } ],
    }));
    setENTERING(uid);
    setDRAFT(``);
    setEDITING(uid);
  }, [ rows.length, maxCount, commitDraft, PART, setALERT, translate ]);

  // 4-4. handle: 이름 변경 시작 -----------------------------------------------------------------
  const handleRename = useCallback((row: CategoryRow) => {
    commitDraft();
    // 사용자가 보고 있는 라벨을 그대로 고치도록 표시값을 초기 입력값으로 사용
    setDRAFT(row.name === `` ? `` : translate(row.name));
    setEDITING(row.uid);
  }, [ commitDraft, translate ]);

  // 4-5. handle: 이름 변경 취소 -----------------------------------------------------------------
  const handleCancel = useCallback(() => {
    setEDITING(``);
    setDRAFT(``);
  }, []);

  // 4-6. handle: 소분류 삭제 --------------------------------------------------------------------
  const finishRemove = useCallback((uid: string) => {
    const part: string = removePartRef.current;
    if (!part) {
      return;
    }
    if (removeTimerRef.current) {
      clearTimeout(removeTimerRef.current);
      removeTimerRef.current = null;
    }
    setROWS((prev) => ({
      ...prev,
      [part]: (prev[part] ?? []).filter((row: CategoryRow) => row.uid !== uid),
    }));
    removePartRef.current = ``;
    setREMOVING(``);
  }, []);
  const handleRemove = useCallback((uid: string) => {
    if (REMOVING) {
      return;
    }
    if (rows.length <= 1) {
      setALERT({
        open: true,
        msg: translate(`cantBeDeletedLastItem`),
        severity: `error`,
      });
      return;
    }
    const part: string = PART;
    setEDITING(``);
    setDRAFT(``);
    removePartRef.current = part;
    setREMOVING(uid);
    removeTimerRef.current = setTimeout(() => {
      finishRemove(uid);
    }, REMOVE_FALLBACK_MS);
  }, [ REMOVING, rows.length, PART, setALERT, translate, finishRemove ]);
  const handleRowAnimationEnd = useCallback((e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) {
      return;
    }
    const uid: string = e.currentTarget.dataset.rowUid ?? ``;
    if (
      (e.animationName === `catRowIn` || e.animationName === `fadeIn`) &&
      ENTERING === uid
    ) {
      setENTERING(``);
    }
    if (
      (e.animationName === `catRowOut` || e.animationName === `catRowFadeOut`) &&
      REMOVING === uid
    ) {
      finishRemove(uid);
    }
  }, [ ENTERING, REMOVING, finishRemove ]);

  // 4-7. handle: 길게 누르기 해제 ----------------------------------------------------------------
  const clearPress = useCallback(() => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    pressRef.current = null;
    setPRESSING(``);
  }, []);

  // 4-8. handle: 드래그 좌표 갱신 ----------------------------------------------------------------
  // 목록이 스크롤되어도 위치 판정이 흔들리지 않도록 content 좌표계로 환산해서 비교
  const updateDrag = useCallback(() => {
    const ctx: DragCtx | null = dragRef.current;
    const list: HTMLDivElement | null = listRef.current;
    if (!ctx || !list) {
      return;
    }
    const listRect: DOMRect = list.getBoundingClientRect();
    const contentY: number = ctx.clientY - listRect.top + list.scrollTop;
    const rawDy: number = (ctx.clientY - ctx.startY) + (list.scrollTop - ctx.startScroll);
    let to: number = ctx.rects.length - 1;
    for (let i = 0; i < ctx.rects.length; i++) {
      if (contentY < ctx.rects[i].top + ctx.rects[i].height / 2) {
        to = i;
        break;
      }
    }
    // 첫/마지막 슬롯을 넘어서는 이동은 고무줄 감쇠로 처리해 팝업 밖으로 빠지지 않게 함
    const fromRect = ctx.rects[ctx.from];
    const lastRect = ctx.rects[ctx.rects.length - 1];
    const minDy: number = fromRect ? -fromRect.top : 0;
    const maxDy: number = (fromRect && lastRect)
      ? (lastRect.top + lastRect.height) - (fromRect.top + fromRect.height)
      : 0;
    const dy: number = rawDy < minDy
      ? minDy + rubberband(rawDy - minDy, list.clientHeight)
      : (rawDy > maxDy ? maxDy + rubberband(rawDy - maxDy, list.clientHeight) : rawDy);

    ctx.to = to;
    if (ctx.lastTo === to && ctx.lastDy === dy) {
      return;
    }
    ctx.lastTo = to;
    ctx.lastDy = dy;
    setDRAG({ uid: ctx.uid, from: ctx.from, to: to, dy: dy, step: ctx.step });
  }, []);

  // 4-9. handle: 드래그 프레임 루프 --------------------------------------------------------------
  const runDragFrame = useCallback(() => {
    const ctx: DragCtx | null = dragRef.current;
    const list: HTMLDivElement | null = listRef.current;
    if (!ctx || !list) {
      return;
    }
    const listRect: DOMRect = list.getBoundingClientRect();
    // 화면 끝에 붙잡고 있을 때도 목록이 따라 스크롤되도록 보정
    if (ctx.clientY - listRect.top < EDGE_PX) {
      list.scrollTop -= EDGE_STEP;
    }
    else if (listRect.bottom - ctx.clientY < EDGE_PX) {
      list.scrollTop += EDGE_STEP;
    }
    updateDrag();
    frameRef.current = requestAnimationFrame(runDragFrame);
  }, [updateDrag]);

  // 4-10. handle: 드래그 시작 -------------------------------------------------------------------
  const beginDrag = useCallback(() => {
    const press: PressCtx | null = pressRef.current;
    const list: HTMLDivElement | null = listRef.current;
    if (!press || !list) {
      return;
    }
    const listRect: DOMRect = list.getBoundingClientRect();
    const scroll: number = list.scrollTop;
    const rects: { top: number; height: number }[] = Array.from(
      list.querySelectorAll<HTMLElement>(`.cat-row`),
    ).map((node: HTMLElement) => {
      const rect: DOMRect = node.getBoundingClientRect();
      return { top: rect.top - listRect.top + scroll, height: rect.height };
    });
    // 이웃 행 이동량: 실제 렌더된 행 간격을 그대로 사용
    const step: number = rects.length > 1
      ? (rects[1].top - rects[0].top)
      : ((rects[0]?.height ?? 0) + LIST_GAP);

    dragRef.current = {
      uid: press.uid,
      part: press.part,
      pointerId: press.pointerId,
      element: press.element,
      from: press.index,
      to: press.index,
      step: step,
      startY: press.y,
      startScroll: scroll,
      clientY: press.y,
      rects: rects,
      lastTo: press.index,
      lastDy: 0,
    };
    try {
      press.element.setPointerCapture(press.pointerId);
    }
    catch {
      // 이미 해제된 포인터는 전역 추적으로 계속 처리
    }
    // 드래그 종료 직후 발생하는 click이 이름 변경으로 이어지지 않도록 차단
    suppressRef.current = true;
    haptic(12);
    setPRESSING(``);
    setEDITING(``);
    setDRAFT(``);
    setDRAG({ uid: press.uid, from: press.index, to: press.index, dy: 0, step: step });
    frameRef.current = requestAnimationFrame(runDragFrame);
  }, [runDragFrame]);

  // 4-11. handle: 드래그 확정 -------------------------------------------------------------------
  const finishSettle = useCallback(() => {
    if (settleTimerRef.current) {
      clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
    setSETTLE(null);
  }, []);
  const handleRowTransitionEnd = useCallback((e: React.TransitionEvent<HTMLDivElement>) => {
    if (
      e.target !== e.currentTarget ||
      e.propertyName !== `transform` ||
      SETTLE?.uid !== (e.currentTarget.dataset.rowUid ?? ``)
    ) {
      return;
    }
    finishSettle();
  }, [ SETTLE, finishSettle ]);
  const commitDrag = useCallback(() => {
    const ctx: DragCtx | null = dragRef.current;
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    dragRef.current = null;
    setDRAG(null);
    if (ctx?.element.hasPointerCapture(ctx.pointerId)) {
      ctx.element.releasePointerCapture(ctx.pointerId);
    }
    if (!ctx || ctx.from === ctx.to) {
      return;
    }
    setROWS((prev) => {
      const current: CategoryRow[] = [ ...(prev[ctx.part] ?? []) ];
      const [moved] = current.splice(ctx.from, 1);
      current.splice(ctx.to, 0, moved);
      return { ...prev, [ctx.part]: current };
    });
    haptic(8);
    // 손을 뗀 화면 위치에서 새 슬롯으로 이어지도록 잔여 오프셋부터 정착시킨다
    const residual: number = ctx.lastDy - (ctx.to - ctx.from) * ctx.step;
    setSETTLE({ uid: ctx.uid, dy: residual });
    settleFrameRef.current = requestAnimationFrame(() => {
      settleFrameRef.current = requestAnimationFrame(() => {
        setSETTLE({ uid: ctx.uid, dy: 0 });
        settleTimerRef.current = setTimeout(() => {
          finishSettle();
        }, SETTLE_FALLBACK_MS);
      });
    });
  }, [finishSettle]);

  // 4-12. handle: 길게 누르기 시작 ---------------------------------------------------------------
  const handlePressStart = useCallback((
    e: React.PointerEvent<HTMLDivElement>, row: CategoryRow, index: number,
  ) => {
    if (dragRef.current || pressRef.current) {
      return;
    }
    suppressRef.current = false;
    const target: HTMLElement | null = e.target as HTMLElement | null;
    // 수정/삭제 버튼은 정렬 제스처 대상이 아님
    if (target?.closest?.(`.cat-row-act`)) {
      return;
    }
    if (REMOVING || EDITING === row.uid || rows.length <= 1) {
      return;
    }
    clearPress();
    pressRef.current = {
      uid: row.uid,
      index: index,
      part: PART,
      pointerId: e.pointerId,
      element: e.currentTarget,
      x: e.clientX,
      y: e.clientY,
    };
    // 누른 직후 반응을 줘서 "길게 누를 수 있다"는 것을 알린다
    setPRESSING(row.uid);
    pressTimerRef.current = setTimeout(() => {
      beginDrag();
    }, PRESS_MS);
  }, [ REMOVING, EDITING, rows.length, PART, clearPress, beginDrag ]);

  // 2-3. useEffect ------------------------------------------------------------------------------
  useEffect(() => {
    return () => {
      pressTimerRef.current && clearTimeout(pressTimerRef.current);
      removeTimerRef.current && clearTimeout(removeTimerRef.current);
      settleTimerRef.current && clearTimeout(settleTimerRef.current);
      frameRef.current !== null && cancelAnimationFrame(frameRef.current);
      settleFrameRef.current !== null && cancelAnimationFrame(settleFrameRef.current);
    };
  }, []);

  // 2-3. useEffect -----------------------------------------------------------------------------
  // 이름 변경 진입 시 다음 프레임에 커서 이동: 행 등장 애니메이션 중 focus 유실 방지
  useEffect(() => {
    if (!EDITING) {
      return;
    }
    const frame: number = requestAnimationFrame(() => {
      inputRefs.current[EDITING]?.focus();
    });
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [EDITING]);

  // 2-3. useEffect -----------------------------------------------------------------------------
  // 드래그 중 이동/종료는 창 단위로 추적: 손가락이 행 밖으로 나가도 제스처가 끊기지 않음
  useEffect(() => {
    const handleMove = (e: PointerEvent): void => {
      if (dragRef.current) {
        if (e.pointerId !== dragRef.current.pointerId) {
          return;
        }
        dragRef.current.clientY = e.clientY;
        return;
      }
      const press: PressCtx | null = pressRef.current;
      if (!press) {
        return;
      }
      if (e.pointerId !== press.pointerId) {
        return;
      }
      // 임계값 이전 이동은 목록 스크롤 의도로 보고 길게 누르기를 취소
      if (
        Math.abs(e.clientX - press.x) > MOVE_TOL ||
        Math.abs(e.clientY - press.y) > MOVE_TOL
      ) {
        clearPress();
      }
    };
    const handleUp = (e: PointerEvent): void => {
      const pointerId: number | undefined = (
        dragRef.current?.pointerId ?? pressRef.current?.pointerId
      );
      if (pointerId !== undefined && e.pointerId !== pointerId) {
        return;
      }
      clearPress();
      dragRef.current && commitDrag();
    };

    window.addEventListener(`pointermove`, handleMove);
    window.addEventListener(`pointerup`, handleUp);
    window.addEventListener(`pointercancel`, handleUp);
    return () => {
      window.removeEventListener(`pointermove`, handleMove);
      window.removeEventListener(`pointerup`, handleUp);
      window.removeEventListener(`pointercancel`, handleUp);
    };
  }, [ clearPress, commitDrag ]);

  // 2-3. useEffect -----------------------------------------------------------------------------
  // 드래그 중 목록 스크롤 차단: React 합성 touchmove는 passive라 네이티브로 직접 등록
  useEffect(() => {
    const list: HTMLDivElement | null = listRef.current;
    if (!list) {
      return;
    }
    const handleTouchMove = (e: TouchEvent): void => {
      if (dragRef.current) {
        e.preventDefault();
      }
    };
    list.addEventListener(`touchmove`, handleTouchMove, { passive: false });
    return () => {
      list.removeEventListener(`touchmove`, handleTouchMove);
    };
  }, [PART]);

  // 4-13. handle: 저장 전 검증 및 변경 내역 산출 --------------------------------------------------
  const handleSave = useCallback(() => {
    const draftName: string = DRAFT.trim();
    const nextGroups: CategoryEditGroup[] = [];
    const renames: CategoryEditRename[] = [];
    const removes: CategoryEditRemove[] = [];
    // 검증 실패 시 해당 행으로 이동시키기 위한 공통 처리
    const reject = (part: string, uid: string, msg: string): void => {
      setPART(part);
      setDRAFT(``);
      setEDITING(uid);
      setALERT({
        open: true,
        msg: translate(msg),
        severity: `error`,
      });
    };

    for (const group of groups) {
      const groupRows: CategoryRow[] = (ROWS[group.part] ?? []).filter((row: CategoryRow) => (
        row.uid !== REMOVING
      ));
      const used: Set<string> = new Set<string>();
      const titles: string[] = [];

      for (const row of groupRows) {
        // 입력 중인 행은 확정 전 값도 저장 대상에 포함
        const editing: boolean = row.uid === EDITING;
        const resolved: string = (
          editing && draftName !== `` && draftName !== translate(row.name)
            ? draftName
            : row.name
        );
        const name: string = resolved.trim();
        if (name === ``) {
          reject(group.part, row.uid, `errorCategoryTitle`);
          return;
        }
        // `all`은 목록 필터 전용 예약값이므로 사용자 분류명으로 쓸 수 없음
        if (name === `all` || used.has(name)) {
          reject(group.part, row.uid, `duplicatedCategory`);
          return;
        }
        used.add(name);
        titles.push(name);
        if (row.origin !== `` && row.origin !== name) {
          renames.push({ part: group.part, from: row.origin, to: name });
        }
      }

      group.titles.forEach((title: string) => {
        const alive: boolean = groupRows.some((row: CategoryRow) => row.origin === title);
        if (!alive) {
          removes.push({ part: group.part, title: title });
        }
      });
      nextGroups.push({ part: group.part, titles: titles });
    }
    onSave({ groups: nextGroups, renames: renames, removes: removes });
  }, [ groups, ROWS, EDITING, DRAFT, REMOVING, translate, setALERT, onSave ]);

  // 5. drag view -------------------------------------------------------------------------------
  // 드래그 중에는 확정 전 위치를 기준으로 순서번호와 이웃 행 이동량을 계산
  const rowNumber = (index: number): number => {
    if (!DRAG) {
      return index + 1;
    }
    const { from, to } = DRAG;
    if (index === from) {
      return to + 1;
    }
    if (from < to && index > from && index <= to) {
      return index;
    }
    if (to < from && index >= to && index < from) {
      return index + 2;
    }
    return index + 1;
  };
  const rowShift = (index: number): number => {
    if (!DRAG || DRAG.from === DRAG.to || index === DRAG.from) {
      return 0;
    }
    const { from, to, step } = DRAG;
    if (from < to && index > from && index <= to) {
      return -step;
    }
    if (to < from && index >= to && index < from) {
      return step;
    }
    return 0;
  };

  // 7. categoryEdit ----------------------------------------------------------------------------
  const categoryEditNode = () => {
    // 7-1. head
    const headSection = () => (
      <Div className={`cat-head`}>
        <Div className={`fs-0-95rem fw-600 dark`}>
          {translate(`category`)}
        </Div>
        <Div className={`cat-count fs-0-7rem ml-8px`}>
          {`${rows.length} / ${maxCount}`}
        </Div>
        <Div className={`ml-auto d-row-right`}>
          <Icons
            key={`X`}
            name={`X`}
            isIconButton={true}
            className={`w-16px h-16px`}
            onClick={onClose}
          />
        </Div>
      </Div>
    );
    // 7-2. tabs
    const tabsSection = () => (
      <Div className={`cat-tabs`}>
        {groups.map((group: CategoryEditGroup) => (
          <Btn
            key={group.part}
            className={PART === group.part ? `cat-tab cat-tab-on` : `cat-tab`}
            variant={PART === group.part ? `contained` : `outlined`}
            onClick={() => {
              handlePart(group.part);
            }}
          >
            <Div className={`fs-0-8rem`}>
              {translate(group.part)}
            </Div>
          </Btn>
        ))}
      </Div>
    );
    // 7-3. list
    const listSection = () => (
      <Div
        key={PART}
        ref={listRef}
        className={DRAG ? `cat-list cat-dragging` : `cat-list`}
      >
        {rows.length === 0 && (
          <Div className={`cat-empty fs-0-8rem`}>
            {translate(`empty`)}
          </Div>
        )}
        {rows.map((row: CategoryRow, idx: number) => {
          const editing: boolean = EDITING === row.uid;
          const removing: boolean = REMOVING === row.uid;
          const dragging: boolean = DRAG?.uid === row.uid;
          const settling: boolean = SETTLE?.uid === row.uid;
          const shift: number = rowShift(idx);
          const rowClass: string = [
            `cat-row`,
            row.origin === `` ? `cat-row-new` : ``,
            ENTERING === row.uid ? `cat-row-enter` : ``,
            editing ? `cat-row-edit` : ``,
            removing ? `cat-row-out` : ``,
            PRESSING === row.uid ? `cat-row-press` : ``,
            dragging ? `cat-row-drag` : ``,
            !dragging && DRAG ? `cat-row-shift` : ``,
            settling ? `cat-row-settle` : ``,
          ].filter(Boolean).join(` `);
          const rowTransform: string | undefined = (
            dragging ? `translateY(${DRAG?.dy ?? 0}px)`
              : settling ? `translateY(${SETTLE?.dy ?? 0}px)`
                : (shift !== 0 ? `translateY(${shift}px)` : undefined)
          );

          return (
            <Div
              key={row.uid}
              className={rowClass}
              data-row-uid={row.uid}
              style={{ transform: rowTransform }}
              onAnimationEnd={handleRowAnimationEnd}
              onPointerDown={(e: React.PointerEvent<HTMLDivElement>) => {
                handlePressStart(e, row, idx);
              }}
              onTransitionEnd={handleRowTransitionEnd}
            >
              <Div className={`cat-row-no`}>
                {rowNumber(idx)}
              </Div>
              <Div className={`cat-row-name`}>
                <Input
                  variant={`standard`}
                  value={editing ? DRAFT : translate(row.name)}
                  readOnly={!editing}
                  inputclass={`fs-0-85rem`}
                  placeholder={translate(`title`)}
                  slotProps={{
                    htmlInput: {
                      maxLength: NAME_MAX,
                    },
                  }}
                  inputRef={(element: HTMLInputElement | null) => {
                    inputRefs.current[row.uid] = element;
                  }}
                  onClick={() => {
                    // 길게 눌러 정렬한 직후의 click은 이름 변경으로 보지 않음
                    if (suppressRef.current) {
                      suppressRef.current = false;
                      return;
                    }
                    !editing && handleRename(row);
                  }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setDRAFT(String(e.target.value ?? ``));
                  }}
                  onBlur={commitDraft}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === `Enter`) {
                      e.preventDefault();
                      commitDraft();
                    }
                    // 팝업 전체가 닫히지 않도록 이름 변경 취소로만 소비
                    else if (e.key === `Escape`) {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCancel();
                    }
                  }}
                />
              </Div>
              <Div className={`cat-row-act`}>
                <Icons
                  key={editing ? `Check` : `Pencil`}
                  name={editing ? `Check` : `Pencil`}
                  isIconButton={true}
                  className={`w-12px h-12px navy`}
                  onClick={() => {
                    editing ? commitDraft() : handleRename(row);
                  }}
                />
                <Icons
                  key={`Trash`}
                  name={`Trash`}
                  isIconButton={true}
                  className={`w-12px h-12px burgundy`}
                  onClick={() => {
                    handleRemove(row.uid);
                  }}
                />
              </Div>
            </Div>
          );
        })}
      </Div>
    );
    // 7-4. foot
    const footSection = () => (
      <>
        <Div className={`cat-hint fs-0-7rem`}>
          {translate(`reorderHint`)}
        </Div>
        <Div className={`cat-foot`}>
          <Icons
            key={`Plus`}
            name={`Plus`}
            isIconButton={true}
            className={`w-14px h-14px cat-add`}
            onClick={handleAdd}
          />
          <Btn
            className={`cat-btn ml-auto`}
            variant={`outlined`}
            onClick={onClose}
          >
            <Div className={`fs-0-8rem`}>
              {translate(`close`)}
            </Div>
          </Btn>
          <Btn
            className={`cat-btn`}
            variant={`contained`}
            onClick={handleSave}
          >
            <Div className={`fs-0-8rem`}>
              {translate(`save`)}
            </Div>
          </Btn>
        </Div>
      </>
    );
    // 7-10. return
    return (
      <Div className={`cat-panel`}>
        {headSection()}
        {tabsSection()}
        {listSection()}
        {footSection()}
      </Div>
    );
  };

  // 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {categoryEditNode()}
    </>
  );
});
