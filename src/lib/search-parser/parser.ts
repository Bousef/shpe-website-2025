import { tokenize } from "./tokenizer";
import type { Token } from "./tokens";
import { UnaryNode, BinaryNode, type Node, PrimaryNode, ErrorNode, FieldNode, GroupNode } from "./nodes";
import type { PgColumn } from "drizzle-orm/pg-core";

type Parser = {
    current: number;
    tokens: Token[];
    match: PgColumn[];
    columns: Record<string, PgColumn>;
}

export function parseSearchQuery(query: string, match: PgColumn[], columns: Record<string, PgColumn>): Node[] {
    const parser: Parser = {
        current: 0,
        tokens: tokenize(query),
        match,
        columns,
    }

    console.log("Tokens:", parser.tokens);
    
    const result: Node[] = [];
    
    while (!isAtEnd(parser)) {
        result.push(parseExpression(parser));
        console.log("parsed expression:", result[result.length - 1]);
    }

    return result;
}

function parseExpression(parser: Parser): Node {
    return parseBinaryExpression(parser);
}

function parseBinaryExpression(parser: Parser): Node {
    const left = parseParenthesis(parser);

    if (match(parser, 'or')) {
        const operator = advance(parser);
        const right = parseExpression(parser);
        
        return new BinaryNode(operator.value as 'or', left, right);
    }

    return left;
}

function parseParenthesis(parser: Parser): Node {
    if (match(parser, 'leftParen')) {
        advance(parser);
        const nodes: Node[] = [];

        while (!match(parser, 'rightParen') && !isAtEnd(parser)) {
            const node = parseExpression(parser);
            nodes.push(node);
        }

        advance(parser);
        return new GroupNode(nodes);
    }

    return parseUnaryExpression(parser);
}

function parseUnaryExpression(parser: Parser): Node {
    if (match(parser, 'exclude')) {
        const operator = advance(parser);
        const operand = parseUnaryExpression(parser);
        
        return new UnaryNode(operator.value as 'exclude', operand);
    }

    if (peek_foward(parser, 1)?.type === 'colon') {
        const fieldToken = parsePrimaryExpression(parser) as PrimaryNode;

        advance(parser); // consume the colon token

        const valueToken = parsePrimaryExpression(parser) as PrimaryNode;

        return new FieldNode(fieldToken?.value, valueToken, parser.columns);
    }

    return parsePrimaryExpression(parser);
}

function parsePrimaryExpression(parser: Parser): Node {
    const token = peek(parser);

    if (!token) return new ErrorNode("Unexpected EOF");

    if (match(parser, 'phrase') || match(parser, 'plain')) {
        const token = advance(parser);
        return new PrimaryNode(token.value, parser.match);
    }

    const bad = advance(parser);    
    return new ErrorNode(`Unexpected token: ${bad.value}`);
}

function match(parser: Parser, type: string): boolean {
    if (isAtEnd(parser)) {
        return false;
    }
    return parser.tokens[parser.current]!.type === type;
}

function peek(parser: Parser): Token | null {
    if (isAtEnd(parser)) {
        return null;
    }
    return parser.tokens[parser.current]!;
}

function advance(parser: Parser): Token {
    if (!isAtEnd(parser)) {
        ++parser.current;
    }

    return previous(parser)!;
}

function previous(parser: Parser): Token | null  {
    if(parser.current == 0) return parser.tokens[parser.current] ?? null;

    return parser.tokens[parser.current - 1] ?? null;
}

function isAtEnd(parser: Parser): boolean {
    return parser.current >= parser.tokens.length;
}

function peek_foward(parser: Parser, offset: number): Token | null {
    const index = parser.current + offset;
    if (index >= parser.tokens.length) {
        return null;
    }
    return parser.tokens[index]!;
}