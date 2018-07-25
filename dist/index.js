#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var fs = require("fs-extra");
var minimist = require("minimist");
var path = require("path");
/**
 * Entry point.
 * @param args
 */
function bomstrip(args) {
    return __awaiter(this, void 0, void 0, function () {
        var parsedArgs, convertJobs, _i, _a, name, fileStats, _b, _c, _d, subFile, cwd, _e, _f, subFile;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    parsedArgs = minimist(args);
                    convertJobs = [];
                    _i = 0, _a = parsedArgs._;
                    _g.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 12];
                    name = _a[_i];
                    fileStats = void 0;
                    _g.label = 2;
                case 2:
                    _g.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, fs.stat(name)];
                case 3:
                    fileStats = _g.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _b = _g.sent();
                    console.warn("Path '" + name + "' not found");
                    return [3 /*break*/, 11];
                case 5:
                    if (!fileStats.isDirectory()) return [3 /*break*/, 10];
                    _c = 0;
                    return [4 /*yield*/, findFiles(name)];
                case 6:
                    _d = _g.sent();
                    _g.label = 7;
                case 7:
                    if (!(_c < _d.length)) return [3 /*break*/, 9];
                    subFile = _d[_c];
                    convertJobs.push({
                        input: subFile,
                        output: parsedArgs["o"] ? path.join(parsedArgs["o"], path.relative(name, subFile)) : subFile
                    });
                    _g.label = 8;
                case 8:
                    _c++;
                    return [3 /*break*/, 7];
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (fileStats.isFile()) {
                        convertJobs.push({
                            input: name,
                            output: parsedArgs["o"] ? path.join(parsedArgs["o"], name) : name
                        });
                    }
                    _g.label = 11;
                case 11:
                    _i++;
                    return [3 /*break*/, 1];
                case 12:
                    if (!(convertJobs.length === 0)) return [3 /*break*/, 16];
                    cwd = process.cwd();
                    _e = 0;
                    return [4 /*yield*/, findFiles(cwd)];
                case 13:
                    _f = _g.sent();
                    _g.label = 14;
                case 14:
                    if (!(_e < _f.length)) return [3 /*break*/, 16];
                    subFile = _f[_e];
                    convertJobs.push({
                        input: subFile,
                        output: parsedArgs["o"] ? path.join(parsedArgs["o"], path.relative(cwd, subFile)) : subFile
                    });
                    _g.label = 15;
                case 15:
                    _e++;
                    return [3 /*break*/, 14];
                case 16: return [4 /*yield*/, doJobs(convertJobs, parsedArgs["log"])];
                case 17:
                    _g.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Executes the specified set of convert jobs.
 * @param convertJobs
 */
function doJobs(convertJobs, logOutput) {
    return __awaiter(this, void 0, void 0, function () {
        var counter, _i, convertJobs_1, convertJob;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    counter = 0;
                    _i = 0, convertJobs_1 = convertJobs;
                    _a.label = 1;
                case 1:
                    if (!(_i < convertJobs_1.length)) return [3 /*break*/, 4];
                    convertJob = convertJobs_1[_i];
                    return [4 /*yield*/, doJob(convertJob)];
                case 2:
                    if (_a.sent()) {
                        ++counter;
                        if (logOutput) {
                            if (convertJob.input !== convertJob.output) {
                                console.log(convertJob.input + " -> " + convertJob.output);
                            }
                            else {
                                console.log(convertJob.input);
                            }
                        }
                    }
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    if (counter === 0) {
                        console.log("No files found with BOM");
                    }
                    else if (counter === 1) {
                        console.log("Stripped BOM from " + counter + " file");
                    }
                    else {
                        console.log("Stripped BOM from " + counter + " files");
                    }
                    return [2 /*return*/, counter];
            }
        });
    });
}
/**
 * Executes the specified single convert job.
 * @param convertJob
 */
function doJob(convertJob) {
    return __awaiter(this, void 0, void 0, function () {
        var fileBuf, _a, view, newBuf, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs.readFile(convertJob.input)];
                case 1:
                    fileBuf = _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = _b.sent();
                    // File was deleted between the readdir call and now, or permissions error or something, just skip it
                    return [2 /*return*/, false];
                case 3:
                    // Identify BOM
                    if (fileBuf.length < 3) {
                        return [2 /*return*/, false];
                    }
                    view = new Uint8Array(fileBuf.buffer);
                    if (!(view[0] === 0xEF && view[1] === 0xBB && view[2] === 0xBF)) return [3 /*break*/, 8];
                    newBuf = fileBuf.slice(3);
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, fs.writeFile(convertJob.output, newBuf)];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _b.sent();
                    console.error("Failed to write file to '" + convertJob.output + "'");
                    console.error(err_1);
                    return [2 /*return*/, false];
                case 7: return [2 /*return*/, true];
                case 8: 
                // Does not have BOM
                return [2 /*return*/, false];
            }
        });
    });
}
/**
 * Recursively finds all files under the specified path.
 * Path must refer to a directory.
 * @param inputPath
 */
function findFiles(inputPath) {
    return __awaiter(this, void 0, void 0, function () {
        var files, contents, _i, contents_1, item, itemPath, fileStats, _a, _b, _c, subFile;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    files = [];
                    return [4 /*yield*/, fs.readdir(inputPath)];
                case 1:
                    contents = _d.sent();
                    _i = 0, contents_1 = contents;
                    _d.label = 2;
                case 2:
                    if (!(_i < contents_1.length)) return [3 /*break*/, 13];
                    item = contents_1[_i];
                    itemPath = path.join(inputPath, item);
                    fileStats = void 0;
                    _d.label = 3;
                case 3:
                    _d.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, fs.stat(itemPath)];
                case 4:
                    fileStats = _d.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _a = _d.sent();
                    // File was deleted between the readdir call and now, or permissions error or something, just skip it
                    return [3 /*break*/, 12];
                case 6:
                    if (!fileStats.isDirectory()) return [3 /*break*/, 11];
                    _b = 0;
                    return [4 /*yield*/, findFiles(itemPath)];
                case 7:
                    _c = _d.sent();
                    _d.label = 8;
                case 8:
                    if (!(_b < _c.length)) return [3 /*break*/, 10];
                    subFile = _c[_b];
                    files.push(subFile);
                    _d.label = 9;
                case 9:
                    _b++;
                    return [3 /*break*/, 8];
                case 10: return [3 /*break*/, 12];
                case 11:
                    if (fileStats.isFile()) {
                        files.push(itemPath);
                    }
                    _d.label = 12;
                case 12:
                    _i++;
                    return [3 /*break*/, 2];
                case 13: return [2 /*return*/, files];
            }
        });
    });
}
bomstrip(process.argv.slice(2));
module.exports = bomstrip;
//# sourceMappingURL=index.js.map