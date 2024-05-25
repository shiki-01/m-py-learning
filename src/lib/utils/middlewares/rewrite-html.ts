import { addAnchorCopy } from "./rewriters/add-anchor-copy";
import { processFigure } from "./rewriters/figure";
import { highlight } from "./rewriters/highlight";
import { injectIconify } from "./rewriters/icons";

export function injectComponents(): void {
  const components: Array<() => void> = [injectIconify];

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

  return result;
}
