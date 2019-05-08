export class Target {
    constructor(public name: string) { }

    get commandName() {
        return `extension.goTo${this.name}`;
    }

    get configurationKey() {
        return this.name.toLowerCase();
    }

    get contextName() {
        return `has${this.name}`;
    }
}

export const targets = [
    new Target('Compiled'),
    new Target('Source'),
    new Target('Minified'),
    new Target('Component'),
    new Target('Template'),
    new Target('Stylesheet'),
    new Target('Test'),
    new Target('SUT'),
    new Target('Custom'),
];