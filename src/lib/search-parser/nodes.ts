import { ilike, not, or, and, gte, lte, eq, gt, lt, type SQL } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

export abstract class Node {
  abstract toSQL(): SQL<boolean> | undefined;
}

export class ErrorNode extends Node {
    constructor(public message: string) {
        super();
    }

    toSQL(): SQL<boolean> | undefined {
        console.error(this.message);
        return undefined; // No SQL to return for error nodes
    }
}

export class GroupNode extends Node {
    constructor(public nodes: Node[]) {
        super();
    }
    
    toSQL(): SQL<boolean> | undefined {
        const sqls = this.nodes.map(node => node.toSQL()).filter((sql): sql is SQL<boolean> => sql !== undefined);
        if (sqls.length === 0) return undefined;
        return and(...sqls) as SQL<boolean>;
    }
}

export class FieldNode extends Node {
    constructor(public field: string, public value: string, public columns: Record<string, PgColumn>) {
    super();
  }

    toSQL(): SQL<boolean> | undefined {
        const column = this.columns[this.field];
        if (!column) return undefined; // ignore unknown fields

        if (this.value.includes('..')) {
            const [start, end] = this.value.split('..').map(Number);
            return and(gte(column, start), lte(column, end)) as SQL<boolean>;
        }

        if (this.value.startsWith('>')) {
            return gt(column, Number(this.value.slice(1))) as SQL<boolean>;
        }

        if (this.value.startsWith('<')) {
            return lt(column, Number(this.value.slice(1))) as SQL<boolean>;
        }

        return eq(column, isNaN(+this.value) ? this.value : Number(this.value)) as SQL<boolean>;
    }
}

export class PrimaryNode extends Node {
    constructor(public value: string, public match: PgColumn[]) {
        super();
    }

    toSQL(): SQL<boolean> | undefined {
        const pattern = `%${this.value}%`;

        const filter = [];

        for (const match of this.match) {
            filter.push(ilike(match, pattern));
        }

        return or(...filter) as SQL<boolean>;
    }
}

export class UnaryNode extends Node {
    constructor(public operator: 'exclude', public operand: Node) {
        super();
    }

    toSQL(): SQL<boolean> | undefined {
        const operandSQL = this.operand.toSQL();
        if (!operandSQL) return undefined;
        return not(operandSQL) as SQL<boolean>;
    }
}

export class BinaryNode extends Node  {
    constructor(public operator: 'or', public left: Node, public right: Node) {
        super();
    }

    toSQL(): SQL<boolean> | undefined {
        return or(this.left.toSQL(), this.right.toSQL()) as SQL<boolean>;
    }
}