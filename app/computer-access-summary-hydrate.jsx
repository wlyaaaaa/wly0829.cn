import React from "react";
import { hydrateRoot } from "react-dom/client";
import ComputerAccessSummary from "./computer-access-summary.jsx";
export function mountAccessSummary(initialRead) {
  const island = document.querySelector("[data-access-summary]");
  if (island) hydrateRoot(island, <ComputerAccessSummary initialRead={initialRead} />);
}
