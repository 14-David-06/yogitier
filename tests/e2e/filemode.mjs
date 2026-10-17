// HTML-Version (file://): Ein goto auf einen anderen Hash wäre nur ein Sprung im selben Dokument.
// Wie bei der Server-Version soll jedes goto die Seite neu laden – daher erst über about:blank.
export function patchGoto(page, base) {
  if (!base.startsWith("file:")) return page;
  const goto = page.goto.bind(page);
  page.goto = async (url, options) => {
    await goto("about:blank");
    return goto(url, options);
  };
  return page;
}
