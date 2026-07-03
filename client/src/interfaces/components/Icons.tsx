/**
 * @file Icons.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

import { React, memo, type JSX } from "@exportReacts";
import { IconButton } from "@exportMuis";

// 정적 svg 자원 경로 맵: 렌더마다 new URL 재생성 방지 위해 모듈 스코프 1회 생성 --------------------------------
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
  Star: `star`,
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
  const commonValues: Record<string, string> = {
    xmlns: `http://www.w3.org/2000/svg`,
    viewBox: `0 0 24 24`,
    stroke: `currentColor`,
    strokeWidth: `2`,
    strokeLinecap: `round`,
    strokeLinejoin: `round`,
    color: props?.color ?? `black`,
    fill: props?.fill ?? `#ffffff`,
    className: props?.className ?? ``,
  };
  const svgIcons: Record<string, () => JSX.Element> = {
    X: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M18 6l-12 12`} />
        <path d={`M6 6l12 12`} />
      </svg>
    ),
    Minus: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M5 12l14 0`} />
      </svg>
    ),
    Plus: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M12 5l0 14`} />
        <path d={`M5 12l14 0`} />
      </svg>
    ),
    ChevronDown: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M6 9l6 6l6 -6`} />
      </svg>
    ),
    ChevronUp: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M6 15l6 -6l6 6`} />
      </svg>
    ),
    ChevronRight: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M9 6l6 6l-6 6`} />
      </svg>
    ),
    ChevronLeft: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M15 6l-6 6l6 6`} />
      </svg>
    ),
    CaretLeft: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M13.883 5.007l.058 -.005h.118l.058 .005l.06 .009l.052 .01l.108 .032l.067 .027l.132 .07l.09 .065l.081 .073l.083 .094l.054 .077l.054 .096l.017 .036l.027 .067l.032 .108l.01 .053l.01 .06l.004 .057l.002 .059v12c0 .852 -.986 1.297 -1.623 .783l-.084 -.076l-6 -6a1 1 0 0 1 -.083 -1.32l.083 -.094l6 -6l.094 -.083l.077 -.054l.096 -.054l.036 -.017l.067 -.027l.108 -.032l.053 -.01l.06 -.01z`} />
      </svg>
    ),
    CaretRight: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M9 6c0 -.852 .986 -1.297 1.623 -.783l.084 .076l6 6a1 1 0 0 1 .083 1.32l-.083 .094l-6 6l-.094 .083l-.077 .054l-.096 .054l-.036 .017l-.067 .027l-.108 .032l-.053 .01l-.06 .01l-.057 .004l-.059 .002l-.059 -.002l-.058 -.005l-.06 -.009l-.052 -.01l-.108 -.032l-.067 -.027l-.132 -.07l-.09 -.065l-.081 -.073l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.10 -.06l-.004 -.057l-.002 -12.059z`} />
      </svg>
    ),
    Exclamation: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M17 3.34a10 10 0 1 1 -15 8.66l.005 -.324a10 10 0 0 1 14.995 -8.336m-5 11.66a1 1 0 0 0 -1 1v.01a1 1 0 0 0 2 0v-.01a1 1 0 0 0 -1 -1m0 -7a1 1 0 0 0 -1 1v4a1 1 0 0 0 2 0v-4a1 1 0 0 0 -1 -1`} />
      </svg>
    ),
    ArrowLeft: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M5 12l14 0`} />
        <path d={`M5 12l6 6`} />
        <path d={`M5 12l6 -6`} />
      </svg>
    ),
    ArrowRight: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M5 12l14 0`} />
        <path d={`M13 18l6 -6`} />
        <path d={`M13 6l6 6`} />
      </svg>
    ),
    Settings: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z`} />
        <path d={`M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0`} />
      </svg>
    ),
    Search: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0`} />
        <path d={`M21 21l-6 -6`} />
      </svg>
    ),
    Check: () => (
      <svg {...commonValues} fill={`none`}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M5 12l5 5l10 -10`} />
      </svg>
    ),
    Pencil: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4`} />
        <path d={`M13.5 6.5l4 4`} />
      </svg>
    ),
    Trash: () => (
      <svg {...commonValues} fill={`none`}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M4 7l16 0`} />
        <path d={`M10 11l0 6`} />
        <path d={`M14 11l0 6`} />
        <path d={`M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12`} />
        <path d={`M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3`} />
      </svg>
    ),
    CheckBox: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M9 12l2 2l4 -4`} />
        <path d={`M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z`} />
      </svg>
    ),
    CheckCircle: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0`} />
        <path d={`M9 12l2 2l4 -4`} />
      </svg>
    ),
    CheckSquare: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z`} />
        <path d={`M7 12l3 3l6 -6`} />
      </svg>
    ),
    UnCheckSquare: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z`} />
      </svg>
    ),
    Hamburger: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M4 6l16 0`} />
        <path d={`M4 12l16 0`} />
        <path d={`M4 18l16 0`} />
      </svg>
    ),
    Phone: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2`} />
      </svg>
    ),
    Mail: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M22 7.535v9.465a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-9.465l9.445 6.297l.116 .066a1 1 0 0 0 .878 0l.116 -.066l9.445 -6.297z`} />
        <path d={`M19 4c1.08 0 2.027 .57 2.555 1.427l-9.555 6.37l-9.555 -6.37a2.999 2.999 0 0 1 2.354 -1.42l.201 -.007h14z`} />
      </svg>
    ),
    Copyright: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-2.34 5.659a4.016 4.016 0 0 0 -5.543 .23a3.993 3.993 0 0 0 0 5.542a4.016 4.016 0 0 0 5.543 .23a1 1 0 0 0 -1.32 -1.502c-.81 .711 -2.035 .66 -2.783 -.116a1.993 1.993 0 0 1 0 -2.766a2.016 2.016 0 0 1 2.783 -.116a1 1 0 0 0 1.32 -1.501z`} />
      </svg>
    ),
    Location: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z`} />
      </svg>
    ),
    Info: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm0 9h-1l-.117 .007a1 1 0 0 0 0 1.986l.117 .007v3l.007 .117a1 1 0 0 0 .876 .876l.117 .007h1l.117 -.007a1 1 0 0 0 .876 -.876l.007 -.117l-.007 -.117a1 1 0 0 0 -.764 -.857l-.112 -.02l-.117 -.006v-3l-.007 -.117a1 1 0 0 0 -.876 -.876l-.117 -.007zm.01 -3l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z`} />
      </svg>
    ),
    List: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M3.5 5.5l1.5 1.5l2.5 -2.5`} />
        <path d={`M3.5 11.5l1.5 1.5l2.5 -2.5`} />
        <path d={`M3.5 17.5l1.5 1.5l2.5 -2.5`} />
        <path d={`M11 6l9 0`} />
        <path d={`M11 12l9 0`} />
        <path d={`M11 18l9 0`} />
      </svg>
    ),
    Calendar: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M4 5m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z`} />
        <path d={`M16 3l0 4`} />
        <path d={`M8 3l0 4`} />
        <path d={`M4 11l16 0`} />
        <path d={`M8 15h2v2h-2z`} />
      </svg>
    ),
    View: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M12 4c4.29 0 7.863 2.429 10.665 7.154l.22 .379l.045 .1l.03 .083l.014 .055l.014 .082l.011 .1v.11l-.014 .111a.992 .992 0 0 1 -.026 .11l-.039 .108l-.036 .075l-.016 .03c-2.764 4.836 -6.3 7.38 -10.555 7.499l-.313 .004c-4.396 0 -8.037 -2.549 -10.868 -7.504a1 1 0 0 1 0 -.992c2.831 -4.955 6.472 -7.504 10.868 -7.504zm0 5a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z`} />
      </svg>
    ),
    Person: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M12 2a5 5 0 1 1 -5 5l.005 -.217a5 5 0 0 1 4.995 -4.783z`} />
        <path d={`M14 14a5 5 0 0 1 5 5v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1a5 5 0 0 1 5 -5h4z`} />
      </svg>
    ),
    Won: () => (
      <svg {...commonValues}>
        <path d={`M6 12L8 19L10 12M6 12L4 5M6 12H3M6 12H10M14 12L16 19L18 12M14 12L12 5L10 12M14 12H10M14 12H18M18 12L20 5M18 12H21`} />
      </svg>
    ),
    Dot: () => (
      <svg {...commonValues}>
        <path d={`M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z`} />
      </svg>
    ),
    Lock: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path
          d={`M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z`}
          fill={`#ffa07a`}
        />
        <path d={`M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0`} />
        <path d={`M8 11v-4a4 4 0 1 1 8 0v4`} />
      </svg>
    ),
    UnLock: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path
          d={`M3 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z`}
          fill={`#ffa07a`}
        />
        <path d={`M9 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0`} />
        <path d={`M13 11v-4a4 4 0 1 1 8 0v4`} />
      </svg>
    ),
    Undo: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M9 14l-4 -4l4 -4`} />
        <path d={`M5 10h11a4 4 0 1 1 0 8h-1`} />
      </svg>
    ),
    CaretUp: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M18 14l-6 -6l-6 6h12`} />
      </svg>
    ),
    Star: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z`} />
      </svg>
    ),
    CirclePlus: () => (
      <svg {...commonValues}>
        <path stroke={`none`} d={`M0 0h24v24H0z`} fill={`none`} />
        <path d={`M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0`} />
        <path d={`M12 8l0 8`} />
        <path d={`M8 12l8 0`} />
      </svg>
    ),
    exercise5: () => (
      <svg {...commonValues} viewBox={`0 0 256 256`} fill={`none`} stroke={`none`}>
        <rect x={`24`} y={`28`} width={`208`} height={`198`} rx={`30`} fill={`#F8FAFC`} stroke={`#111118`} strokeWidth={`10`} />
        <rect x={`88`} y={`56`} width={`80`} height={`45`} rx={`10`} fill={`#DCEBFF`} stroke={`#111118`} strokeWidth={`9`} />
        <path d={`M112 101h32`} stroke={`#111118`} strokeWidth={`9`} strokeLinecap={`round`} />
        <g fill={`#E8E4FF`} stroke={`#111118`} strokeWidth={`9`}>
          <circle cx={`65`} cy={`68`} r={`20`} />
          <circle cx={`191`} cy={`68`} r={`20`} />
          <circle cx={`65`} cy={`186`} r={`20`} />
          <circle cx={`191`} cy={`186`} r={`20`} />
        </g>
      </svg>
    ),
    exercise6: () => (
      <svg {...commonValues} viewBox={`0 0 256 256`} fill={`none`} stroke={`none`}>
        <rect x={`30`} y={`30`} width={`196`} height={`196`} rx={`34`} fill={`#E8E4FF`} stroke={`#111118`} strokeWidth={`10`} />
        <path d={`M65 98Q128 58 191 98L170 150H86z`} fill={`#FFED9B`} stroke={`#111118`} strokeWidth={`10`} strokeLinejoin={`round`} />
        <path d={`M91 101l8 19M128 82v24M165 101l-8 19`} stroke={`#111118`} strokeWidth={`9`} strokeLinecap={`round`} />
        <path d={`M105 150a24 24 0 0 1 46 0`} fill={`#FF5263`} stroke={`#111118`} strokeWidth={`9`} />
        <path d={`M86 176h84`} stroke={`#111118`} strokeWidth={`10`} strokeLinecap={`round`} />
      </svg>
    ),
    food1: () => (
      <svg {...commonValues} viewBox={`0 0 256 256`} fill={`none`} stroke={`none`}>
        <circle cx={`128`} cy={`128`} r={`106`} fill={`#ffffff`} stroke={`#111118`} strokeWidth={`10`} />
        <path d={`M128 22a106 106 0 0 1 91 52l-39 23a61 61 0 0 0 -52 -30z`} fill={`#FFED9B`} stroke={`#111118`} strokeWidth={`10`} strokeLinejoin={`round`} />
        <path d={`M219 74a106 106 0 0 1 15 54h-45a61 61 0 0 0 -9 -31z`} fill={`#FF5263`} stroke={`#111118`} strokeWidth={`10`} strokeLinejoin={`round`} />
        <path d={`M22 128a106 106 0 0 1 45 -87l27 36a61 61 0 0 0 -27 51z`} fill={`#1ECF9F`} stroke={`#111118`} strokeWidth={`10`} strokeLinejoin={`round`} />
        <circle cx={`128`} cy={`128`} r={`56`} fill={`#F8FAFC`} stroke={`#111118`} strokeWidth={`10`} />
        <path d={`M86 143l58 -18`} stroke={`#111118`} strokeWidth={`13`} strokeLinecap={`round`} />
        <circle cx={`128`} cy={`128`} r={`9`} fill={`#111118`} />
      </svg>
    ),
    food2: () => (
      <svg {...commonValues} viewBox={`0 0 256 256`} fill={`none`} stroke={`none`}>
        <circle cx={`128`} cy={`128`} r={`106`} fill={`#ffffff`} stroke={`#111118`} strokeWidth={`10`} />
        <path d={`M128 22a106 106 0 0 1 91 52l-39 23a61 61 0 0 0 -52 -30z`} fill={`#FFED9B`} stroke={`#111118`} strokeWidth={`10`} strokeLinejoin={`round`} />
        <path d={`M219 74a106 106 0 0 1 15 54h-45a61 61 0 0 0 -9 -31z`} fill={`#FF5263`} stroke={`#111118`} strokeWidth={`10`} strokeLinejoin={`round`} />
        <path d={`M22 128a106 106 0 0 1 45 -87l27 36a61 61 0 0 0 -27 51z`} fill={`#1ECF9F`} stroke={`#111118`} strokeWidth={`10`} strokeLinejoin={`round`} />
        <circle cx={`128`} cy={`128`} r={`56`} fill={`#F8FAFC`} stroke={`#111118`} strokeWidth={`10`} />
        <path d={`M86 143l58 -18`} stroke={`#111118`} strokeWidth={`13`} strokeLinecap={`round`} />
        <circle cx={`128`} cy={`128`} r={`9`} fill={`#111118`} />
      </svg>
    ),
    food3: () => (
      <svg {...commonValues} viewBox={`0 0 256 256`} fill={`none`} stroke={`none`}>
        <path d={`M42 128c7 -48 43 -80 86 -80s79 32 86 80z`} fill={`#ffffff`} stroke={`#111118`} strokeWidth={`10`} strokeLinejoin={`round`} />
        <path d={`M32 130h192l-12 57c-6 29 -30 48 -59 48h-50c-29 0 -53 -19 -59 -48z`} fill={`#61C9EC`} stroke={`#111118`} strokeWidth={`10`} strokeLinejoin={`round`} />
        <path d={`M35 130h186`} stroke={`#111118`} strokeWidth={`11`} strokeLinecap={`round`} />
        <g fill={`#111118`}>
          <circle cx={`82`} cy={`96`} r={`6`} />
          <circle cx={`104`} cy={`82`} r={`6`} />
          <circle cx={`173`} cy={`95`} r={`6`} />
        </g>
      </svg>
    ),
    food4: () => (
      <svg {...commonValues} viewBox={`0 0 256 256`} fill={`none`} stroke={`none`}>
        <path d={`M53 67c34 -34 86 -23 123 14c22 22 31 49 22 73c-9 25 -35 46 -70 53c-36 7 -72 -3 -94 -25c-26 -26 -20 -84 19 -115z`} fill={`#FF5263`} stroke={`#111118`} strokeWidth={`10`} strokeLinejoin={`round`} />
        <path d={`M172 84c27 8 47 27 56 54c-7 28 -27 49 -56 61l-36 -43l35 -35z`} fill={`#FF5263`} stroke={`#111118`} strokeWidth={`10`} strokeLinejoin={`round`} />
        <path d={`M191 109c16 10 26 24 31 40c-6 17 -16 29 -30 38`} stroke={`#D12A78`} strokeWidth={`12`} strokeLinecap={`round`} />
        <circle cx={`144`} cy={`153`} r={`19`} fill={`#ffffff`} stroke={`#111118`} strokeWidth={`9`} />
        <path d={`M58 74c27 -24 67 -20 102 8`} stroke={`#FFD8DF`} strokeWidth={`13`} strokeLinecap={`round`} />
      </svg>
    ),
    food5: () => (
      <svg {...commonValues} viewBox={`0 0 256 256`} fill={`none`} stroke={`none`}>
        <path d={`M128 34c39 50 61 89 61 127c0 40 -26 67 -61 67s-61 -27 -61 -67c0 -38 22 -77 61 -127z`} fill={`#FFCC45`} stroke={`#111118`} strokeWidth={`10`} strokeLinejoin={`round`} />
        <path d={`M70 68c21 29 33 52 33 74c0 24 -17 41 -38 41s-38 -17 -38 -41c0 -22 12 -45 33 -74z`} fill={`#FFED9B`} stroke={`#111118`} strokeWidth={`10`} strokeLinejoin={`round`} />
        <path d={`M186 68c21 29 33 52 33 74c0 24 -17 41 -38 41s-38 -17 -38 -41c0 -22 12 -45 33 -74z`} fill={`#FFED9B`} stroke={`#111118`} strokeWidth={`10`} strokeLinejoin={`round`} />
        <path d={`M103 194q25 20 50 0`} stroke={`#FFE37A`} strokeWidth={`12`} strokeLinecap={`round`} />
      </svg>
    ),
    food6: () => (
      <svg {...commonValues} viewBox={`0 0 256 256`} fill={`none`} stroke={`none`}>
        <rect x={`36`} y={`34`} width={`132`} height={`184`} rx={`16`} fill={`#F8FAFC`} stroke={`#111118`} strokeWidth={`10`} />
        <rect x={`70`} y={`24`} width={`64`} height={`32`} rx={`10`} fill={`#E8E4FF`} stroke={`#111118`} strokeWidth={`9`} />
        <path d={`M69 91h20M69 128h20M69 165h20`} stroke={`#1ECF9F`} strokeWidth={`14`} strokeLinecap={`round`} />
        <path d={`M110 91h35M110 128h35M110 165h25`} stroke={`#111118`} strokeWidth={`8`} strokeLinecap={`round`} />
        <path d={`M129 172c5 -22 28 -30 43 -13c17 -10 37 1 41 22c5 30 -15 53 -42 53s-47 -23 -42 -62z`} fill={`#FF5263`} stroke={`#111118`} strokeWidth={`9`} strokeLinejoin={`round`} />
        <path d={`M169 160c10 -13 24 -18 39 -9c-9 13 -23 19 -39 9z`} fill={`#1ECF9F`} stroke={`#111118`} strokeWidth={`7`} strokeLinejoin={`round`} />
      </svg>
    ),
    money2: () => (
      <svg {...commonValues} viewBox={`0 0 256 256`} fill={`none`} stroke={`none`}>
        <rect x={`56`} y={`50`} width={`144`} height={`116`} rx={`18`} fill={`#E8E4FF`} stroke={`#111118`} strokeWidth={`10`} />
        <rect x={`43`} y={`76`} width={`170`} height={`116`} rx={`18`} fill={`#61C9EC`} stroke={`#111118`} strokeWidth={`10`} />
        <rect x={`30`} y={`103`} width={`196`} height={`116`} rx={`18`} fill={`#F8FAFC`} stroke={`#111118`} strokeWidth={`10`} />
        <path d={`M59 143h72M59 174h52`} stroke={`#111118`} strokeWidth={`10`} strokeLinecap={`round`} />
        <circle cx={`177`} cy={`165`} r={`31`} fill={`#FFED9B`} stroke={`#111118`} strokeWidth={`8`} />
        <text x={`177`} y={`176`} textAnchor={`middle`} fontSize={`38`} fontFamily={`Arial, sans-serif`} fontWeight={`900`} fill={`#111118`}>₩</text>
      </svg>
    ),
    money4: () => (
      <svg {...commonValues} viewBox={`0 0 256 256`} fill={`none`} stroke={`none`}>
        <path d={`M82 40l72 82l-85 32l-28 -54z`} fill={`#61C9EC`} stroke={`#111118`} strokeWidth={`10`} strokeLinejoin={`round`} />
        <path d={`M139 60l55 76l-78 37l-36 -58z`} fill={`#FF5263`} stroke={`#111118`} strokeWidth={`10`} strokeLinejoin={`round`} />
        <rect x={`18`} y={`102`} width={`212`} height={`124`} rx={`28`} fill={`#D49A70`} stroke={`#111118`} strokeWidth={`10`} />
        <path d={`M178 145h48a18 18 0 0 1 18 18v30a18 18 0 0 1 -18 18h-48a33 33 0 0 1 0 -66z`} fill={`#E9B08A`} stroke={`#111118`} strokeWidth={`10`} />
        <circle cx={`184`} cy={`178`} r={`8`} fill={`#111118`} />
      </svg>
    ),
    smile1: () => (
      <svg {...commonValues} viewBox={`0 0 256 256`} fill={`none`} stroke={`none`}>
        <circle cx={`128`} cy={`128`} r={`112`} fill={`#FF9AA6`} stroke={`#111118`} strokeWidth={`8`} />
        <g fill={`none`} stroke={`#3B3D46`} strokeWidth={`8`} strokeLinecap={`round`} strokeLinejoin={`round`}>
          <path d={`M62 89L103 76`} />
          <path d={`M146 74L181 89`} />
          <path d={`M92 151Q125 134 157 151`} />
        </g>
        <g fill={`#3B3D46`} stroke={`none`}>
          <circle cx={`82`} cy={`108`} r={`7.2`} />
          <circle cx={`162`} cy={`107`} r={`7.2`} />
        </g>
      </svg>
    ),
    smile2: () => (
      <svg {...commonValues} viewBox={`0 0 256 256`} fill={`none`} stroke={`none`}>
        <circle cx={`128`} cy={`128`} r={`112`} fill={`#FFE08A`} stroke={`#111118`} strokeWidth={`8`} />
        <g fill={`none`} stroke={`#3B3D46`} strokeWidth={`8`} strokeLinecap={`round`} strokeLinejoin={`round`}>
          <path d={`M61 90L98 85`} />
          <path d={`M147 85L184 91`} />
          <path d={`M91 155Q125 136 158 154`} />
        </g>
        <g fill={`#3B3D46`} stroke={`none`}>
          <circle cx={`83`} cy={`108`} r={`7.2`} />
          <circle cx={`163`} cy={`107`} r={`7.2`} />
        </g>
      </svg>
    ),
    smile3: () => (
      <svg {...commonValues} viewBox={`0 0 256 256`} fill={`none`} stroke={`none`}>
        <circle cx={`128`} cy={`128`} r={`112`} fill={`#FFF3B8`} stroke={`#111118`} strokeWidth={`8`} />
        <g fill={`none`} stroke={`#3B3D46`} strokeWidth={`8`} strokeLinecap={`round`}>
          <path d={`M59 87L105 87`} />
          <path d={`M144 86L190 86`} />
          <path d={`M93 155L160 155`} />
        </g>
        <g fill={`#3B3D46`} stroke={`none`}>
          <circle cx={`83`} cy={`108`} r={`7.2`} />
          <circle cx={`163`} cy={`107`} r={`7.2`} />
        </g>
      </svg>
    ),
    smile4: () => (
      <svg {...commonValues} viewBox={`0 0 256 256`} fill={`none`} stroke={`none`}>
        <circle cx={`128`} cy={`128`} r={`112`} fill={`#8FE8D3`} stroke={`#111118`} strokeWidth={`8`} />
        <g fill={`none`} stroke={`#3B3D46`} strokeWidth={`8`} strokeLinecap={`round`} strokeLinejoin={`round`}>
          <path d={`M63 91Q82 82 101 90`} />
          <path d={`M146 90Q165 82 183 91`} />
          <path d={`M91 151Q128 170 165 151`} />
        </g>
        <g fill={`#3B3D46`} stroke={`none`}>
          <circle cx={`84`} cy={`109`} r={`7.2`} />
          <circle cx={`165`} cy={`108`} r={`7.2`} />
        </g>
      </svg>
    ),
    smile5: () => (
      <svg {...commonValues} viewBox={`0 0 256 256`} fill={`none`} stroke={`none`}>
        <circle cx={`128`} cy={`128`} r={`112`} fill={`#A7DCF3`} stroke={`#111118`} strokeWidth={`8`} />
        <g fill={`none`} stroke={`#3B3D46`} strokeWidth={`8`} strokeLinecap={`round`} strokeLinejoin={`round`}>
          <path d={`M62 94Q79 78 98 88`} />
          <path d={`M145 88Q164 78 181 88`} />
          <path d={`M90 149Q124 169 160 149`} />
        </g>
        <g fill={`#3B3D46`} stroke={`none`}>
          <circle cx={`84`} cy={`110`} r={`7.2`} />
          <circle cx={`164`} cy={`109`} r={`7.2`} />
        </g>
      </svg>
    ),
  };

  // 요청된 아이콘만 생성: 자원(img) 먼저 확인, 없으면 svg 팭토리 호출
  let IconComponent: JSX.Element | null = null;
  if (assetIconSrcs[props.name]) {
    IconComponent = (
      <img
        src={assetIconSrcs[props.name]}
        alt={String(props.name)}
        className={props?.className ?? ``}
        draggable={false}
      />
    );
  }
  else if (svgIcons[props.name]) {
    IconComponent = svgIcons[props.name]();
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
