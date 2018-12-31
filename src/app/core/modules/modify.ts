import { GIModel } from '@libs/geo-info/GIModel';
import { TId, TPlane, Txyz, EAttribNames, EEntityTypeStr} from '@libs/geo-info/common';
import { isArray } from 'util';
import { idBreak } from '@libs/geo-info/id';
import { vecsAdd } from '@libs/geom/vectors';

/**
 * Set new coordinates of existing position.
 * @param __model__
 * @param position Existing position.
 * @param xyz List of three coordinates.
 * @returns void
 * @example mod.SetPosition(position1, [1,2,3])
 * @example_info position1 will have new coordinates = [1,2,3].
 */
export function SetPositionXyz(__model__: GIModel, position: TId, xyz: Txyz): void {
    const [ent_type_str, index]: [EEntityTypeStr, number] = idBreak(position);
    __model__.attribs.add.setPosiCoords(index, xyz);
}
/**
 * Moves geometry by vector.
 * @param __model__
 * @param geometry Position, vertex, edge, wire, face, point, polyline, polygon, collection.
 * @param vector List of three values.
 * @returns void
 * @example mod.Move(geometry, vector)
 * @example_info Moves geometry by vector.
 */
export function Move(__model__: GIModel, geometry: TId|TId[], vector: Txyz): void {
    if (!isArray(geometry)) {
        geometry = [geometry] as TId[];
    }
    const posis_i: number[] = [];
    for (const geom_id of geometry) {
        const [ent_type_str, index]: [EEntityTypeStr, number] = idBreak(geom_id);
        posis_i.push(...__model__.geom.query.navAnyToPosi(ent_type_str, index));
    }
    const unique_posis_i: number[] = Array.from(new Set(posis_i));
    for (const unique_posi_i of unique_posis_i) {
        const old_xyz: Txyz = __model__.attribs.query.getPosiCoords(unique_posi_i);
        const new_xyz: Txyz = vecsAdd(old_xyz, vector);
        __model__.attribs.add.setPosiCoords(unique_posi_i, new_xyz);
    }
}
/**
 * Rotates geometry on plane by angle.
 * @param __model__
 * @param geometry Vertex, edge, wire, face, plane, position, point, polyline, polygon, collection.
 * @param origin Plane to rotate on.
 * @param angle Angle (in radians).
 * @returns void
 * @example mod.Rotate(geometry, plane1, PI)
 * @example_info Rotates geometry on plane1 by PI (i.e. 180 degrees).
 */
export function Rotate(__model__: GIModel, geometry: TId|TId[], origin: TPlane|TId, angle: number): void {
    throw new Error("Not implemented."); return null;
}
/**
 * Scales geometry on plane by factor.
 * @param __model__
 * @param geometry Vertex, edge, wire, face, plane, position, point, polyline, polygon, collection.
 * @param origin Plane to scale on.
 * @param scale Scale factor.
 * @returns void
 * @example mod.Scale(geometry, plane1, 0.5)
 * @example_info Scales geometry by 0.5 on plane1.
 */
export function Scale(__model__: GIModel, geometry: TId|TId[], origin: TPlane|TId, scale: number): void {
    throw new Error("Not implemented."); return null;
}
/**
 * Mirrors geometry across plane.
 * @param __model__
 * @param geometry Vertex, edge, wire, face, plane, position, point, polyline, polygon, collection.
 * @param plane Plane to mirror across.
 * @returns void
 * @example mod.Mirror(geometry, plane)
 * @example_info Mirrors geometry across the plane.
 */
export function Mirror(__model__: GIModel, geometry: TId|TId[], plane: TPlane): void {
    throw new Error("Not implemented."); return null;
}
/**
 * Transforms geometry from one construction plane to another.
 * @param __model__
 * @param geometry Vertex, edge, wire, face, position, point, polyline, polygon, collection.
 * @param from Plane defining target construction plane.
 * @param to Plane defining destination construction plane.
 * @returns void
 * @example mod.XForm(geometry, plane1, plane2)
 * @example_info Transforms geometry from plane1 to plane2.
 */
export function XForm(__model__: GIModel, geometry: TId|TId[], from: TPlane, to: TPlane): void {
    throw new Error("Not implemented."); return null;
}
/**
 * Reverses direction of objects.
 * @param __model__
 * @param objects polyline, polygon, wire
 * @returns void
 * @example mod.Reverse(plane1)
 * @example_info Flips plane1.
 * @example mod.Reverse(polyline1)
 * @example_info Reverses the order of vertices to reverse the direction of the polyline.
 */
export function Reverse(__model__: GIModel, objects: TId[]): void {
    throw new Error("Not implemented."); return null;
}
/**
 * Welds geometry together.
 * @param __model__
 * @param geometry Vertex, edge, wire, face, position, point, polyline, polygon, collection.
 * @returns void
 * @example mod.Weld([polyline1,polyline2])
 * @example_info Welds both polyline1 and polyline2 together.
 */
export function Weld(__model__: GIModel, geometry: TId[]): void {
    throw new Error("Not implemented."); return null;
}
/**
 * Unweld geometries.
 * @param __model__
 * @param geometry Vertex, edge, wire, face, position, point, polyline, polygon, collection.
 * @returns void
 * @example mod.Unweld(polyline1,polyline2)
 * @example_info Unwelds polyline1 from polyline2.
 */
export function Unweld(__model__: GIModel, geometry: TId|TId[]): void {
    throw new Error("Not implemented."); return null;
}
/**
 * Closes polylines if open.
 * @param __model__
 * @param lines Polyline(s).
 * @returns void
 * @example mod.Close([polyline1,polyline2])
 * @example_info If open, polylines are changed to closed; if closed, nothing happens.
 */
export function Close(__model__: GIModel, lines: TId|TId[]): void {
    if (!isArray(lines)) {
        const [ent_type_str, index]: [EEntityTypeStr, number] = idBreak(lines as TId);
        let wire_i: number = index;
        if (ent_type_str === EEntityTypeStr.PLINE) {
            wire_i = __model__.geom.query.navPlineToWire(index);
        } else if (ent_type_str !== EEntityTypeStr.WIRE) {
            throw new Error('Entity is of wrong type. It must be either a polyline or a wire.');
        }
        __model__.geom.add.closeWire(wire_i);
    } else {
        (lines as TId[]).map(line => Close(__model__, line));
    }
}
/**
 * Checks if polyline(s) or wire(s) are closed.
 * @param __model__
 * @param lines Polyline(s) or wire(s).
 * @returns Boolean or list of boolean in input sequence of lines.
 * @example mod.IsClosed([polyline1,polyline2,polyline3])
 * @example_info Returns list [true,true,false] if polyline1 and polyline2 are closed but polyline3 is open.
 */
export function IsClosed(__model__: GIModel, lines: TId|TId[]): boolean|boolean[] {
    if (!isArray(lines)) {
        const [ent_type_str, index]: [EEntityTypeStr, number] = idBreak(lines as TId);
        let wire_i: number = index;
        if (ent_type_str === EEntityTypeStr.PLINE) {
            wire_i = __model__.geom.query.navPlineToWire(index);
        } else if (ent_type_str !== EEntityTypeStr.WIRE) {
            throw new Error('Entity is of wrong type. It must be either a polyline or a wire.');
        }
        return __model__.geom.query.istWireClosed(wire_i);
    } else {
        return (lines as TId[]).map(line => IsClosed(__model__, line)) as boolean[];
    }
}
/**
 * Deletes geometry.
 * @param __model__
 * @param geometry Position, point, polyline, polygon, collection. Can be a list.
 * @returns void
 * @example mod.Delete(geometry)
 * @example_info Deletes specified geometry from model.
 */
export function Delete(__model__: GIModel, geometry: TId|TId[]  ): void {
    throw new Error("Not implemented."); return null;
}