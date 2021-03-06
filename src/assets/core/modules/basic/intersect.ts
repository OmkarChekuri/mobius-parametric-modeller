/**
 * The `intersect` module has functions for calculating intersections between different types of entities.
 */

/**
 *
 */

import { TId, Txyz, EEntType, TPlane, TRay, TEntTypeIdx, TBBox } from '@libs/geo-info/common';
import { checkArgTypes, checkIDs, TypeCheckObj, IDcheckObj } from '../_check_args';
import { GIModel } from '@libs/geo-info/GIModel';
import { getArrDepth } from '@libs/geo-info/id';
import { vecCross} from '@libs/geom/vectors';
import { _normal } from './calc';
import * as THREE from 'three';

// ================================================================================================
/**
 * Calculates the xyz intersection between a ray or a plane and a list of entities.
 * ~
 * For a ray, the intersection between the ray and one or more faces is return.
 * The intersection between each face triangle and the ray is caclulated.
 * This ignores the intersections between rays and edges (including polyline edges).
 * ~
 * For a plane, the intersection between the plane and one or more edges is returned.
 * This ignores the intersections between planes and face triangles (including polygon faces).
 * ~
 * @param __model__
 * @param ray A ray.
 * @param entities List of entities.
 * @return A list of xyz intersection coordinates.
 * @example coords = virtual.Intersect(plane, polyline1)
 * @example_info Returns a list of coordinates where the plane intersects with polyline1.
 */
export function RayFace(__model__: GIModel, ray: TRay, entities: TId|TId[]): Txyz[] {
    // --- Error Check ---
    const fn_name = 'intersect.RayFace';
    checkArgTypes(fn_name, 'ray', ray, [TypeCheckObj.isRay]);
    const ents_arr: TEntTypeIdx|TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList],
        [EEntType.FACE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[];
    // --- Error Check ---
    // create the threejs entity and calc intersections
    const ray_tjs: THREE.Ray = new THREE.Ray(new THREE.Vector3(...ray[0]), new THREE.Vector3(...ray[1]));
    return _intersectRay(__model__, ents_arr, ray_tjs);
}
function _intersectRay(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[], ray_tjs: THREE.Ray): Txyz[] {
    if (getArrDepth(ents_arr) === 1) {
        const [ent_type, index]: [EEntType, number] = ents_arr as TEntTypeIdx;
        const posis_i: number[] = __model__.geom.nav.navAnyToPosi(ent_type, index);
        const posis_tjs: THREE.Vector3[] = [];
        for (const posi_i of posis_i) {
            const xyz: Txyz = __model__.attribs.query.getPosiCoords(posi_i);
            const posi_tjs: THREE.Vector3 = new THREE.Vector3(...xyz);
            posis_tjs[posi_i] = posi_tjs;
        }
        const isect_xyzs: Txyz[] = [];
        // triangles
        const tris_i: number[] = __model__.geom.nav.navAnyToTri(ent_type, index);
        for (const tri_i of tris_i) {
            const tri_posis_i: number[] = __model__.geom.nav.navAnyToPosi(EEntType.TRI, tri_i);
            const tri_posis_tjs: THREE.Vector3[] = tri_posis_i.map(tri_posi_i => posis_tjs[tri_posi_i]);
            const isect_tjs: THREE.Vector3 = new THREE.Vector3();
            const result: THREE.Vector3 = ray_tjs.intersectTriangle(tri_posis_tjs[0], tri_posis_tjs[1], tri_posis_tjs[2], false, isect_tjs);
            if (result !== undefined && result !== null) {
                isect_xyzs.push([isect_tjs.x, isect_tjs.y, isect_tjs.z]);
            }
        }
        // return the intersection xyzs
        return isect_xyzs;
    } else {
        const all_isect_xyzs: Txyz[] = [];
        for (const ent_arr of ents_arr) {
            const isect_xyzs: Txyz[] = _intersectRay(__model__, ent_arr as TEntTypeIdx, ray_tjs);
            for (const isect_xyz  of isect_xyzs) {
                all_isect_xyzs.push(isect_xyz);
            }
        }
        return all_isect_xyzs as Txyz[];
    }
}
// ================================================================================================
/**
 * Calculates the xyz intersection between a ray or a plane and a list of entities.
 * ~
 * For a ray, the intersection between the ray and one or more faces is return.
 * The intersection between each face triangle and the ray is caclulated.
 * This ignores the intersections between rays and edges (including polyline edges).
 * ~
 * For a plane, the intersection between the plane and one or more edges is returned.
 * This ignores the intersections between planes and face triangles (including polygon faces).
 * ~
 * @param __model__
 * @param plane A plane.
 * @param entities List of entities.
 * @return A list of xyz intersection coordinates.
 * @example coords = virtual.Intersect(plane, polyline1)
 * @example_info Returns a list of coordinates where the plane intersects with polyline1.
 */
export function PlaneEdge(__model__: GIModel, plane: TRay|TPlane, entities: TId|TId[]): Txyz[] {
    // --- Error Check ---
    const fn_name = 'intersect.PlaneEdge';
    checkArgTypes(fn_name, 'plane', plane, [TypeCheckObj.isPlane]);
    const ents_arr: TEntTypeIdx|TEntTypeIdx[] = checkIDs(fn_name, 'entities', entities,
        [IDcheckObj.isID, IDcheckObj.isIDList],
        [EEntType.EDGE, EEntType.WIRE, EEntType.FACE, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx|TEntTypeIdx[];
    // --- Error Check ---
    // create the threejs entity and calc intersections
    const plane_normal: Txyz = vecCross(plane[1], plane[2]);
    const plane_tjs: THREE.Plane = new THREE.Plane();
    plane_tjs.setFromNormalAndCoplanarPoint( new THREE.Vector3(...plane_normal), new THREE.Vector3(...plane[0]) );
    return _intersectPlane(__model__, ents_arr, plane_tjs);
}
function _intersectPlane(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[], plane_tjs: THREE.Plane): Txyz[] {
    if (getArrDepth(ents_arr) === 1) {
        const [ent_type, index]: [EEntType, number] = ents_arr as TEntTypeIdx;
        const isect_xyzs: Txyz[] = [];
        const wires_i: number[] = __model__.geom.nav.navAnyToWire(ent_type, index);
        for (const wire_i of wires_i) {
            const wire_posis_i: number[] = __model__.geom.nav.navAnyToPosi(EEntType.WIRE, wire_i);
            // create threejs posis for all posis
            const posis_tjs: THREE.Vector3[] = [];
            for (const wire_posi_i of wire_posis_i) {
                const xyz: Txyz = __model__.attribs.query.getPosiCoords(wire_posi_i);
                const posi_tjs: THREE.Vector3 = new THREE.Vector3(...xyz);
                posis_tjs.push(posi_tjs);
            }
            if (__model__.geom.query.isWireClosed(wire_i)) {
                posis_tjs.push(posis_tjs[0]);
            }
            // for each pair of posis, create a threejs line and do the intersect
            for (let i = 0; i < posis_tjs.length - 1; i++) {
                const line_tjs: THREE.Line3 = new THREE.Line3(posis_tjs[i], posis_tjs[i + 1]);
                const isect_tjs: THREE.Vector3 = new THREE.Vector3();
                const result: THREE.Vector3 = plane_tjs.intersectLine(line_tjs, isect_tjs);
                if (result !== undefined && result !== null) {
                    isect_xyzs.push([isect_tjs.x, isect_tjs.y, isect_tjs.z]);
                }
            }
        }
        return isect_xyzs;
    } else {
        const all_isect_xyzs: Txyz[] = [];
        for (const ent_arr of ents_arr) {
            const isect_xyzs: Txyz[] = _intersectPlane(__model__, ent_arr as TEntTypeIdx, plane_tjs);
            for (const isect_xyz  of isect_xyzs) {
                all_isect_xyzs.push(isect_xyz);
            }
        }
        return all_isect_xyzs as Txyz[];
    }
}
