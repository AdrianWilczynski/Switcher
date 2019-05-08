import * as vscode from 'vscode';

export function isOpenFileValid(editor: vscode.TextEditor) {
    return !editor.document.isUntitled && editor.document.uri.scheme === 'file';
}