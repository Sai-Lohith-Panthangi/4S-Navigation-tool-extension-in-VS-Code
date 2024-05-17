// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed


export function activate(context: vscode.ExtensionContext) {
    let disposableGoToDefinition = vscode.commands.registerCommand('4s-navigation-tool.goToDefinition', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const position = editor.selection.active;
            const wordRange = editor.document.getWordRangeAtPosition(position);
            const word = editor.document.getText(wordRange);
            vscode.commands.executeCommand('editor.action.goToDeclaration', position, word);
        }
    });
	let disposableSubwordSearch = vscode.commands.registerCommand('4s-navigation-tool.subwordSearch', () => {
        const searchTerm = vscode.window.activeTextEditor?.document.getText(
            vscode.window.activeTextEditor?.selection
        );
        if (searchTerm) {
            const escapedSearchTerm = searchTerm.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            vscode.commands.executeCommand('workbench.action.findInFiles', {
                query: `\\b${escapedSearchTerm}\\b`,
                isRegex: true,
                matchWholeWord: true
            });
        } else {
            vscode.window.showInformationMessage('No subword selected for search.');
        }
    });

    let disposableStackOverflowSearch = vscode.commands.registerCommand('4s-navigation-tool.stackOverflowSearch', async () => {
        const searchQuery = await vscode.window.showInputBox({
            prompt: 'Enter your Stack Overflow search query'
        });

        if (searchQuery) {
            const encodedQuery = encodeURIComponent(searchQuery);
            const stackOverflowSearchUrl = `https://stackoverflow.com/search?q=${encodedQuery}`;
            vscode.env.openExternal(vscode.Uri.parse(stackOverflowSearchUrl));
        } else {
            vscode.window.showInformationMessage('No search query entered for Stack Overflow search.');
        }
    });

    context.subscriptions.push(disposableGoToDefinition, disposableSubwordSearch, disposableStackOverflowSearch);
}
// This method is called when your extension is deactivated
export function deactivate() {}
