import { GenIcon } from "react-icons";

export const generateRandomString = (length) => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

/**
 * Higher-order function for async/await error handling
 * @param {function} fn an async function
 * @returns {function}
 */
export const catchErrors = (fn) => {
  return function (...args) {
    return fn(...args).catch((err) => {
      console.error(err);
    });
  };
};

/**
 * Format milliseconds to time duration
 * @param {number} ms number of milliseconds
 * @returns {string} formatted duration string
 * @example 216699 -> '3:36'
 */
export const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

/**
 * Format milliseconds to time duration
 * @param {Array} ms number of milliseconds
 * @returns {string} formatted duration string
 * @example 216699 -> '3:36'
 */
export const formatTotalDuration = (msArray) => {
  let totalMs = 0;

  if (msArray && msArray.length) {
    for (let i = 0; i < msArray.length; ++i) {
      if (msArray[i]) {
        totalMs += msArray[i].duration_ms;
      }
    }
  }

  const hours = Math.floor(totalMs / 3600000);
  const seconds = Math.floor((totalMs % 3600000) / 60000);

  return `${hours ? hours + "h " : ""}${seconds}m`;
};

export function RiPlayFill(props) {
  return GenIcon({
    tag: "svg",
    attr: { viewBox: "0 0 24 24" },
    child: [
      {
        tag: "g",
        attr: {},
        child: [
          { tag: "path", attr: { fill: "none", d: "M0 0h24v24H0z" } },
          {
            tag: "path",
            attr: {
              d: "M19.376 12.416L8.777 19.482A.5.5 0 0 1 8 19.066V4.934a.5.5 0 0 1 .777-.416l10.599 7.066a.5.5 0 0 1 0 .832z",
            },
          },
        ],
      },
    ],
  })(props);
}
