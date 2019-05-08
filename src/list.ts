import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { isOpenFileValid } from './guard';
import { getAssociationFor } from './configuration';
import { targets } from './targets';
import { getTargetPaths } from './fileLocalizer';

export async function listAssociated(uri: vscode.Uri | undefined) {
    uri = uri || getOpenFileUri();
    if (!uri) {
        return;
    }
    const sourcePath = uri.fsPath;

    const association = getAssociationFor(sourcePath);
    if (!association) {
        return;
    }

    const targetPaths = targets
        .map(t => getTargetPaths(sourcePath, association, t)
            .find(p => fs.existsSync(p)))
        .filter(t => t !== undefined) as string[];

    if (targetPaths.length === 0) {
        return;
    }

    const pickedPath = await showQuickPick(targetPaths);
    if (!pickedPath) {
        return;
    }

    const document = await vscode.workspace.openTextDocument(pickedPath);
    await vscode.window.showTextDocument(document);
}

function getOpenFileUri() {
    if (!vscode.window.activeTextEditor || !isOpenFileValid(vscode.window.activeTextEditor)) {
        return;
    }

    return vscode.window.activeTextEditor.document.uri;
}

async function showQuickPick(paths: string[]) {
    const picks = paths.map<vscode.QuickPickItem>(p => {
        return {
            label: path.basename(p),
            detail: p
        };
    });

    const selection = await vscode.window.showQuickPick(picks);
    if (!selection) {
        return;
    }

    return selection.detail;
}