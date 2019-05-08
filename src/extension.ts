import * as vscode from 'vscode';
import { setContexts } from './context';
import { targets } from './targets';
import { goTo } from './goTo';

export function activate(context: vscode.ExtensionContext) {
	setContexts(vscode.window.activeTextEditor);

	context.subscriptions.push(
		...targets.map(t => vscode.commands.registerCommand(t.commandName, goTo(t))),
		vscode.window.onDidChangeActiveTextEditor(setContexts)
	);
}

export function deactivate() { }