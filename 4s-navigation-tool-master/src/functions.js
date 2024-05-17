"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.goToMixinFile = exports.goToDefinationFile = void 0;
const vscode = __importStar(require("vscode"));
const goToDefinationFile = async () => {
    const editor = vscode.window.activeTextEditor;
    const regex = /^(extends|include)\s+([-./a-zA-Z\d]+)$/g;
    const lineText = editor?.document.lineAt(editor.selection.active.line)?.text || '';
    const isImportStatement = regex.test(lineText);
    if (isImportStatement) {
        const targetFileRelativePath = lineText.replace(' ./', ' ').split(' ').slice(-1)[0];
        const currentFilePath = editor.document.uri.path;
        const upperPathCount = targetFileRelativePath.split('../').length - 1;
        const targetFileFolderPath = targetFileRelativePath.split('../').slice(-1)[0];
        const mainDir = currentFilePath
            .split('/')
            .slice(0, -Math.abs(upperPathCount + 1))
            .join('/')
            .replace('/', '') + '/';
        const targetFilePath = mainDir + targetFileFolderPath + '.pug';
        vscode.workspace.openTextDocument(targetFilePath).then(document => {
            vscode.window.showTextDocument(document);
        });
    }
};
exports.goToDefinationFile = goToDefinationFile;
const goToMixinFile = async () => {
    const editor = vscode.window.activeTextEditor;
    const selectedText = editor?.document.getText(editor.selection) || '';
    if (selectedText) {
        const fileUris = await vscode.workspace.findFiles('**/*.pug');
        let file = '';
        let lineNumber = null;
        for (const fileUri of fileUris) {
            const document = await vscode.workspace.openTextDocument(fileUri);
            const contentString = document.getText();
            const regex = new RegExp(`(mixin)\\s+${selectedText}`, 'gi');
            if (regex.test(contentString)) {
                file = fileUri.fsPath;
                const wordPattern = new RegExp(`\\b(mixin)\\s+${selectedText}\\b`, 'gi');
                const match = wordPattern.exec(contentString);
                if (match) {
                    const matchOffset = match.index;
                    const position = document.positionAt(matchOffset);
                    lineNumber = position.line + 1;
                }
                break;
            }
        }
        if (file) {
            try {
                const document = await vscode.workspace.openTextDocument(file);
                const editor = await vscode.window.showTextDocument(document);
                if (lineNumber) {
                    const position = new vscode.Position(lineNumber - 1, 0);
                    editor.selection = new vscode.Selection(position, position);
                    editor.revealRange(editor.selection, vscode.TextEditorRevealType.InCenter);
                }
            }
            catch (error) {
                console.error(`Error opening file: ${error}`);
            }
        }
        else {
            vscode.window.showInformationMessage('No matches found in the workspace.');
        }
    }
    return;
};
exports.goToMixinFile = goToMixinFile;
//# sourceMappingURL=functions.js.map