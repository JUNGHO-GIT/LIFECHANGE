/**
 * @file Icons.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

import { React, memo, type JSX } from "@exportReacts";
import { IconButton } from "@exportMuis";

// 다색 자원(내부 <style> 포함): <img> 로 렌더 — 인라인 시 클래스 전역 누수되므로 그대로 이미지 로드 ------------
const assetIconSrcs: Record<string, string> = {
  calendar1: new URL(`../../assets/svg/calendar1.svg`, import.meta.url).href,
  calendar3: new URL(`../../assets/svg/calendar3.svg`, import.meta.url).href,
  common1: new URL(`../../assets/svg/common1.svg`, import.meta.url).href,
  common2: new URL(`../../assets/svg/common2.svg`, import.meta.url).href,
  empty: new URL(`../../assets/svg/empty.svg`, import.meta.url).href,
  exercise1: new URL(`../../assets/svg/exercise1.svg`, import.meta.url).href,
  exercise2: new URL(`../../assets/svg/exercise2.svg`, import.meta.url).href,
  exercise3_1: new URL(`../../assets/svg/exercise3_1.svg`, import.meta.url).href,
  exercise3_2: new URL(`../../assets/svg/exercise3_2.svg`, import.meta.url).href,
  exercise3_3: new URL(`../../assets/svg/exercise3_3.svg`, import.meta.url).href,
  exercise4: new URL(`../../assets/svg/exercise4.svg`, import.meta.url).href,
  flag1: new URL(`../../assets/svg/flag1.svg`, import.meta.url).href,
  flag2: new URL(`../../assets/svg/flag2.svg`, import.meta.url).href,
  money1: new URL(`../../assets/svg/money1.svg`, import.meta.url).href,
  sleep1: new URL(`../../assets/svg/sleep1.svg`, import.meta.url).href,
  sleep2: new URL(`../../assets/svg/sleep2.svg`, import.meta.url).href,
  sleep3: new URL(`../../assets/svg/sleep3.svg`, import.meta.url).href,
  sleep4: new URL(`../../assets/svg/sleep4.svg`, import.meta.url).href,
  user1: new URL(`../../assets/svg/user1.svg`, import.meta.url).href,
};

// 분리된 단색/일러스트 svg 원본: ?raw 로 1회 로드 후 인라인 주입 → CSS color/currentColor/hover/크기 유지 -------
const svgRawModules: Record<string, string> = import.meta.glob(`../../assets/svg/*.svg`, {
  query: `?raw`,
  import: `default`,
  eager: true,
});
const svgRawByName: Record<string, string> = {};
for (const rawPath in svgRawModules) {
  const fileName: string = (rawPath.split(`/`).pop()?.replace(`.svg`, ``) ?? ``).toLowerCase();
  svgRawByName[fileName] = svgRawModules[rawPath] ?? ``;
}

// 정적 aria-label 맵: 렌더마다 재생성 방지 위해 모듈 스코프로 이동 --------------------------------------------
const ariaLabels: Record<string, string> = {
  X: `close`,
  Minus: `decrease`,
  Plus: `add`,
  ChevronDown: `expand`,
  ChevronUp: `collapse`,
  ChevronRight: `next`,
  calendar1: `calendar`,
  calendar3: `memo`,
  common1: `date picker`,
  common2: `add item`,
  empty: `empty image`,
  exercise1: `exercise`,
  exercise2: `exercise goal`,
  exercise3_1: `exercise weight`,
  exercise3_2: `exercise set`,
  exercise3_3: `kettlebell weight`,
  exercise4: `cardio time`,
  flag1: `Korean`,
  flag2: `English`,
  money1: `property`,
  sleep1: `sleep`,
  sleep2: `bedtime`,
  sleep3: `wake up time`,
  sleep4: `sleep time`,
  user1: `Google account`,
  ChevronLeft: `previous`,
  CaretLeft: `previous`,
  CaretRight: `next`,
  CaretUp: `collapse`,
  Exclamation: `warning`,
  ArrowLeft: `back`,
  ArrowRight: `forward`,
  Settings: `settings`,
  Search: `search`,
  Check: `check`,
  Pencil: `edit`,
  Trash: `delete`,
  CheckBox: `checkbox checked`,
  CheckCircle: `check`,
  CheckSquare: `checkbox checked`,
  UnCheckSquare: `checkbox unchecked`,
  Hamburger: `menu`,
  Phone: `phone`,
  Mail: `mail`,
  Copyright: `copyright`,
  Location: `location`,
  Info: `information`,
  List: `list`,
  Calendar: `calendar`,
  Person: `person`,
  Won: `won`,
  Dot: `dot`,
  Lock: `lock`,
  UnLock: `unlock`,
  Undo: `undo`,
  star_on: `star`,
  star_off: `star`,
  CirclePlus: `add`,
  exercise5: `scale`,
  exercise6: `scale summary`,
  food1: `kcal`,
  food2: `kcal`,
  food3: `carbohydrate`,
  food4: `protein`,
  food5: `fat`,
  food6: `nutrition summary`,
  money2: `money`,
  money4: `property summary`,
  smile1: `worried face`,
  smile2: `worried face`,
  smile3: `neutral face`,
  smile4: `smiling face`,
  smile5: `calm smiling face`,
};

// -------------------------------------------------------------------------------------------------
export const Icons = memo((props: any) => {

  if (!props.name) {
    return null;
  }
  const iconClassName: string = [ `app-icon`, props?.className ?? `` ].filter(Boolean).join(` `);

  // 요청된 아이콘만 생성: 다색 자원(img) 먼저 확인, 없으면 분리 svg 원본을 인라인 주입
  let IconComponent: JSX.Element | null = null;
  if (assetIconSrcs[props.name]) {
    IconComponent = (
      <img
        src={assetIconSrcs[props.name]}
        alt={String(props.name)}
        className={iconClassName}
        draggable={false}
      />
    );
  }
  else if (svgRawByName[String(props.name).toLowerCase()]) {
    // className 을 <svg> 에 직접 부여 → 크기 클래스와 색 클래스(currentColor)가 그대로 적용됨; 파일명은 소문자라 이름 정규화
    const svgHtml: string = svgRawByName[String(props.name).toLowerCase()].replace(`<svg `, `<svg class="${iconClassName}" `);
    IconComponent = (
      <span style={{ display: `contents` }} dangerouslySetInnerHTML={{ __html: svgHtml }} />
    );
  }
  const iconAriaLabel: string = ariaLabels[props.name] ?? String(props.name);
  const isIconButton: boolean = props?.isIconButton !== false;
  const iconButtonProps: Record<string, any> = { ...props };
  delete iconButtonProps.isIconButton;
  if (!isIconButton) {
    return IconComponent;
  }

  // ----------------------------------------------------------------------------------------------
  return (
    <IconButton
      aria-label={iconAriaLabel}
      {...iconButtonProps}
      component={`div`}
      className={``}
      onClick={(e: React.MouseEvent) => {
        // 1. locked 인 경우
        if (props?.locked === `locked`) {
          const target: any = e.currentTarget;
          target.classList.add(`shake`);
          setTimeout(() => {
            target.classList.remove(`shake`);
          }, 700);
        }
        // 2. locked 아닌 경우
        else {
          props?.onClick?.(e);
        }
      }}
    >
      {IconComponent}
    </IconButton>
  );
});

Icons.displayName = `Icons`;
