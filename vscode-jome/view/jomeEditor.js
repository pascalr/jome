// nooo @ts-check

// Script run within the webview itself.
(function () {

	// Get a reference to the VS Code webview api.
	// We use this API to post messages back to our extension.

	// @ts-ignore
	const vscode = acquireVsCodeApi();


	const root = document.getElementById('root');

	// const addButtonContainer = document.querySelector('.add-button');
	// addButtonContainer.querySelector('button').addEventListener('click', () => {
	// 	vscode.postMessage({
	// 		type: 'add'
	// 	});
	// })

	// const errorContainer = document.createElement('div');
	// document.body.appendChild(errorContainer);
	// errorContainer.className = 'error'
	// errorContainer.style.display = 'none'
  // errorContainer.innerText = 'Error 12978aghs89d7fg273ug0a78fg80y3g2';
  // errorContainer.style.display = '';
  // errorContainer.style.display = 'none';


	/**
	 * Render the document in the webview.
	 */
	function updateContent(/** @type {string} */ text) {
    root.innerHTML = '';

    const div = document.createElement('div');
    div.className = 'text';
    const textContent = document.createElement('span');
    textContent.innerText = text;
    div.appendChild(textContent);
    root.appendChild(div);
	}

	// Handle messages sent from the extension to the webview
	window.addEventListener('message', event => {
		const message = event.data; // The json data that the extension sent
		switch (message.type) {
			case 'update':
				const text = message.text;

				// Update our webview's content
				updateContent(text);

				// Then persist state information.
				// This state is returned in the call to `vscode.getState` below when a webview is reloaded.
				vscode.setState({ text });

				return;
		}
	});

	// Webviews are normally torn down when not visible and re-created when they become visible again.
	// State lets us save information across these re-loads
	const state = vscode.getState();
	if (state) {
		updateContent(state.text);
	}
}());