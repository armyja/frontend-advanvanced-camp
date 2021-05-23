import { scan } from "./LexParser.js";

let syntax = {
    Program: [["StatementList", "EOF"]],
    StatementList: [
        ["Statement"],        // relationship : or
        ["StatementList", "Statement"]
    ],
    Statement: [
        ["ExpressionStatement"],
        ["IfStatement"],
        ["VariableDeclaration"],
        ["FunctionDeclaration"],
    ],
    IfStatement: [
        ["if", "(", "Expression", ")", "Statement"],
    ],
    VariableDeclaration: [
        ["var", "Identifier", ";"],
        ["let", "Identifier", ";"], // add
    ],
    FunctionDeclaration: [
        ["function", "Identifier", "(", ")", "{", "StatementList", "}"],
    ],
    ExpressionStatement: [
        ["Expression", ";"]
    ],
    Expression: [
        ["AdditiveExpression"]
    ],
    AdditiveExpression: [
        ["MultiplicativeExpression"],
        ["AdditiveExpression", "+", "MultiplicativeExpression"],
        ["AdditiveExpression", "-", "MultiplicativeExpression"],
    ],
    MultiplicativeExpression: [
        // 最基础的表达式的内容
        ["PrimaryExpression"],
        ["MultiplicativeExpression", "*", "MultiplicativeExpression"],
        ["MultiplicativeExpression", "/", "MultiplicativeExpression"],
    ],
    PrimaryExpression: [
        ["(", "Expression", ")"],
        ["Number"],
        ["Literal"],
        ["Identifier"],
    ],
    // 字面量
    Literal: [
        ["Number"],
        ["NumericLiteral"],
        ["String"],
        ["Boolean"],
        ["Null"],
        ["RegularExpression"],
    ]
}

let hash = {

}

function closure(state) {
    hash[JSON.stringify(state)] = state;
    let queue = [];
    for (let symbol in state) {
        queue.push(symbol);
    }
    while (queue.length) {
        let symbol = queue.shift();

        // console.log(symbol);
        if (syntax[symbol]) {
            for (let rule of syntax[symbol]) {
                if (!state[rule[0]]) {
                    queue.push(rule[0]) // why push rule[0], first char
                }
                let current = state;
                // state[rule[0]] = true;
                for (let part of rule) {
                    if (!current[part]) {
                        current[part] = {}
                    }
                    current = current[part]; // ?
                }
                current.$reduceType = symbol;
                current.$reduceLength = rule.length;
            }
        }
    }
    for (let symbol in state) {
        console.log(symbol)
        if (symbol.match(/^\$/)) {
            continue;
        }
        if (hash[JSON.stringify(state[symbol])]) {
            state[symbol] = hash[JSON.stringify(state[symbol])];
        } else {
            closure(state[symbol]);
        }
    }
}

let end = {
    $isEnd: true
}

let start = {
    "Program": end
}

closure(start);


function parse(source) {

    let stack = [start];
    let symbolStack = [];

    function reduce() {
        let state = stack[stack.length - 1];

        if (state.$reduceType) {
            let children = [];
            for (let i = 0; i < state.$reduceLength; i++) {
                stack.pop();
                children.push(symbolStack.pop());
            }
            // create a non-terminal symbol and shift it
            return {
                type: state.$reduceType,
                children: children.reverse()
            };
        } else {
            throw new Error("unexpected token");
        }
    }

    function shift(symbol) {
        let state = stack[stack.length - 1];

        if (symbol.type in state) {
            stack.push(state[symbol.type]);
            symbolStack.push(symbol);
            // state = state[symbol.type];
        } else {
            /* reduce to non-terminal symbols */
            shift(reduce());
            shift(symbol);
        }
    }

    for (let symbol /* terminal symbol */ of scan(source)) {
        shift(symbol);
        // console.log(symbol);
    }

    return reduce();

}

let evaluator = {
    Program(node) {
        return evaluate(node.children[0]);
    },
    StatementList(node) {
        if (node.children.length === 1) {
            return evaluate(node.children[0]);
        } else {
            evaluate(node.children[0]);
            return evaluate(node.children[1]);
        }
        console.log(node);
    },
    Statement(node) {
        return evaluate(node.children[0]);
    },
    VariableDeclaration(node) {
        console.log("Declare variable", node.children[1].name);
    },
    EOF() {
        return null;
    }
}

function evaluate(node) {
    if (evaluator[node.type]) {
        return evaluator[node.type](node);
    }
}

/////////////////


let source = `
    var a;
    var b;
    a + 1;
`

let tree = parse(source);

evaluate(tree);