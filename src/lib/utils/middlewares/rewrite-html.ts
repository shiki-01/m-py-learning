import { addAnchorCopy } from "./rewriters/add-anchor-copy";
import { processFigure } from "./rewriters/figure";
import { highlight } from "./rewriters/highlight";
import { injectIconify } from "./rewriters/icons";
import { injectFlowbite } from "./rewriters/table";

export function injectComponents(): void {
  const components: Array<() => void> = [injectIconify, injectFlowbite];

  components.forEach((component) => {
    component();
  });
}

export type Rewriter = (html: string) => string;

export function rewriteHTML(
  html: string,
  additionalRewriter: Rewriter[] = [],
): string {
  let result = html;

  const writers: Rewriter[] = [highlight, addAnchorCopy, processFigure, ...additionalRewriter];

  // eslint-disable-next-line no-restricted-syntax
  for (const rewriter of writers) {
    result = rewriter(result ?? "");
  }

  // Check if the HTML contains a table tag
  if (result.includes('<table>')) {
    injectFlowbite();
  }

  return result;
}
