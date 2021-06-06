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
        ["WhileStatement"],
        ["VariableDeclaration"],
        ["FunctionDeclaration"],
        ["Block"],
        ["BreakStatement"],
        ["ContinueStatement"],
        ["FunctionDeclaration"],
    ],
    FunctionDeclaration : [
        ["function", "Identifier", "(", ")", "{", "StatementList", "}"]
    ],
    BreakStatement: [
        ["break", ";"]
    ],
    ContinueStatement: [
        ["continue", ";"]
    ],
    Block: [
        ["{", "StatementList", "}"],
        ["{", "}"]
    ],
    IfStatement: [
        ["if", "(", "Expression", ")", "Statement"],
    ],
    WhileStatement: [
        ["while", "(", "Expression", ")", "Statement"],
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
        ["AssignmentExpression"]
    ],
    AssignmentExpression: [
        ["LeftHandSideExpression", "=", "LogicalORExpression"],
        ["LogicalORExpression"]
    ],
    LogicalORExpression: [
        ["LogicalANDExpression"],
        ["LogicalORExpression", "||", "LogicalANDExpression"],
    ],
    LogicalANDExpression: [
        ["AdditiveExpression"],
        ["LogicalANDExpreesion", "&&", "AdditiveExpression"],
    ],
    AdditiveExpression: [
        ["MultiplicativeExpression"],
        ["AdditiveExpression", "+", "MultiplicativeExpression"],
        ["AdditiveExpression", "-", "MultiplicativeExpression"],
    ],
    MultiplicativeExpression: [
        // 最基础的表达式的内容
        ["LeftHandSideExpression"],
        ["MultiplicativeExpression", "*", "LeftHandSideExpression"],
        ["MultiplicativeExpression", "/", "LeftHandSideExpression"],
    ],
    LeftHandSideExpression: [
        ["CallExpression"],
        ["NewExpression"],
    ],
    CallExpression: [
        ["MemberExpression", "Arguments"],
        ["CallExpression", "Arguments"],
    ], // new a()
    Arguments: [
        ["(", ")"],
        ["(", "ArgumentList", ")"]
    ],
    ArgumentList: [
        ["AssignmentExpression"],
        ["ArgumentList", ",", "AssignmentExpression"]
    ],
    NewExpression: [
        ["new", "NewExpression"],
        ["MemberExpression"],
    ], // new a
    MemberExpression: [
        ["PrimaryExpression"],
        ["PrimaryExpression", ".", "Identifier"],
        ["PrimaryExpression", ".", "[", "Expression", "]"],
    ], // new a.b()
    PrimaryExpression: [
        ["(", "Expression", ")"],
        ["Number"],
        ["Literal"],
        ["Identifier"],
    ],
    // 字面量
    Literal: [
        ["NumericLiteral"],
        ["StringLiteral"],
        ["BooleanLiteral"],
        ["NullLiteral"],
        ["RegularExpressionLiteral"],
        ["ObjectLiteral"],
        ["ArrayLiteral"],
    ],
    ObjectLiteral: [
        ["{", "PropertyList", "}"]
    ],
    PropertyList: [
        ["Property"],
        ["PropertyList", ",", "Property"],
    ],
    Property: [
        ["StringLiteral", ":", "AdditiveExpression"],
        ["Identifier", ":", "AdditiveExpression"],
    ]
}

let hash = {

}

function closure(state) {
    hash[JSON.stringify(state)] = state;
    let queue = [];
    for (let symbol in state) {
        if (symbol.match(/^\$/)) {
            continue;
        }
        queue.push(symbol);
    }
    while (queue.length) {
        let symbol = queue.shift();

        // console.log(symbol);
        if (syntax[symbol]) {
            for (let rule of syntax[symbol]) {
                console.log(rule);
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


export function parse(source) {

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



/////////////////


// let source = `
//     a;
// `

// let tree = parse(source);

// console.log(evaluate(tree));

// window.js = {
//     evaluate,
//     parse,
// }