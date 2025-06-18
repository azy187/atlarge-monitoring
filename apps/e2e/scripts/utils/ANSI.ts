type ANSICodeTypeHTMLSpan = "0" | "39" | "22";

type ANSICodeTypeColorID = "30" | "31" | "32" | "33" | "34" | "35" | "36" | "37" | "90";

type ANSICodeTypeColorName = "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "gray";

const ANSI_CODE_TO_COLOR_MAP = {
  "30": "black",
  "31": "red",
  "32": "green",
  "33": "yellow",
  "34": "blue",
  "35": "magenta",
  "36": "cyan",
  "37": "white",
  "90": "gray",
} as const satisfies Record<ANSICodeTypeColorID, ANSICodeTypeColorName>;

function convertToStyledHTML(str: string) {
  return str
    .replace(/\u001b\[(\d+)m/g, (_, code: ANSICodeTypeHTMLSpan | ANSICodeTypeColorID) => {
      if (code === "0" || code === "39" || code === "22") {
        return "</span>";
      }

      const color = ANSI_CODE_TO_COLOR_MAP[code];
      if (color) {
        return `<span style="color:${color}">`;
      } else {
        return "";
      }
    })
    .replace(/\n/g, "<br>");
}

export { convertToStyledHTML };
