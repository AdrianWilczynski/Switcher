import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { Target } from './targets';
import { getAssociationFor, Association } from './configuration';

export function goTo(target: Target) {
    return async () => {
        if (!vscode.window.activeTextEditor) {
            return;
        }

        const association = getAssociationFor(vscode.window.activeTextEditor.document.fileName);
        if (!association) {
            return;
        }

        const targetPaths = await getTargetPaths(vscode.window.activeTextEditor.document.fileName, association, target);
        if (!targetPaths) {
            return;
        }

        const existingPath = targetPaths.find(p => fs.existsSync(p));
        if (!existingPath) {
            return;
        }

        const document = await vscode.workspace.openTextDocument(existingPath);
        await vscode.window.showTextDocument(document);
    };
}

async function getTargetPaths(sourcePath: string, association: Association, target: Target) {
    const baseName = path.basename(sourcePath, association.extension);
    const directory = path.dirname(sourcePath);

    const targetExtensions = association.associated[target.configurationKey];
    if (!targetExtensions) {
        return;
    }

    return targetExtensions.map(e => path.join(directory, baseName + e));
}