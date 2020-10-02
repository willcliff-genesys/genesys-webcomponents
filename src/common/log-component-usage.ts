const store = new Set();

export function logComponentUsage(tag: string): void {
  if (store.has(tag)) {
    return;
  }

  store.add(tag);

  const data = {
    genesysWebComponents: true,
    tag,
    href: document.location.href,
    pathname: document.location.pathname
  };

  window.top.postMessage(data, '*');

  console.debug(data);
}
