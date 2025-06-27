import type { Token } from "./tokens";

type Tokenizer = {
    tokens: Token[];
    query: string;
    current: number;
    start: number;
}

export function tokenize(query: string): Token[] {
    const tokenizer: Tokenizer = {
        tokens: [],
        query,
        current: 0,
        start: 0,
    }

    while (!isAtEnd(tokenizer)) {
        tokenizer.start = tokenizer.current;

        scanToken(tokenizer);
    }

    return tokenizer.tokens;
}

function scanToken(tokenizer: Tokenizer): void {
    const char = tokenizer.query[tokenizer.current];

    switch (char) {
        case '"':
            advance(tokenizer);
            scanQuotedString(tokenizer);
            break;
        case ' ':
        case '\t':
        case '\n':
            advance(tokenizer);
            break;
        case '|':
            tokenizer.tokens.push({ type: 'or', value: '|' });
            advance(tokenizer);
            break;
        case '-':
            tokenizer.tokens.push({ type: 'exclude', value: '-' });
            advance(tokenizer);
            break;
        case '(':
            tokenizer.tokens.push({ type: 'leftParen', value: '(' });
            advance(tokenizer);
            break;
        case ')':
            tokenizer.tokens.push({ type: 'rightParen', value: ')' });
            advance(tokenizer);
            break;
        default:
            scanPlainToken(tokenizer);
    }
}

function scanQuotedString(tokenizer: Tokenizer): void {
    const start = tokenizer.current;
    
    while(peek(tokenizer) != "\"" && !isAtEnd(tokenizer)) {
        advance(tokenizer);
    }

    if(!match(tokenizer, "\"")) {
        tokenizer.current = start; // Reset to start if no closing quote found
        while (!isAtEnd(tokenizer) && peek(tokenizer) !== ' ') {
            advance(tokenizer);
        }
    }

    addToken(tokenizer, 'phrase', String(tokenizer.query.slice(tokenizer.start + 1, tokenizer.current - 1)));
}

function scanPlainToken(tokenizer: Tokenizer): void {
    while (!isAtEnd(tokenizer) && ![' ', '|', '-', '"', ')'].includes(peek(tokenizer))) {
        advance(tokenizer);
    }

    const tokenValue = tokenizer.query.slice(tokenizer.start, tokenizer.current);

    if (tokenValue.includes(':')) {
        const [fieldName, ...rest] = tokenValue.split(':');
        const value = rest.join(':'); // in case of things like `title:New:World`
        tokenizer.tokens.push({ type: 'field', field: fieldName ?? "", value });
        return;
    } 

    addToken(tokenizer, 'plain', String(tokenValue));
}

function isAtEnd(tokenizer: Tokenizer): boolean {
    return tokenizer.current >= tokenizer.query.length;
}

function advance(tokenizer: Tokenizer): string {
    if (isAtEnd(tokenizer)) {
        return ''; // Return empty string if at end
    }

    const character = tokenizer.query[tokenizer.current];
    tokenizer.current++;
    return character!;
}

function peek(tokenizer: Tokenizer): string {
    if (isAtEnd(tokenizer)) {
        return ''; // Return empty string if at end
    }
    return tokenizer.query[tokenizer.current]!;
}

function match(tokenizer: Tokenizer, expected: string): boolean {
    if (isAtEnd(tokenizer) || tokenizer.query[tokenizer.current] !== expected) {
        return false;
    }

    advance(tokenizer);

    return true;
}

function addToken(tokenizer: Tokenizer, type: string, value: string): void {
    tokenizer.tokens.push({ type: type as 'phrase' | 'or' | 'exclude', value });
}