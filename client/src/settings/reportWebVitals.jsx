// @ts-ignore
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && typeof onPerfEntry === "function") {
    Promise.all([
      getCLS(onPerfEntry),
      getFID(onPerfEntry),
      getFCP(onPerfEntry),
      getLCP(onPerfEntry),
      getTTFB(onPerfEntry)
    ])
    .then(values => {
      console.log("Web Vitals reported successfully:", values);
    })
    .catch(error => {
      console.error("Error reporting Web Vitals:", error);
    });

    console.log("Web Vitals monitoring set up");
  }
  else {
    console.warn("No performance entry callback provided. Web Vitals not reported.");
  }
};
