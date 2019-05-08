import * as path from 'path';
import { Association } from './configuration';
import { Target } from './targets';

export function getTargetPaths(sourcePath: string, association: Association, target: Target) {
    const baseName = path.basename(sourcePath, association.extension);
    const directory = path.dirname(sourcePath);

    const targetExtensions = association.associated[target.configurationKey];
    if (!targetExtensions) {
        return [];
    }

    return targetExtensions.map(e => path.join(directory, baseName + e));
}