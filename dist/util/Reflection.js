"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_stack_parser_1 = __importDefault(require("error-stack-parser"));
class Reflection {
    static getNameOfNthMethodOffStackTrace(error, n) {
        const parsed = error_stack_parser_1.default.parse(error);
        const functionName = parsed.length >= n
            ? parsed[n - 1].functionName
            : undefined;
        return functionName !== undefined
            ? getMethodName(functionName)
            : undefined;
    }
}
exports.Reflection = Reflection;
function getMethodName(functionName) {
    const matcher = functionName.match(/[^.]+$/);
    if (matcher !== null && matcher.length > 0)
        return matcher[0];
}
//# sourceMappingURL=Reflection.js.map