
class XRegExp {
    constructor(source, flag, root = "root") {
        this.table = new Map();
        this.regexp = new RegExp(this.compileRegExp(source, root, 0).source, flag);
        // console.log(this.regexp);
        // console.log(this.table);
    }

    compileRegExp(source, name, start) {
        if (source[name] instanceof RegExp) {
            return {
                source: source[name].source,
                // length: start
                length: 0
            };
        }

        let length = 0;
        let regexp = source[name].replace(/\<([^>]+)\>/g, (str, $1) => {
            this.table.set(start + length, $1);
            // this.table.set($1, start + length);

            ++length;

            let r = this.compileRegExp(source, $1, start + length);

            length += r.length;
            return "(" + r.source + ")";
        });
        return {
            source: regexp,
            length: length
        }
    }

    exec(string) {
        let r = this.regexp.exec(string);

        for (let i = 1; i < r.length; i++) {
            // 这里的逻辑是什么意思？
            if (r[i] !== void 0) {
                r[this.table.get(i - 1)] = r[i];
                // console.log(this.table.get(i - 1));
            }
        }

        // console.log(JSON.stringify(r[0]));
        return r;
    }

    get lastIndex() {
        return this.regexp.lastIndex;
    }

    set lastIndex(value) {
        return this.regexp.lastIndex = value;
    }


}
export function* scan(str) {
    let regexp = new XRegExp({
        InputElement: "<Whitespace>|<LineTerminator>|<Comments>|<Token>",
        Whitespace: / /,
        LineTerminator: /\n/,
        Comments: /\/\*(?:[^*]|\*[^\/])*\*\/|\/\/[^\n]*/,
        Token: "<Literal>|<Keywords>|<Identifier>|<Punctuator>",
        Literal: "<NumericLiteral>|<BooleanLiterial>|<StringLiterial>|<NullLiterial>",
        NumericLiteral: /(?:[1-9][0-9]*|0)(?:\.[0-9]*)?|\.[0-9]+/,
        BooleanLiterial: /true|false/,
        StringLiterial: /\"(?:[^"\n]|\\[\s\S])*\"|\'(?:[^'\n]|\\[\s\S])*\'/,
        NullLiterial: /null/,
        Identifier: /[a-zA-Z_$][a-zA-Z0-9_$]*/,
        Keywords: /if|else|for|function|var|let/,
        Punctuator: /\+|\,|\?|\:|\{|\}|\.|\(|\=|\<|\+\+|\=\=|\=\>|\*|\)|\[|\]|;/
    }, "g", "InputElement");

    while (regexp.lastIndex < str.length) {
        let r = regexp.exec(str);

        if (r.Whitespace) {

        } else if (r.LineTerminator) {
            // 这里不应该写，会影响自动插入分号

        } else if (r.Comments) {

        } else if (r.NumericLiteral) {
            yield {
                type: "NumericLiteral",
                value: r[0]
            }
        } else if (r.BooleanLiterial) {
            yield {
                type: "BooleanLiterial",
                value: r[0]
            }

        } else if (r.StringLiterial) {
            yield {
                type: "StringLiterial",
                value: r[0]
            }
        } else if (r.NullLiterial) {
            yield {
                type: "NullLiterial",
                value: null
            }
        } else if (r.Identifier) {
            yield {
                type: "Identifier",
                name: r[0]
            }
        } else if (r.Keywords) {
            yield {
                type: r[0],
            }
        } else if (r.Punctuator) {
            yield {
                type: r[0],
            }
        } else {
            throw new Error("unexpected token " + r[0]);
        }

        // yield r;

        if (!r[0].length) {
            break;
        }
    }
    yield {
        type: "EOF"
    }
}

// let source = (`
//     for (let i = 0; i < 3; i++) {
//         for (let j = 0; j < 3; j++) {
//             let cell = document.createElement("div");
//             cell.classList.add("cell");
//             cell.innerText = pattern[i * 3 + j] === 2 ? "❌" :
//                 pattern[i * 3 + i] === 1 ? "⭕" : "";
//             cell.addEventListener("click", () => userMove(j, i));
//             board.appendChild(cell);
//         }
//         board.appendChild(document.createElement("br"));
//     }
// `)

// for (let element of scan(source)) {
//     console.log(element);
// }