import { createScanner, parseTree, Node, SyntaxKind } from "jsonc-parser";

export function parse(jsoncText: string, commentParser?: (lines: string[]) => any) {
    const scanner = createScanner(jsoncText);
    const tree = parseTree(jsoncText);

    let offset = 0;
    let len = 0;
    let metadata: any = {};

    function recursiveThroughTree(node: Node, names: string[] = []) {

        if (node.type === "property" && node.children) {
            scanner.setPosition(offset + len)


            const comments = [];

            while (true) {
                if (scanner.scan() === SyntaxKind.EOF) { break; }
                if (scanner.getPosition() >= node.offset) { break; }
                comments.push(scanner.getTokenValue());
            }
            offset = node.offset;
            len = node.length;
            const name = [...names, node.children[0].value].join(".")
            if (name) {
                metadata[name] = (commentParser || defaultParser)(comments);
            }
            recursiveThroughTree(node.children[1], [...names, node.children[0].value])
        }

        if (node.type === "object" && node.children) {
            offset = node.offset;
            len = 0;
            for (const child of node.children) {
                recursiveThroughTree(child, [...names])
            }
        }
    }

    recursiveThroughTree(tree)
    return metadata;
}

function defaultParser(lines: string[]): string[] {
    const allLines = lines.map(
        line => line.replace(/^((\s*\/\/\s*)|(\s*\*\s*)|(\s*\/\*+\s*))/gi, '') // Replace all leading/trailing spaces and comment symbols
            .replace(/\*\/\s*$/, '')
            .trim()
    );

    const splitLines = [];

    for (const line of allLines) {
        for (const sLine of line.split("\n"))
            splitLines.push(sLine);
    }
    return splitLines.map(a => a.trim()).filter(a => a);
}