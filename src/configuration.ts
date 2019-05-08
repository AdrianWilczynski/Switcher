import * as vscode from 'vscode';

export interface Association {
    extension: string;
    associated: {
        [key: string]: string[] | undefined
    };
}

export function getAssociationFor(fileName: string) {
    return getConfiguration()
        .find(a => fileName.endsWith(a.extension));
}

function getConfiguration() {
    return sanitizeConfiguration(
        vscode.workspace.getConfiguration()
            .get('switcher.associations'));
}

function sanitizeConfiguration(configuration: any): Association[] {
    return configuration && Array.isArray(configuration)
        ? configuration.filter(a => isAssociation(a))
        : [];
}

function isAssociation(value: any) {
    return !!(value
        && (value as Association).extension
        && (value as Association).associated) && isStringArrayDictionary((value as Association).associated);
}

function isStringArrayDictionary(value: any) {
    return Object.keys(value)
        .every(k => Array.isArray(value[k]) && (value[k] as string[]).every(i => typeof i === 'string'));
}