// This file contains the code responsible for watching changes and updating them when nodes are linked together.

// Maybe, instead of a Mutation Observer, use app events?

// TODO: Write a function that creates a dependency tree.
// Calculate from the leaves and go up.

export function startLinkWatcher(app, htmlTarget) {
  app.linkWatcher = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      console.log('mutation', mutation)
      if (mutation.type === 'childList') {
        // mutation.addedNodes
        // TODO
      }
    }
  });

  app.linkWatcher.observe(htmlTarget, { childList: true });
}

export function stopLinkWatcher(app) {
  if (app.linkWatcher) {
    app.linkWatcher.disconnect();
    app.linkWatcher = null
  }
}