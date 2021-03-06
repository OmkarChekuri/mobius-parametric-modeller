import { EEntType, TTri, TEdge, TWire, TFace, IGeomArrays, Txyz, TColl, TVert, Txy } from './common';
import { GIGeom } from './GIGeom';
import { arrRem, arrIdxAdd } from '../util/arrs';
import { vecDot } from '../geom/vectors';

/**
 * Class for geometry.
 */
export class GIGeomModify {
    private _geom: GIGeom;
    private _geom_arrays: IGeomArrays;
    /**
     * Constructor
     */
    constructor(geom: GIGeom, geom_arrays: IGeomArrays) {
        this._geom = geom;
        this._geom_arrays = geom_arrays;
    }
    // ============================================================================
    // Modify geometry
    // ============================================================================
    /**
     * Insert a vertex into an edge and updates the wire with the new edge
     * ~
     * Applies to both plines and pgons.
     * ~
     * Plines can be open or closed.
     * ~
     */
    public insertVertIntoWire(edge_i: number, posi_i: number): number {
        const wire_i: number = this._geom.nav.navEdgeToWire(edge_i);
        const wire: TWire = this._geom_arrays.dn_wires_edges[wire_i];
        const old_edge_verts_i: TEdge = this._geom_arrays.dn_edges_verts[edge_i];
        const old_and_prev_edge_i: number[] = this._geom_arrays.up_verts_edges[old_edge_verts_i[0]];
        const old_and_next_edge_i: number[] = this._geom_arrays.up_verts_edges[old_edge_verts_i[1]];
        // check prev edge
        if (old_and_prev_edge_i.length === 2) {
            if (old_and_prev_edge_i[0] === edge_i) {
                throw new Error('Edges are in wrong order');
            }
        }
        // check next edge amd save the next edge
        if (old_and_next_edge_i.length === 2) {
            if (old_and_next_edge_i[1] === edge_i) {
                throw new Error('Edges are in wrong order');
            }
            this._geom_arrays.up_verts_edges[old_edge_verts_i[1]] = [old_and_next_edge_i[1]];
        } else {
            this._geom_arrays.up_verts_edges[old_edge_verts_i[1]] = [];
        }
        // create one new vertex and one new edge
        const new_vert_i: number = this._geom.add._addVertex(posi_i);
        this._geom_arrays.up_verts_edges[new_vert_i] = [edge_i];
        const new_edge_i: number = this._geom.add._addEdge(new_vert_i, old_edge_verts_i[1]);
        // update the down arrays
        old_edge_verts_i[1] = new_vert_i;
        wire.splice(wire.indexOf(edge_i), 1, edge_i, new_edge_i);
        // update the up arrays for edges to wires
        this._geom_arrays.up_edges_wires[new_edge_i] = wire_i;
        // return the new edge
        return new_edge_i;
    }
    /**
     * Replace all positions in an entity with a new set of positions.
     * ~
     */
    public replacePosis(ent_type: EEntType, ent_i: number, new_posis_i: number[]): void {
        const old_posis_i: number[] = this._geom.nav.navAnyToPosi(ent_type, ent_i);
        if (old_posis_i.length !== new_posis_i.length) {
            throw new Error('Replacing positions operation failed due to incorrect number of positions.');
        }
        const old_posis_i_map: Map<number, number> = new Map(); // old_posi_i -> index
        for (let i = 0; i < old_posis_i.length; i++) {
            const old_posi_i: number = old_posis_i[i];
            old_posis_i_map[old_posi_i] = i;
        }
        const verts_i: number[] = this._geom.nav.navAnyToVert(ent_type, ent_i);
        for (const vert_i of verts_i) {
            const old_posi_i: number = this._geom.nav.navVertToPosi(vert_i);
            const i: number = old_posis_i_map[old_posi_i];
            const new_posi_i: number = new_posis_i[i];
            // set the down array
            this._geom_arrays.dn_verts_posis[vert_i] = new_posi_i;
            // update the up arrays for the old posi, i.e. remove this vert
            arrRem(this._geom_arrays.up_posis_verts[old_posi_i], vert_i);
            // update the up arrays for the new posi, i.e. add this vert
            this._geom_arrays.up_posis_verts[new_posi_i].push(vert_i);
        }
    }
    /**
     * Unweld the vertices on naked edges.
     * ~
     */
    public unweldVertsShallow(verts_i: number[]): number[] {
        // create a map, for each posi_i, count how many verts there are in the input verts
        const exist_posis_i_map: Map<number, number> = new Map(); // posi_i -> count
        for (const vert_i of verts_i) {
            const posi_i: number = this._geom.nav.navVertToPosi(vert_i);
            if (!exist_posis_i_map.has(posi_i)) {
                exist_posis_i_map.set(posi_i, 0);
            }
            const vert_count: number = exist_posis_i_map.get(posi_i);
            exist_posis_i_map.set(posi_i, vert_count + 1);
        }
        // copy positions on the perimeter and make a map
        const old_to_new_posis_i_map: Map<number, number> = new Map();
        exist_posis_i_map.forEach( (vert_count, old_posi_i) => {
            const all_old_verts_i: number[] = this._geom.nav.navPosiToVert(old_posi_i);
            const all_vert_count: number = all_old_verts_i.length;
            if (vert_count !== all_vert_count) {
                if (!old_to_new_posis_i_map.has(old_posi_i)) {
                    const new_posi_i: number = this._geom.add.copyPosis(old_posi_i, true) as number;
                    old_to_new_posis_i_map.set(old_posi_i, new_posi_i);
                }
            }
        });
        // now go through the geom again and rewire to the new posis
        for (const vert_i of verts_i) {
            const old_posi_i: number = this._geom.nav.navVertToPosi(vert_i);
            if (old_to_new_posis_i_map.has(old_posi_i)) {
                const new_posi_i: number = old_to_new_posis_i_map.get(old_posi_i);
                // update the down arrays
                this._geom_arrays.dn_verts_posis[vert_i] = new_posi_i;
                // update the up arrays for the old posi, i.e. remove this vert
                arrRem(this._geom_arrays.up_posis_verts[old_posi_i], vert_i);
                // update the up arrays for the new posi, i.e. add this vert
                this._geom_arrays.up_posis_verts[new_posi_i].push(vert_i);
            }
        }
        // return all the new positions
        return Array.from(old_to_new_posis_i_map.values());
    }
    /**
     * Unweld all vertices by cloning the positions that are shared.
     * ~
     * Attributes on the positions are copied.
     * ~
     * @param verts_i
     */
    public cloneVertPositions(verts_i: number[]): number[] {
        const new_posis_i: number[] = [];
        for (const vert_i of verts_i) {
            const exist_posi_i: number = this._geom.nav.navVertToPosi(vert_i);
            const all_verts_i: number[] = this._geom.nav.navPosiToVert(exist_posi_i);
            const all_verts_count: number = all_verts_i.length;
            if (all_verts_count > 1) {
                const new_posi_i: number = this._geom.add.copyPosis(exist_posi_i, true) as number;
                // update the down arrays
                this._geom_arrays.dn_verts_posis[vert_i] = new_posi_i;
                // update the up arrays for the old posi, i.e. remove this vert
                arrRem(this._geom_arrays.up_posis_verts[exist_posi_i], vert_i);
                // update the up arrays for the new posi, i.e. add this vert
                this._geom_arrays.up_posis_verts[new_posi_i].push(vert_i);
                // add the new posi_i to the list, to be returned later
                new_posis_i.push(new_posi_i);
            }
        }
        // return all the new positions
        return new_posis_i;
    }
    /**
     * Weld all vertices by merging the positions that are equal, so that they become shared.
     * ~
     * The old positions are deleted if unused. Attributes on those positions are discarded.
     * ~
     * @param verts_i
     */
    public mergeVertPositions(verts_i: number[]): number {
        // get a list of unique posis to merge
        // at the same time, make a sparse array vert_i -> posi_i
        const map_posis_to_merge_i: Map<number, number[]> = new Map();
        const vert_i_to_posi_i: number[] = []; // sparese array
        for (const vert_i of verts_i) {
            const exist_posi_i: number = this._geom.nav.navVertToPosi(vert_i);
            vert_i_to_posi_i[vert_i] = exist_posi_i;
            if (!map_posis_to_merge_i.has(exist_posi_i)) {
                map_posis_to_merge_i.set(exist_posi_i, []);
            }
            map_posis_to_merge_i.get(exist_posi_i).push(vert_i);
        }
        // calculate the new xyz
        // at the same time make a list of posis to del
        const posis_to_del_i: number[] = [];
        const new_xyz: Txyz = [0, 0, 0];
        for (const [exist_posi_i, merge_verts_i] of Array.from(map_posis_to_merge_i)) {
            const posi_xyz: Txyz = this._geom.model.attribs.query.getPosiCoords(exist_posi_i);
            new_xyz[0] += posi_xyz[0];
            new_xyz[1] += posi_xyz[1];
            new_xyz[2] += posi_xyz[2];
            const all_verts_i: number[] = this._geom.nav.navPosiToVert(exist_posi_i);
            const all_verts_count: number = all_verts_i.length;
            if (all_verts_count === merge_verts_i.length) {
                posis_to_del_i.push(exist_posi_i);
            }
        }
        // make the new posi
        const num_posis: number = map_posis_to_merge_i.size;
        new_xyz[0] = new_xyz[0] / num_posis;
        new_xyz[1] = new_xyz[1] / num_posis;
        new_xyz[2] = new_xyz[2] / num_posis;
        const new_posi_i: number = this._geom.add.addPosi() as number;
        this._geom.model.attribs.add.setPosiCoords(new_posi_i, new_xyz);
        // replace the verts posi
        for (const vert_i of verts_i) {
            // update the down arrays
            this._geom_arrays.dn_verts_posis[vert_i] = new_posi_i;
            // update the up arrays for the old posi, i.e. remove this vert
            arrRem(this._geom_arrays.up_posis_verts[vert_i_to_posi_i[vert_i]], vert_i);
            // update the up arrays for the new posi, i.e. add this vert
            this._geom_arrays.up_posis_verts[new_posi_i].push(vert_i);
        }
        // del the posis that are no longer used, i.e. have zero verts
        this._geom.del.delPosis(posis_to_del_i);
        // return all the new positions
        return new_posi_i;
    }
    /**
     * Reverse the edges of a wire.
     * This lists the edges in reverse order, and flips each edge.
     * ~
     * The attributes will not be affected. So the order of edge attribtes will also become reversed.
     */
    public reverse(wire_i: number): void {
        const wire: TWire = this._geom_arrays.dn_wires_edges[wire_i];
        wire.reverse();
        // reverse the edges
        for (const edge_i of wire) {
            const edge: TEdge = this._geom_arrays.dn_edges_verts[edge_i];
            edge.reverse();
            // the verts pointing up to edges also need to be reversed
            const edges_i: number[] = this._geom_arrays.up_verts_edges[edge[0]];
            edges_i.reverse();
        }
        // if this is the first wire in a face, reverse the triangles
        const face_i: number = this._geom_arrays.up_wires_faces[wire_i];
        if (face_i !== undefined) {
            const face: TFace = this._geom_arrays.dn_faces_wirestris[face_i];
            if (face[0][0] === wire_i) {
                for (const tri_i of face[1]) {
                    const tri: TTri = this._geom_arrays.dn_tris_verts[tri_i];
                    tri.reverse();
                }
            }
        }
    }
    /**
     * Shifts the edges of a wire.
     * ~
     * The attributes will not be affected. For example, lets say a polygon has three edges
     * e1, e2, e3, with attribute values 5, 6, 7
     * If teh edges are shifted by 1, the edges will now be
     * e2, e3, e1, withh attribute values 6, 7, 5
     */
    public shift(wire_i: number, offset: number): void {
        const wire: TWire = this._geom_arrays.dn_wires_edges[wire_i];
        wire.unshift.apply( wire, wire.splice( offset, wire.length ) );
    }

}
