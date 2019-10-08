"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function loader(data) {
    this.cacheable && this.cacheable(true);
    const result = transformJson(JSON.parse(data));
    return `\
:root {
  ${result}
}`;
}
exports.default = loader;
function transformJson(json) {
    return Object.keys(json).reverse().reduce((acc, key) => {
        const value = json[key];
        const prop = key.startsWith(`--`) ? key : `--` + key;
        acc.push(`  ${prop}: ${value}`);
        return acc;
    }, []).join('\n');
}
//# sourceMappingURL=root-cssvar-loader.js.map