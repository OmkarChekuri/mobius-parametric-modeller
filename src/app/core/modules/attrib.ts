import { GIModel } from '@libs/geo-info/GIModel';
import { TId, TQuery, Txyz, TAttribDataTypes, EAttribNames, EEntityTypeStr } from '@libs/geo-info/common';
import { idBreak } from '@libs/geo-info/id';
import * as _check_args from './_check_args';

/**
 * Gets attribute value of all entities.
 * @param __model__
 * @param entities Position, vertex, edge, wire, face, point, polyline, polygon, collection or a list.
 * @param name Attribute name to get the value for.
 * @returns Attribute value.
 */
export function Get(__model__: GIModel, entities: TId|TId[], name: string): TAttribDataTypes|TAttribDataTypes[] {
    //_check_args.isStringArg('Get name', name);
    _check_args.isIdListArg("ccc", entities, [EEntityTypeStr.POSI, EEntityTypeStr.VERT] );
    if (!Array.isArray(entities)) {
        const [ent_type_str, index]: [EEntityTypeStr, number] = idBreak(entities as TId);
        return __model__.attribs.query.getAttribValue(ent_type_str, name, index);
    } else {
        return (entities as TId[]).map( entity => Get(__model__, entity, name)) as TAttribDataTypes[];
    }
}
/**
 * Sets attribute value.
 * @param __model__
 * @param entities Position, vertex, edge, wire, face, point, polyline, polygon, collection, or a list.
 * @param name Attribute name to be set.
 * @param value Attribute value in string, number or as a list.
 * @example set1 = attrib.Set (entities, name, value)
 */
export function Set(__model__: GIModel, entities: TId|TId[], name: string, value: TAttribDataTypes): void {
    if (!Array.isArray(entities)) {
        const [ent_type_str, index]: [EEntityTypeStr, number] = idBreak(entities as TId);
        __model__.attribs.add.setAttribValue(ent_type_str, index, name, value);
    } else {
        (entities as TId[]).map( entity => Set(__model__, entity, name, value));
    }
}
// Promote modelling operation
export enum EPromoteMethod {
    MEAN =  'mean',
    MIN  =  'min',
    MAX = 'max',
    NONE = 'none'
}
// Promote modelling operation
export enum EPromoteAttribTypes {
    POSIS =  'positions',
    VERTS  =  'vertices',
    EDGES = 'edges',
    WIRES = 'wires',
    FACES = 'faces',
    COLLS = 'collections'
}
/**
 * Promotes or demotes an attribute from one geometry level to another.
 * @param __model__
 * @param name Attribute name to be promoted or demoted.
 * @param from Positions, vertices, edges, wires, faces or collections.
 * @param to Positions, vertices, edges, wires, faces or collections.
 * @param method Maximum, minimum, average, mode, median, sum, sum of squares, root mean square, first match or last match.
 * @returns List of attributes.
 * @example attribpro1 = attrib.Promote (colour, positions, faces, sum)
 */
export function Promote(__model__: GIModel, name: string, from: EPromoteAttribTypes, to: EPromoteAttribTypes, method: EPromoteMethod): TId[] {
    throw new Error("Not implemented.");
}
/**
 * Gets the xyz coordinates of any geometry
 * @param __model__
 * @param positions List of one or more positions.
 * @returns List of one or more sets of coordinates.
 * @example coord1 = attrib.GetCoordinates ([position1, position2])
 * @example_info Expected result could be [[1,2,3],[4,5,6]].
 */
export function GetXyz(__model__: GIModel, positions: TId|TId[]): Txyz|Txyz[] {
    if (!Array.isArray(positions)) {
        const [ent_type_str, index]: [EEntityTypeStr, number] = idBreak(positions as TId);
        return __model__.attribs.query.getAttribValue(ent_type_str, EAttribNames.COORDS, index) as Txyz;
    } else {
        return (positions as TId[]).map( position => GetXyz(__model__, position)) as Txyz[];
    }
}
/**
 * Sets attribute value.
 * @param __model__
 * @param positions List of one or more positions.
 * @param xyz List of three values.
 * @returns Shifted position.
 * @example newposition = attrib.SetXyz (position1, [0,0,1])
 * @example_info Coordinates of position1 are changed to [0,0,1]. All geometry referring to position1 alters accordingly.
 */
export function SetXyz(__model__: GIModel, positions: TId|TId[], xyz: Txyz): void {
    if (!Array.isArray(positions)) {
        const [ent_type_str, index]: [EEntityTypeStr, number] = idBreak(positions as TId);
        __model__.attribs.add.setAttribValue(ent_type_str, index,  EAttribNames.COORDS, xyz);
    } else {
        (positions as TId[]).map( position => SetXyz(__model__, position, xyz));
    }
}
