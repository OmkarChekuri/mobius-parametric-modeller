
export const inline_query_expr = [
    ['#@name == value', 'Search for entities with attributes equal to a given value'],
    ['#@name[i] == value', 'Search for entities with attributes with index equal to a given value'],
    ['#@name != value', 'Search for entities with attributes not equal to a given value'],
    ['#@name[i] != value', 'Search for entities with attributes with index not equal to a given value'],
    ['#@name > value', 'Search for entities with attributes greater than a given value'],
    ['#@name[i] > value', 'Search for entities with attributes with index greater than a given value'],
    ['#@name >= value', 'Search for entities with attributes greater than or equal to a given value'],
    ['#@name[i] >= value', 'Search for entities with attributes with index greater than or equal to a given value'],
    ['#@name < value', 'Search for entities with attributes less than a given value'],
    ['#@name[i] < value', 'Search for entities with attributes with index less than a given value'],
    ['#@name <= value', 'Search for entities with attributes less than or equal to a given value'],
    ['#@name[i] <= value', 'Search for entities with attributes with index less than or equal to a given value']
];

export const inline_sort_expr = [
    ['#@name', 'Sort based on attribute value'],
    ['#@name[i]', 'Sort based on attribute index value']
];

const constants = [
    ['PI', 'The mathematical constant PI, 3.141... '],
    ['XY', 'A plane at the origin, aligned with the XY plane'],
    ['YZ', 'A plane at the origin, aligned with the YZ plane'],
    ['ZX', 'A plane at the origin, aligned with the ZX plane'],
    ['YX', 'A plane at the origin, aligned with the YX plane'],
    ['ZY', 'A plane at the origin, aligned with the ZY plane'],
    ['XZ', 'A plane at the origin, aligned with the XZ plane']
 ];

const lists = [
    ['isList(list)', 'Returns true if this is a list, false otherwise.'],
    ['range(start, end)', 'Generates a list of integers, from start to end, with a step size of 1'],
    ['range(start, end, step?)', 'Generates a list of integers, from start to end, with a specified step size'],
    ['len(list)', 'Returns the number of items in the list'],
    // ['listLen(list)', 'Returns the number of items in the list'],
    ['listLast(list)', 'Returns the last item in a list'],
    ['listGet(list, index)', 'Returns the item in the list specified by index, either a positive or negative integer'],
    ['listFind(list, val)', 'Returns the index of the first occurence of the value in the list, or -1 if not found'],
    ['listHas(list, val)', 'Returns true if the list contains the value, false otherwise'],
    ['listCount(list, val)', 'Returns the number of times the value is in the list'],
    ['listCopy(list)', 'Returns a copy of the list'],
    ['listJoin(list1, list2)', 'Joins two lists into a single list'],
    ['listFlat(list)', 'Returns a copy of the nested list, flattened to a depth of 1'],
    ['listFlat(list, depth)', 'Returns a copy of the nested list, reduced to the specified depth'],
    ['listSlice(list, start, end?)', 'Return a sub-list from the list'],
    ['listCull(list)', 'Returns a new list of all the values that evaluate to true.'],
    ['listCull(list1, list2)', 'Returns a new list of all the values in list1 that evaluate to true in list2.'],
    ['listZip(lists)', 'Converts a set of lists from rows into columns, based on the shortest list'],
    ['listZip2(lists)', 'Converts a set of lists from rows into columns, based on the longest list']
 ];

 const sets = [
    ['setMake(list)', 'Generates a list of unique items.'],
    ['setUni(list1, list2)', 'Generates a list of unique items from the union of the two input lists.'],
    ['setInt(list1, list2)', 'Generates a list of unique items from the intersection of the two input lists.'],
    ['setDif(list1, list2)', 'Generates a list of unique items from the difference of the two input lists.']
 ];

 const vectors = [
    ['vecAdd(v1, v2)', 'Adds two vectors'],
    ['vecSub(v1, v2)', 'Subtracts vec2 from vec1'],
    ['vecDiv(v, num)', 'Divides a vector by a number'],
    ['vecMult(v, num)', 'Multiplies a vector by a number'],
    ['vecLen(v)', 'Calculates the magnitude of a vector'],
    ['vecSetLen(v, num)', 'Sets the magnitude of a vector'],
    ['vecNorm(v)', 'Sets the magnitude of a vector to 1'],
    ['vecRev(v)', 'Reverses the direction of a vector'],
    ['vecFromTo(pt1, pt2)', 'Creates a vector between two points'],
    ['vecAng(v1, v2)', 'Calculate the angle (0 to PI) between two vectors'],
    ['vecAng2(v1, v2, n)', 'Calculate the angle (0 to 2PI) between two vectors, relative to the plane normal'],
    ['vecDot(v1, v2)', 'Calculates the dot product of two vectors'],
    ['vecCross(v1, v2)', 'Calculates the cross product of two vectors'],
    ['vecEqual(v1, v2, tol)', 'Returns true if the difference between two vectors is smaller than a specified tolerance']
];

const colors = [
    ['colFalse(val, min, max)', 'Creates a colour from a value in the range between min and max.'],
    ['colScale(val, min, max, sc)', 'Creates a colour from a value in the range between min and max, given a Brewer color scale.']
];

const planes = [
    ['plnMake(o, x, xy)', 'Creates a plane from an origin "o", an "x" axis vector, and any other vector in the "xy" plane.'],
    ['plnCopy(p)', 'Make a copy of the plane "p"'],
    ['plnMove(p, v)', 'Move the plane "p" relative to the global X, Y, and Z axes, by vector "v".'],
    ['plnRot(p, r, a)', 'Rotate the plane "p" around the ray "r", by angle "a" (in radians).'],
    ['plnLMove(p, v)', 'Move the plane "p" relative to the local X, Y, and Z axes, by vector "v".'],
    ['plnLRotX(p, a)', 'Rotate the plane "p" around the local X axis, by angle "a" (in radians).'],
    ['plnLRotY(p, a)', 'Rotate the plane "p" around the local Y axis, by angle "a" (in radians).'],
    ['plnLRotZ(p, a)', 'Rotate the plane "p" around the local Z axis, by angle "a" (in radians).']
];

const rays = [
    ['rayMake(o, d)', 'Creates a ray from an origin "o" and a direction vector "d".'],
    ['rayMake(o, d, l)', 'Creates a ray from an origin "o", a direction vector "d", and length "l".'],
    ['rayCopy(r)', 'Make a copy of the ray "r"'],
    ['rayMove(r, v)', 'Move the ray "r" relative to the global X, Y, and Z axes, by vector "v".'],
    ['rayRot(r1, r2, a)', 'Rotate the ray "r1" around the ray "r2", by angle "a" (in radians).'],
    ['rayLMove(r, d)', 'Move the ray "r" relative to the ray direction vector, by distance "d".'],
    ['rayFromPln(p)', 'Create a ray from a plane "p", with the same origin and with a direction along the plane z axis.']
];

const conversion = [
    ['boolean(v)', 'Converts the value to a boolean'],
    ['number(v)', 'Converts the value to a number'],
    ['string(v)', 'Converts the value to a string'],
    ['radToDeg(rad)', 'Converts radians to degrees'],
    ['degToRad(deg)', 'Converts degrees to radians']
];

const random = [
    ['rand(min, max)', 'Returns a random number in the specified range'],
    ['rand(min, max, seed)', 'Returns a random number in the specified range, given a numeric seed'],
    ['randInt(min, max)', 'Returns a random integer in the specified range'],
    ['randInt(min, max, seed)', 'Returns a random integer in the specified range, given a numeric seed'],
    ['randPick(list, num)', 'Returns a random set of items from the list'],
    ['randPick(list, num, seed)', 'Returns a random set of items from the list, given a numeric seed']
];

const arithmetic = [
    ['approx(num, num, tol)', 'Returns if the difference between the two numbers is less than the tolerance, t'],
    ['abs(num)', 'Returns the absolute value of the number'],
    ['square(num)', 'Returns the square of the number'],
    ['cube(num)', 'Returns the cube of the number'],
    ['pow(numb, pow)', 'Returns the number to the specified power'],
    ['sqrt(num)', 'Returns the square root of the number'],
    ['exp(num)', 'Returns the value of E to the power of the number'],
    ['log(num)', 'Returns the natural logarithm (base E) of the number'],
    ['round(num)', 'Returns the value of the number rounded to its nearest integer'],
    ['ceil(num)', 'Returns the value of the number rounded up to its nearest integer'],
    ['floor(num)', 'Returns the value of the number rounded down to its nearest integer'],
    ['mod(num1, num2)', 'Returns the remainder after division of num1 by num2'],
    ['remap(num, d1, d2)', 'Maps a number from the d1 domain to the d2 domain.'],
    ['sum(list)', 'Returns the sum of all values in a list'],
    ['prod(list)', 'Returns the product of all values in a list'],
    ['hypot(list)', 'Returns the hypotenuse of all values in a list'],
    ['norm(list)', 'Returns the norm of a list'],
    ['distance(c1, c2)', 'Returns the Euclidean distance between two xyzs, c1 and c2'],
    ['distance(c, r)', 'Returns the Euclidean distance between an xyz c and an infinite ray r'],
    ['distance(c, p)', 'Returns the Euclidean distance between an xyz c and an infinite plane p'],
    ['intersect(r1, r2)', 'Returns the intersection xyz between two infinite rays'],
    ['intersect(r1, r2, m)', 'Returns the intersection xyz between two rays, where ' +
        'if m=2, rays are infinite in both directions, ' +
        'if m=1 rays are infinite in one direction, ' +
        'and if m=0, rays are not infinite.'],
    ['intersect(r, p)', 'Returns the intersection xyz between an infinite ray r and an infinite plane p'],
    ['intersect(r, p, m)', 'Returns the intersection xyz between a ray r and an infinite plane p, where ' +
        'if m=2, the ray is infinite in both directions, ' +
        'if m=1 the ray is infinite in one direction, ' +
        'and if m=0, the ray is not infinite.'],
    ['project(c, r)', 'Returns the xyz from projecting an xyz c onto an infinite ray r'],
    ['project(c, p)', 'Returns the xyz from projecting an xyz c onto an infinite plane p']
];

const statistics = [
    ['min(list)', 'Returns the number with the lowest value'],
    ['max(list)', 'Returns the number with the highest value'],
    ['mad(list)', 'Returns the median absolute deviation of the list'],
    ['mean(list)', 'Returns the mean value of the list'],
    ['median(list)', 'Returns the median of the list'],
    ['mode(list)', 'Returns the mode of the list'],
    ['std(list)', 'Returns the standard deviation of the list'],
    ['vari(list)', 'Returns the variance of the list']
];

const trigonometry = [
    ['sin(rad)', 'Returns the sine of a value (in radians)'],
    ['asin(num)', 'Returns the inverse sine of a value (in radians)'],
    ['sinh(rad)', 'Returns the hyperbolic sine of a value (in radians)'],
    ['asinh(num)', 'Returns the hyperbolic arcsine of a value (in radians)'],
    ['cos(rad)', 'Returns the cosine of a value (in radians)'],
    ['acos(num)', 'Returns the inverse cosine of a value (in radians)'],
    ['cosh(rad)', 'Returns the hyperbolic cosine of a value (in radians)'],
    ['acosh(num)', 'Returns the hyperbolic arccos of a value (in radians)'],
    ['tan(rad)', 'Returns the tangent of a value (in radians)'],
    ['atan(num)', 'Returns the inverse tangent of a value (in radians)'],
    ['tanh(rad)', 'Returns the hyperbolic tangent of a value (in radians)'],
    ['atanh(num)', 'Returns the hyperbolic arctangent of a value (in radians)'],
    ['atan2(number1, number2)', 'Returns the inverse tangent function with two arguments, number1/number2']
];

const str = [
    ['replace(string,search_str,new_str)', 'Replace all instances of specified search with a new string'],
    ['len(str)', 'Returns the number of characters in the string']
];

const attrib = [
    ['setattr(entity, name, value)', 'Set an entity attribute value'],
    ['getattr(entity, name)', 'Query for an entity attribute value']
];

export const inline_func = [
    ['constants', constants],
    ['random', random],
    ['lists', lists],
    ['sets', sets],
    ['conversion', conversion],
    ['vectors', vectors],
    ['rays', rays],
    ['planes', planes],
    ['colors', colors],
    ['arithmetic', arithmetic],
    ['statistics', statistics],
    ['trigonometry', trigonometry],
];

// const inline_func_lst: string[][][] = inline_func.map(x => x[1]);
// const inline_func_lst = [
//     lists,
//     conversion,
//     arithmetic,
//     statistics,
//     trigonometry
// ];

// const inline_fn_names = [];
// for (let i = 0; i < inline_func_lst.length; i++) {
//     inline_func_lst[i].forEach((arr) => {
//         const mtch = arr[0].match(/^\w*(?=\()/);
//         let ret;
//         if (mtch !== null) {
//             ret = mtch[0];
//         } else {
//             ret = arr[0];
//         }
//         inline_fn_names.push(ret);
//     });
// }
// export const inline_fn_regEx = RegExp(inline_fn_names.join('|'), 'g');
