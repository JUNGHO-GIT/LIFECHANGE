// Icons.tsx

import { React } from "@imports/ImportReacts";
import { IconButton } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const Icons = (props: any) => {

  if (!props.name) {
    return null;
  }

  const commonValues: { [key: string]: string } = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: props?.fill || "#f5f5f5",
  };

  const icons: { [key: string]: JSX.Element } = {
    X: (
      <svg
        {...commonValues}
        className={
          props.className +
          " black" +
          " icon icon-tabler icons-tabler-outline icon-tabler-x"
        }
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M18 6l-12 12" />
        <path d="M6 6l12 12" />
      </svg>
    ),
    Minus: (
      <svg
        {...commonValues}
        className={
          props.className +
          " black" +
          " icon icon-tabler icons-tabler-outline icon-tabler-minus"
        }
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M5 12l14 0" />
      </svg>
    ),
    Plus: (
      <svg
        {...commonValues}
        className={
          props.className +
          " black" +
          " icon icon-tabler icons-tabler-outline icon-tabler-plus"
        }
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 5l0 14" />
        <path d="M5 12l14 0" />
      </svg>
    ),
    ChevronDown: (
      <svg
        {...commonValues}
        className={
          props.className +
          " black" +
          " icon icon-tabler icons-tabler-outline icon-tabler-chevron-down"
        }
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M6 9l6 6l6 -6" />
      </svg>
    ),
    ChevronUp: (
      <svg
        {...commonValues}
        className={
          props.className +
          " black" +
          " icon icon-tabler icons-tabler-outline icon-tabler-chevron-up"
        }
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M6 15l6 -6l6 6" />
      </svg>
    ),
    ChevronRight: (
      <svg
        {...commonValues}
        className={
          props.className +
          " black" +
          " icon icon-tabler icons-tabler-outline icon-tabler-chevron-right"
        }
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M9 6l6 6l-6 6" />
      </svg>
    ),
    ArrowLeft: (
      <svg
        {...commonValues}
        className={
          props.className +
          " black" +
          " icon icon-tabler icons-tabler-outline icon-tabler-arrow-left"
        }
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M5 12l14 0" />
        <path d="M5 12l6 6" />
        <path d="M5 12l6 -6" />
      </svg>
    ),
    ArrowRight: (
      <svg
        {...commonValues}
        className={
          props.className +
          " black" +
          " icon icon-tabler icons-tabler-outline icon-tabler-arrow-right"
        }
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M5 12l14 0" />
        <path d="M13 18l6 -6" />
        <path d="M13 6l6 6" />
      </svg>
    ),
    Settings: (
      <svg
        {...commonValues}
        className={
          props.className +
          " black" +
          " icon icon-tabler icons-tabler-outline icon-tabler-settings"
        }
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
        <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
      </svg>
    ),
    Search: (
      <svg
        {...commonValues}
        className={
          props.className +
          " black" +
          " icon icon-tabler icons-tabler-outline icon-tabler-search"
        }
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
        <path d="M21 21l-6 -6" />
      </svg>
    ),
    Check: (
      <svg
        {...commonValues}
        className={
          props.className +
          " black" +
          " icon icon-tabler icons-tabler-outline icon-tabler-check"
        }
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M5 12l5 5l10 -10" />
      </svg>
    ),
    Pencil: (
      <svg
        {...commonValues}
        className={
          props.className +
          " black" +
          " icon icon-tabler icons-tabler-outline icon-tabler-pencil"
        }
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
        <path d="M13.5 6.5l4 4" />
      </svg>
    ),
    Trash: (
      <svg
        {...commonValues}
        className={
          props.className +
          " black" +
          " icon icon-tabler icons-tabler-outline icon-tabler-trash"
        }
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 7l16 0" />
        <path d="M10 11l0 6" />
        <path d="M14 11l0 6" />
        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
      </svg>
    ),
    CheckBox: (
      <svg
        {...commonValues}
        className={
          props.className +
          " black" +
          " icon icon-tabler icons-tabler-outline icon-tabler-square-rounded-check"
        }
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M9 12l2 2l4 -4" />
        <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" />
      </svg>
    ),
    Hamburger: (
      <svg
        {...commonValues}
        className={
          props.className +
          " black" +
          " icon icon-tabler icons-tabler-outline icon-tabler-menu-2"
        }
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M4 6l16 0" />
        <path d="M4 12l16 0" />
        <path d="M4 18l16 0" />
      </svg>
    ),
    Call: (
      <svg
        {...commonValues}
        className={
          props.className +
          " black" +
          " icon icon-tabler icons-tabler-filled icon-tabler-phone"
        }
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
      </svg>
    ),
    Mail: (
      <svg
        {...commonValues}
        className={
          props.className +
          " black" +
          " icon icon-tabler icons-tabler-outline icon-tabler-mail"
        }
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M22 7.535v9.465a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-9.465l9.445 6.297l.116 .066a1 1 0 0 0 .878 0l.116 -.066l9.445 -6.297z" />
        <path d="M19 4c1.08 0 2.027 .57 2.555 1.427l-9.555 6.37l-9.555 -6.37a2.999 2.999 0 0 1 2.354 -1.42l.201 -.007h14z" />
      </svg>
    ),
    Copyright: (
      <svg
        {...commonValues}
        className={
          props.className +
          " black" +
          " icon icon-tabler icons-tabler-filled icon-tabler-copyright"
        }
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-2.34 5.659a4.016 4.016 0 0 0 -5.543 .23a3.993 3.993 0 0 0 0 5.542a4.016 4.016 0 0 0 5.543 .23a1 1 0 0 0 -1.32 -1.502c-.81 .711 -2.035 .66 -2.783 -.116a1.993 1.993 0 0 1 0 -2.766a2.016 2.016 0 0 1 2.783 -.116a1 1 0 0 0 1.32 -1.501z" />
      </svg>
    ),
    Location: (
      <svg
        {...commonValues}
        className={
          props.className +
          " black" +
          " icon icon-tabler icons-tabler-filled icon-tabler-location"
        }
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z" />
      </svg>
    ),
    Info: (
      <svg
        {...commonValues}
        className={
          props.className +
          " black" +
          " icon icon-tabler icons-tabler-filled icon-tabler-info-circle"
        }
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm0 9h-1l-.117 .007a1 1 0 0 0 0 1.986l.117 .007v3l.007 .117a1 1 0 0 0 .876 .876l.117 .007h1l.117 -.007a1 1 0 0 0 .876 -.876l.007 -.117l-.007 -.117a1 1 0 0 0 -.764 -.857l-.112 -.02l-.117 -.006v-3l-.007 -.117a1 1 0 0 0 -.876 -.876l-.117 -.007zm.01 -3l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z" />
      </svg>
    ),
    List: (
      <svg
        {...commonValues}
        className={
          props.className +
          " black" +
          " icon icon-tabler icons-tabler-outline icon-tabler-list-check"
        }
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M3.5 5.5l1.5 1.5l2.5 -2.5" />
        <path d="M3.5 11.5l1.5 1.5l2.5 -2.5" />
        <path d="M3.5 17.5l1.5 1.5l2.5 -2.5" />
        <path d="M11 6l9 0" />
        <path d="M11 12l9 0" />
        <path d="M11 18l9 0" />
      </svg>
    ),
    Calendar: (
      <svg
        {...commonValues}
        className={
          props.className +
          " black" +
          " icon icon-tabler icons-tabler-outline icon-tabler-calendar"
        }
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 5m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
        <path d="M16 3l0 4" />
        <path d="M8 3l0 4" />
        <path d="M4 11l16 0" />
        <path d="M8 15h2v2h-2z" />
      </svg>
    ),
    View: (
      <svg
        {...commonValues}
        className={
          props.className +
          " black" +
          " icon icon-tabler icons-tabler-filled icon-tabler-eye"
        }
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 4c4.29 0 7.863 2.429 10.665 7.154l.22 .379l.045 .1l.03 .083l.014 .055l.014 .082l.011 .1v.11l-.014 .111a.992 .992 0 0 1 -.026 .11l-.039 .108l-.036 .075l-.016 .03c-2.764 4.836 -6.3 7.38 -10.555 7.499l-.313 .004c-4.396 0 -8.037 -2.549 -10.868 -7.504a1 1 0 0 1 0 -.992c2.831 -4.955 6.472 -7.504 10.868 -7.504zm0 5a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z" />
      </svg>
    ),
    Person: (
      <svg
        {...commonValues}
        className={
          props.className +
          " black" +
          " icon icon-tabler icons-tabler-filled icon-tabler-user"
        }
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 2a5 5 0 1 1 -5 5l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
        <path d="M14 14a5 5 0 0 1 5 5v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1a5 5 0 0 1 5 -5h4z" />
      </svg>
    ),
    Refresh: (
      <svg
        {...commonValues}
        className={
          props.className +
          " black" +
          " icon icon-tabler icons-tabler-outline icon-tabler-reload"
        }
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
        <path d="M20 4v5h-5" />
      </svg>
    ),
  };

  const IconComponent = icons[props.name] || React.Fragment;

  // ---------------------------------------------------------------------------------------------->
  return (
    <IconButton className={""} onClick={props.onClick}>
      {IconComponent}
    </IconButton>
  );
};
