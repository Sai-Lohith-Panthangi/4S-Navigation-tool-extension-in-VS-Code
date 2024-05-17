import * as vscode from 'vscode';

export function createWebviewPanel(context: vscode.ExtensionContext) {
    const panel = vscode.window.createWebviewPanel(
        'myWebview',
        'My Webview',
        vscode.ViewColumn.One,
        {
            enableScripts: true
        }
    );

    panel.webview.html = '<h1>Hello from Webview Panel</h1>';
}
