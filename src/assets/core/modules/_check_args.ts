import { EEntType, EAttribNames, TEntTypeIdx, EEntTypeStr } from '@libs/geo-info/common';
import { idsBreak } from '@libs/geo-info/id';

// =========================================================================================================================================
// Attribute Checks
// =========================================================================================================================================
export function checkAttribName(fn_name: string, attrib_name: string): void {
    TypeCheckObj.isString(fn_name, 'attrib_name', attrib_name); // check arg is string
    if (attrib_name.length === 0) {
        throw new Error (fn_name + ': ' + 'attrib_name not specified');
    }
    if (attrib_name.search(/\W/) !== -1) {
        throw new Error (fn_name + ': ' + 'attrib_name contains restricted characters');
    }
    if (attrib_name[0].search(/[0-9]/) !== -1) {
        throw new Error (fn_name + ': ' + 'attrib_name should not start with numbers');
    }
    // blocks writing to id
    if (attrib_name === 'id') {
        throw new Error(fn_name + ': id is not modifiable!');
    }
}
export function checkAttribIdxKey(fn_name: string, idx_or_key?: number|string): void {
    // -- check defined index
    if (typeof idx_or_key === 'number') {
        // check if index is number
        TypeCheckObj.isNumber(fn_name, 'attrib_index', idx_or_key);
        // this is an item in a list, the item value can be any
    } else if (typeof idx_or_key === 'string') {
        // check if index is number
        TypeCheckObj.isString(fn_name, 'attrib_key', idx_or_key);
        // this is an item in an object, the item value can be any
    } else {
        throw new Error(fn_name + ': index or key is not a valid type: ' + idx_or_key);
    }
}
export function checkAttribNameIdxKey(fn_name: string, attrib: string|[string, number|string]): [string, number|string] {
    let attrib_name: string = null;
    let attrib_idx_key: number|string = null;
    // deconstruct the attrib arg
    if (Array.isArray(attrib)) {
        if (attrib.length !== 2) {
            throw new Error (fn_name + ': ' + 'attrib_name not specified');
        }
        attrib_name = attrib[0] as string;
        attrib_idx_key = attrib[1] as number|string;
    } else {
        attrib_name = attrib as string;
    }
    // check that the name is ok
    checkAttribName(fn_name, attrib_name);
    // check that the array index or object key is ok
    if (attrib_idx_key !== null) {
        checkAttribIdxKey(fn_name, attrib_idx_key);
    }
    // return the deconstructed attrib arg, attrib_idx_key may be null
    return [attrib_name, attrib_idx_key];
}
export function checkAttribValue(fn_name: string, attrib_value: any): void {
    // check the actual value
    checkArgTypes(fn_name, 'attrib_value', attrib_value,
            [TypeCheckObj.isString, TypeCheckObj.isNumber, TypeCheckObj.isBoolean,
                TypeCheckObj.isNull, TypeCheckObj.isList, TypeCheckObj.isDict]);
}
// =========================================================================================================================================
// Function Dictionaries
// =========================================================================================================================================
export class TypeCheckObj {
    static isAny(fn_name: string, arg_name: string, arg: string): void {
        isAnyArg(fn_name, arg_name, arg);
        return;
    }
    // null: allow Null input
    static isNull(fn_name: string, arg_name: string, arg: string): void {
        isNullArg(fn_name, arg_name, arg);
        return;
    }
    // dict
    static isDict(fn_name: string, arg_name: string, arg: string): void {
        isDictArg(fn_name, arg_name, arg, 'any');
        return;
    }
    // list
    static isList(fn_name: string, arg_name: string, arg: string): void {
        isListArg(fn_name, arg_name, arg, 'any');
        return;
    }
    // booleans
    static isBoolean(fn_name: string, arg_name: string, arg: string): void {
        isBooleanArg(fn_name, arg_name, arg, 'boolean');
        return;
    }
    static isBooleanList(fn_name: string, arg_name: string, arg_list: string[]): void {
        isBooleanListArg(fn_name, arg_name, arg_list, 'boolean');
        return;
    }
    // strings
    static isString(fn_name: string, arg_name: string, arg: string): void {
        isStringArg(fn_name, arg_name, arg, 'string');
        return;
    }
    static isStringList(fn_name: string, arg_name: string, arg_list: string[]): void {
        isStringListArg(fn_name, arg_name, arg_list, 'string');
        return;
    }
    // special for attrb names with index or key
    static isStringStringList(fn_name: string, arg_name: string, arg_list: [string, string]): void {
        isStringListArg(fn_name, arg_name, arg_list, 'string');
        isListLenArg(fn_name, arg_name, arg_list, 2);
        return;
    }
    static isStringNumberList(fn_name: string, arg_name: string, arg_list: [string, string]): void {
        isListLenArg(fn_name, arg_name, arg_list, 2);
        isStringArg(fn_name, arg_name, arg_list[0], 'string');
        isNumberArg(fn_name, arg_name, arg_list[1]);
        return;
    }
    // numbers and special numbers
    static isNumber(fn_name: string, arg_name: string, arg: number): void {
        isNumberArg(fn_name, arg_name, arg);
        return;
    }static isNumber01(fn_name: string, arg_name: string, arg: number): void {
        isNumber01Arg(fn_name, arg_name, arg);
        return;
    }
    static isNumberList(fn_name: string, arg_name: string, arg_list: number[]): void {
        isNumberListArg(fn_name, arg_name, arg_list);
        return;
    }
    static isNullList(fn_name: string, arg_name: string, arg_list: number[]): void {
        isNullListArg(fn_name, arg_name, arg_list);
        return;
    }
    static isInt(fn_name: string, arg_name: string, arg: number): void {
        isIntArg(fn_name, arg_name, arg);
        return;
    }
    static isXYlist(fn_name: string, arg_name: string, arg_list: [number, number]): void {
        isListArg(fn_name, arg_name, arg_list, 'numbers');
        isListLenArg(fn_name, arg_name, arg_list, 2);
        isNumberListArg(fn_name, arg_name, arg_list);
        return;
    }
    static isXYlistInt(fn_name: string, arg_name: string, arg_list: [number, number]): void {
        isListArg(fn_name, arg_name, arg_list, 'integers');
        isListLenArg(fn_name, arg_name, arg_list, 2);
        isIntListArg(fn_name, arg_name, arg_list);
        return;
    }
    static isXYZlist(fn_name: string, arg_name: string, arg_list: [number, number, number]): void {
        TypeCheckObj.isCoord(fn_name, arg_name, arg_list);
        return;
    }
    // Other Geometry
    static isColor(fn_name: string, arg_name: string, arg: [number, number, number]): void { // TColor = [number, number, number]
        isListArg(fn_name, arg_name, arg, 'numbers');
        isListLenArg(fn_name, arg_name, arg, 3);
        isNumber01ListArg(fn_name, arg_name, arg);
        return;
    }
    static isCoord(fn_name: string, arg_name: string, arg: [number, number, number]): void { // Txyz = [number, number, number]
        isListArg(fn_name, arg_name, arg, 'numbers');
        isListLenArg(fn_name, arg_name, arg, 3);
        isNumberListArg(fn_name, arg_name, arg);
        return;
    }
    static isCoordList(fn_name: string, arg_name: string, arg_list: [number, number, number][]): void {
        isListArg(fn_name, arg_name, arg_list, 'coordinates');
        for (let i = 0; i < arg_list.length; i++) {
            isListLenArg(fn_name, arg_name + '[' + i + ']', arg_list[i], 3);
            isNumberListArg(fn_name, arg_name + '[' + i + ']', arg_list[i]);
        }
        return;
    }
    static isCoordList_List(fn_name: string, arg_name: string, arg_list: [number, number, number][][]): void {
        isListArg(fn_name, arg_name, arg_list, 'lists of coordinates');
        for (let i = 0; i < arg_list.length; i++) {
            TypeCheckObj.isCoordList(fn_name, arg_name + '[' + i + ']', arg_list[i]);
        }
        return;
    }
    static isVector(fn_name: string, arg_name: string, arg_list: [number, number, number]): void { // same checks as coord
        TypeCheckObj.isCoord(fn_name, arg_name, arg_list);
        return;
    }
    static isVectorList(fn_name: string, arg_name: string, arg_list: [number, number, number][]): void {
        isListArg(fn_name, arg_name, arg_list, 'vectors');
        for (let i = 0; i < arg_list.length; i++) {
            TypeCheckObj.isVector(fn_name, arg_name + '[' + i + ']', arg_list[i]);
        }
        return;
    }
    static isOrigin(fn_name: string, arg_name: string, arg: number[]): TEntTypeIdx {
        return checkIDnTypes(fn_name, arg_name, arg,
                            [IDcheckObj.isID, TypeCheckObj.isCoord],
                            [EEntType.POSI, EEntType.VERT, EEntType.POINT]) as TEntTypeIdx;
    }
    static isPlane(fn_name: string, arg_name: string, arg_list: [number, number, number][]): void { // TPlane = [Txyz, Txyz, Txyz]
        // one origin: point, posi, vert, coord + 2 vectors
        isListArg(fn_name, arg_name, arg_list, 'origin and vectors');
        isListLenArg(fn_name, arg_name, arg_list, 3);
        TypeCheckObj.isCoord(fn_name, arg_name  + '[0]', arg_list[0]);
        [1, 2].forEach((i) => {
            TypeCheckObj.isVector(fn_name, arg_name + '[' + i + ']', arg_list[i]);
        });
        return;
    }
    static isPlaneList(fn_name: string, arg_name: string, arg_list: [number, number, number][][]): void {
        isListArg(fn_name, arg_name, arg_list, 'planes');
        for (let i = 0; i < arg_list.length; i++) {
            TypeCheckObj.isPlane(fn_name, arg_name + '[' + i + ']', arg_list[i]);
        }
        return;
    }
    static isBBox(fn_name: string, arg_name: string, arg_list: [number, number, number][]): void { // TBbox = [Txyz, Txyz, Txyz, Txyz]
        // four coords
        isListArg(fn_name, arg_name, arg_list, 'origin, min corner, max corner, size');
        isListLenArg(fn_name, arg_name, arg_list, 4);
        TypeCheckObj.isCoord(fn_name, arg_name  + '[0]', arg_list[0]);
        [0, 1, 2, 3].forEach((i) => {
            TypeCheckObj.isVector(fn_name, arg_name + '[' + i + ']', arg_list[i]);
        });
        return;
    }
    static isBBoxList(fn_name: string, arg_name: string, arg_list: [number, number, number][][]): void {
        isListArg(fn_name, arg_name, arg_list, 'BBoxes');
        for (let i = 0; i < arg_list.length; i++) {
            TypeCheckObj.isBBox(fn_name, arg_name + '[' + i + ']', arg_list[i]);
        }
        return;
    }
    static isRay(fn_name: string, arg_name: string, arg_list: [number, number, number][]): void { // TRay = [Txyz, Txyz]
        isListArg(fn_name, arg_name, arg_list, 'origin and vector');
        isListLenArg(fn_name, arg_name, arg_list, 2);
        TypeCheckObj.isCoord(fn_name, arg_name  + '[0]', arg_list[0]);
        TypeCheckObj.isVector(fn_name, arg_name + '[1]', arg_list[1]);
        return;
    }
    static isRayList(fn_name: string, arg_name: string, arg_list: [number, number, number][][]): void {
        isListArg(fn_name, arg_name, arg_list, 'Rays');
        for (let i = 0; i < arg_list.length; i++) {
            TypeCheckObj.isRay(fn_name, arg_name + '[' + i + ']', arg_list[i]);
        }
        return;
    }
}
export class IDcheckObj {
    // static default_ent_type_strs = ['POSI', 'TRI', 'VERT', 'EDGE', 'WIRE', 'FACE', 'POINT', 'PLINE', 'PGON', 'COLL'];
    static default_ent_type_strs = [EEntType.POSI,
                                    EEntType.TRI,
                                    EEntType.VERT,
                                    EEntType.EDGE,
                                    EEntType.WIRE,
                                    EEntType.FACE,
                                    EEntType.POINT,
                                    EEntType.PLINE,
                                    EEntType.PGON,
                                    EEntType.COLL];
    // IDs
    // entity types
    // POSI, TRI, VERT, EDGE, WIRE, FACE, POINT, PLINE, PGON, COLL
    static isID(fn_name: string, arg_name: string, arg: any, ent_type_strs: EEntType[]|null): TEntTypeIdx {
        let ent_arr;
        try {
            ent_arr = idsBreak(arg) as TEntTypeIdx; // split
        } catch (err) {
            throw new Error(fn_name + ': ' + arg_name + ' is not a valid Entity ID'); // check valid id
        }
        if (ent_type_strs === null) {
            ent_type_strs = IDcheckObj.default_ent_type_strs;
        }
        let pass = false;
        for (let i = 0; i < ent_type_strs.length; i++) {
            if (ent_arr[0] === ent_type_strs[i]) {
                pass = true;
                break;
            }
        }
        if (pass === false) {
            throw new Error(fn_name + ': ' + arg_name + ' is not one of the following valid types - ' +
                            ent_type_strs.map((test_ent) => EEntType[test_ent]).toString());
        }
        return ent_arr;
    }
    static isIDList(fn_name: string, arg_name: string, arg_list: any[], ent_type_strs: EEntType[]|null): TEntTypeIdx[] {
        isListArg(fn_name, arg_name, arg_list, 'valid Entity IDs');
        const ret_arr = [];
        if (ent_type_strs === null) {
            ent_type_strs = IDcheckObj.default_ent_type_strs;
        }
        for (let i = 0; i < arg_list.length; i++) {
            ret_arr.push(IDcheckObj.isID(fn_name, arg_name + '[' + i + ']', arg_list[i], ent_type_strs));
        }
        return ret_arr as TEntTypeIdx[];
    }
    static isIDList_list(fn_name: string, arg_name: string, arg_list: any, ent_type_strs: EEntType[]|null): TEntTypeIdx[][] {
        isListArg(fn_name, arg_name, arg_list, 'list of valid Entity IDs');
        const ret_arr = [];
        if (ent_type_strs === null) {
            ent_type_strs = IDcheckObj.default_ent_type_strs;
        }
        for (let i = 0; i < arg_list.length; i++) {
            ret_arr.push(IDcheckObj.isIDList(fn_name, arg_name + '[' + i + ']', arg_list[i], ent_type_strs));
        }
        return ret_arr as TEntTypeIdx[][];
    }
}
// =========================================================================================================================================
// Specific Checks
// =========================================================================================================================================
export function checkArgTypes(fn_name: string, arg_name: string, arg: any, check_fns: Function[]): void|TEntTypeIdx|
                               TEntTypeIdx[]|TEntTypeIdx[][] {
    let pass = false;
    const err_arr = [];
    let ret;
    for (let i = 0; i < check_fns.length; i++) {
        try {
           ret = check_fns[i](fn_name, arg_name, arg);
        } catch (err) {
            err_arr.push(err.message + '<br>');
            continue;
        }
        pass = true;
        break; // passed
    }
    if (pass === false) { // Failed all tests: argument does not fall into any valid types
        const ret_msg = fn_name + ': ' + arg_name + ' failed the following tests:<br>';
        throw new Error(ret_msg + err_arr.join(''));
    }
    return ret;
}

export function checkIDs(fn_name: string, arg_name: string, arg: any, check_fns: Function[],
                         IDchecks: EEntType[]|null): TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][] {
    let pass = false;
    const err_arr = [];
    let ret: TEntTypeIdx|TEntTypeIdx[];
    for (let i = 0; i < check_fns.length; i++) {
        try {
           ret =  check_fns[i](fn_name, arg_name, arg, IDchecks);
        } catch (err) {
            err_arr.push(err.message + '<br>');
            continue;
        }
        pass = true;
        break; // passed
    }
    if (pass === false) { // Failed all tests: argument does not fall into any valid types
        const ret_msg = fn_name + ': ' + arg_name + ' failed the following tests:<br>';
        throw new Error(ret_msg + err_arr.join(''));
    }
    return ret; // returns TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][]; depends on which passes
}
// =========================================================================================================================================
// Most General Check
// =========================================================================================================================================
export function checkIDnTypes(fn_name: string, arg_name: string, arg: any, check_fns: Function[],
                              IDchecks?: EEntType[]|null): TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][] {
    let pass = false;
    const err_arr = [];
    let ret: TEntTypeIdx|TEntTypeIdx[];
    for (let i = 0; i < check_fns.length; i++) {
        try {
            ret = check_fns[i](fn_name, arg_name, arg, IDchecks);
        } catch (err) {
            err_arr.push(err.message + '<br>');
            continue;
        }
        pass = true;
        break; // passed

        // if (Object.keys(IDcheckObj).includes(check_fns[i])) {
        //     // checking for ID
        //     try {
        //         ret = IDcheckObj[check_fns[i]](fn_name + '.' + check_fns[i], arg_name, arg, IDchecks);
        //     } catch (err) {
        //         err_arr.push(err.message + '<br>');
        //         continue;
        //     }
        //     pass = true;
        //     break; // passed
        // } else {
        //     // checking common types
        //     try {
        //         TypeCheckObj[check_fns[i]](fn_name + '.' + check_fns[i], arg_name, arg);
        //     } catch (err) {
        //         err_arr.push(err.message + '<br>');
        //         continue;
        //     }
        //     pass = true;
        //     break; // passed
        // }
    }
    if (pass === false) { // Failed all tests: argument does not fall into any valid types
        const ret_msg = fn_name + ': ' + arg_name + ' failed the following tests:<br>';
        throw new Error(ret_msg + err_arr.join(''));
    }
    return ret; // returns void|TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][]; depends on which passes
}

// =====================================================================================================================
// util
// =====================================================================================================================
// Dict
function isDictArg(fn_name: string, arg_name: string, arg: any, typ: string): void {
    if (Array.isArray(arg) || typeof arg !== 'object') {
        throw new Error (fn_name + ': ' + arg_name + ' is not a dict');
    }
    return;
}
// List
function isListArg(fn_name: string, arg_name: string, arg: any, typ: string): void {
    if (!Array.isArray(arg)) {
        throw new Error (fn_name + ': ' + arg_name + ' is not a list of ' + typ);
    }
    return;
}
function isListLenArg(fn_name: string, arg_name: string, arg_list: any[], len: number): void {
    if (arg_list.length !== len) {
        throw new Error (fn_name + ': ' + arg_name + ' is not a list of length ' + len);
    }
    return;
}
// Any
function isAnyArg(fn_name: string, arg_name: string, arg: any): void {
    if (arg === undefined) {
        throw new Error(fn_name + ': ' + arg_name + ' must be defined');
    }
    return;
}
// Null
function isNullArg(fn_name: string, arg_name: string, arg: any): void {
    if (arg !== null) {
        throw new Error(fn_name + ': ' + arg_name + ' is not null');
    }
    return;
}
// Boolean
function isBooleanArg(fn_name: string, arg_name: string, arg: any, typ: string): void {
    if (typeof arg !== 'boolean') {
        throw new Error(fn_name + ': ' + arg_name + ' is not a ' + typ);
    }
    return;
}
function isBooleanListArg(fn_name: string, arg_name: string, arg_list: any[], typ: string): void {
    isListArg(fn_name, arg_name, arg_list, typ);
    for (let i = 0; i < arg_list.length; i++) {
        isBooleanArg(fn_name, arg_name + '[' + i + ']', arg_list[i], typ);
    }
    return;
}
// String
function isStringArg(fn_name: string, arg_name: string, arg: any, typ: string): void {
    if (typeof arg !== 'string') {
        throw new Error(fn_name + ': ' + arg_name + ' is not a ' + typ);
    }
    return;
}
function isStringListArg(fn_name: string, arg_name: string, arg_list: any[], typ: string): void {
    isListArg(fn_name, arg_name, arg_list, typ);
    for (let i = 0; i < arg_list.length; i++) {
        isStringArg(fn_name, arg_name + '[' + i + ']', arg_list[i], typ);
    }
    return;
}
// Numbers
function isNumberArg(fn_name: string, arg_name: string, arg: any): void {
    if (isNaN(arg) || isNaN(parseInt(arg, 10))) {
        throw new Error(fn_name + ': ' + arg_name + ' is not a number');
    }
    return;
}
function isNumber01Arg(fn_name: string, arg_name: string, arg: any): void {
    if (isNaN(arg) || isNaN(parseInt(arg, 10))) {
        throw new Error(fn_name + ': ' + arg_name + ' is not a number');
    }
    if (arg < 0 || arg > 1) {
        throw new Error(fn_name + ': ' + arg_name + ' must be between 0 and 1');
    }
    return;
}
function isNumberListArg(fn_name: string, arg_name: string, arg_list: any): void {
    isListArg(fn_name, arg_name, arg_list, 'numbers');
    for (let i = 0; i < arg_list.length; i++) {
        isNumberArg(fn_name, arg_name + '[' + i + ']', arg_list[i]);
    }
    return;
}
function isNumber01ListArg(fn_name: string, arg_name: string, arg_list: any): void {
    isListArg(fn_name, arg_name, arg_list, 'numbers');
    for (let i = 0; i < arg_list.length; i++) {
        isNumber01Arg(fn_name, arg_name + '[' + i + ']', arg_list[i]);
    }
    return;
}
function isNullListArg(fn_name: string, arg_name: string, arg_list: any): void {
    isListArg(fn_name, arg_name, arg_list, 'null');
    for (let i = 0; i < arg_list.length; i++) {
        isNullArg(fn_name, arg_name + '[' + i + ']', arg_list[i]);
    }
    return;
}
function isIntArg(fn_name: string, arg_name: string, arg: any): void {
    if (!Number.isInteger(arg)) {
        throw new Error(fn_name + ': ' + arg_name + ' is not an integer');
    }
    return;
}
function isIntListArg(fn_name: string, arg_name: string, arg_list: any[]): void {
    isListArg(fn_name, arg_name, arg_list, 'integers');
    for (let i = 0; i < arg_list.length; i++) {
        if (!Number.isInteger(arg_list[i])) {
            throw new Error(fn_name + ': ' + arg_name + '[' + i + ']' + ' is not an integer');
        }
    }
    return;
}
