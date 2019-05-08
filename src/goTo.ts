import * as vscode from 'vscode';
import * as fs from 'fs';
import { Target } from './targets';
import { getAssociationFor, Association } from './configuration';
import { isOpenFileValid } from './guard';
import { getTargetPaths } from './fileLocalizer';

export function goTo(target: Target) {
    return async () => {
        if (!vscode.window.activeTextEditor || !isOpenFileValid(vscode.window.activeTextEditor)) {
            return;
        }

        const association = getAssociationFor(vscode.window.activeTextEditor.document.fileName);
        if (!association) {
            return;
        }

        const targetPaths = getTargetPaths(vscode.window.activeTextEditor.document.fileName, association, target);

        const existingPath = targetPaths.find(p => fs.existsSync(p));
        if (!existingPath) {
            vscode.window.showWarningMessage('Unable to find a matching file.');
            return;
        }

        const document = await vscode.workspace.openTextDocument(existingPath);
        await vscode.window.showTextDocument(document);
    };
}

