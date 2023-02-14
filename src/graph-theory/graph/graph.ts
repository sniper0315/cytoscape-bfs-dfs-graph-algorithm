import cytoscape, { Core } from 'cytoscape';
import { Parser } from '../parser';
import { Node } from '../tree/tree.interface';
import { GraphData, IEdge, IGraph, IVertex, Visit } from './graph.interface';

/**
 * (1) Implement IGraph interface
 */
export class Graph {
    cy: Core;
    constructor(tree: Node) {
        /**
         * (2) Use Parser interface to parse tree
         */
        let parser = function (...[tree, graph, parent]: Parameters<Parser>): ReturnType<Parser> {
            if (parent === undefined) {
                graph = { vertices: [], edges: [] };
            } else {
                graph?.edges.push({ source: parent.id, target: tree.id });
            }

            graph?.vertices.push({ id: tree.id, name: tree.name });
            tree.children.map((item) => {
                graph = parser(item, graph, tree);
                return graph;
            });

            return graph ?? { vertices: [], edges: [] };
        };
        let graphData: GraphData = { vertices: [], edges: [] };

        graphData = parser(tree, graphData, undefined);
        /**
         * (3) Initialize cytoscape with parsed data
         */
        const nodes = graphData.vertices.map((item) => {
            return {
                data: {
                    id: item.id,
                    label: item.name
                }
            };
        });
        const edges = graphData.edges.map((item) => {
            return {
                data: {
                    source: item.source,
                    target: item.target
                }
            };
        });
        this.cy = cytoscape({
            headless: true,
            elements: { nodes, edges }
        });
    }

    /**
     * (4) Use cytoscape under the hood
     */
    bfs(visit: Visit<IVertex, IEdge>) {
        this.cy.elements().bfs({
            roots: '#A',
            visit: function (v, e, u, i, depth) {
                visit({ id: v.id(), name: '' }, { source: '', target: '' });
            }
        });
    }

    /**
     * (5) Use cytoscape under the hood
     */
    dfs(visit: Visit<IVertex, IEdge>) {
        this.cy.elements().dfs({
            roots: '#A',
            visit: function (v, e, u, i, depth) {
                visit({ id: v.id(), name: '' }, { source: '', target: '' });
            }
        });
    }
}
