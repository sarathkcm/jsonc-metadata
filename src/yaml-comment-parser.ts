
import yaml from "js-yaml";
export function yamlCommentParser(lines: string[]): any {
    try {
        const trimmedComment = lines.join("\n").trim();
        if (!trimmedComment) { return undefined; }
        if (trimmedComment.startsWith('/*')) {
            const extractedCommentText = trimmedComment
                .split("\n")
                .map(l => l.substring(l.indexOf('*') + 1))
                .join("\n")
                .replace(/\**\/$/gi, '');
            return yaml.safeLoad(extractedCommentText);
        }
        else if (trimmedComment.startsWith('//')) {
            const extractedCommentText = trimmedComment
                .split("\n")
                .map(l => l.substring(l.indexOf('//') + 2))
                .join("\n");
            return yaml.safeLoad(extractedCommentText);
        }
        throw new Error("Unsupported comment format");
    } catch (error) {
        return lines.join('\n').trim();
    }
}
