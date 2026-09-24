import React from "react";
import { hydrateRoot } from "react-dom/client";
import ComputerAccessSummary from "./computer-access-summary.jsx";
for (const island of document.querySelectorAll("[data-access-summary]")) hydrateRoot(island, <ComputerAccessSummary />);
