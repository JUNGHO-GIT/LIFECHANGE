// substring.js

export const substring = (str, max) => {

  // 1. Small (0 ~ 479px)
  if (window.innerWidth > 0 && window.innerWidth <= 479) {
    return str.length > 8 ? str.substring(0, 8) + ".." : str;
  }

  // 2. Medium (480 ~ 767px)
  else if (window.innerWidth >= 480 && window.innerWidth <= 767) {
    return str.length > 10 ? str.substring(0, 10) + ".." : str;
  }

  // 3. Large (768 ~ 991px)
  else if (window.innerWidth >= 768 && window.innerWidth <= 991) {
    return str.length > 10 ? str.substring(0, 10) + ".." : str;
  }

  // 4. Extra Large (992 ~ 1199px)
  else if (window.innerWidth >= 992 && window.innerWidth <= 1199) {
    return str.length > 12 ? str.substring(0, 12) + ".." : str;
  }

  // 5. Extra Extra Large (1280px ~ )
  else {
    return str.length > max ? str.substring(0, max) + ".." : str;
  }
}