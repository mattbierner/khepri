define(["require", "exports", "nu-stream/stream", "nu-stream/gen", "ecma-ast/token", "ecma-ast/node"], (function(
    require, exports, stream, gen, token, node) {
    "use strict";
    var unparse, slice = Array.prototype.slice,
        join = (function(arr, joiner) {
            if ((arr.length === 0)) return stream.end;
            else if ((arr.length === 1)) return arr[0];
            else return stream.append(arr[0], stream.cons(joiner, join(arr.slice(1), joiner)));
        }),
        joins = (function(arr, joiner) {
            if ((arr.length === 0)) return stream.end;
            else if ((arr.length === 1)) return arr[0];
            else return stream.append(arr[0], stream.append(joiner, joins(arr.slice(1), joiner)));
        }),
        keyword = (function(x) {
            return new(token.KeywordToken)(null, x);
        }),
        lineTerminator = (function(x) {
            return new(token.LineTerminatorToken)(null, (x || "\n"));
        }),
        punctuator = (function(x) {
            return new(token.PunctuatorToken)(null, x);
        }),
        whitespace = (function(x) {
            return new(token.WhitespaceToken)(null, (x || " "));
        }),
        seq = (function() {
            var args = arguments;
            if ((args.length === 0)) return stream.end;
            var first = args[0],
                rest = seq.apply(undefined, slice.call(args, 1));
            if (((first === undefined) || stream.isEmpty(first))) return rest;
            else if (stream.isStream(first)) return stream.append(first, rest);
            else return stream.cons(first, rest);
        }),
        statement = (function() {
            var args = arguments;
            return seq(seq.apply(undefined, args), lineTerminator());
        }),
        expression = (function() {
            var args = arguments;
            return seq.apply(undefined, args);
        }),
        declaration = (function() {
            var args = arguments;
            return seq.apply(undefined, args);
        }),
        clause = (function() {
            var args = arguments;
            return seq(seq.apply(undefined, args), lineTerminator());
        }),
        value = (function() {
            var args = arguments;
            return seq.apply(undefined, args);
        }),
        identifier = (function(name) {
            return value(new(token.IdentifierToken)(null, name));
        }),
        string = (function(x) {
            return value(new(token.StringToken)(null, x));
        }),
        number = (function(x) {
            return value(new(token.NumberToken)(null, x));
        }),
        nil = (function(x) {
            return value(new(token.NullToken)(null, x));
        }),
        boolean = (function(x) {
            return value(new(token.BooleanToken)(null, x));
        }),
        regexp = (function(x) {
            return value(new(token.RegularExpressionToken)(null, x));
        }),
        program = (function(body) {
            return seq.apply(undefined, body);
        }),
        variableDeclaration = (function(declarations) {
            return statement(keyword("var"), whitespace(), join(declarations, punctuator(",")), punctuator(
                ";"));
        }),
        variableDeclarator = (function(id, init) {
            return declaration(id, (init ? seq(whitespace(), punctuator("="), whitespace(), init) : stream.end));
        }),
        functionExpression = (function(id, params, body) {
            return expression(punctuator("("), keyword("function"), (id ? seq(whitespace(), id) : stream.end),
                punctuator("("), joins(params, seq(punctuator(","), whitespace())), punctuator(")"),
                whitespace(), body, punctuator(")"));
        }),
        functionDeclaration = (function(id, params, body) {
            return declaration(keyword("function"), whitespace(), punctuator("("), joins(params, seq(
                punctuator(","), whitespace())), punctuator(")"), whitespace(), body);
        }),
        switchCase = (function(test, consequent) {
            return seq((test ? seq(keyword("case"), whitespace(), test) : keyword("default")), punctuator(
                ":"), lineTerminator(), seq.apply(undefined, consequent));
        }),
        catchClause = (function(param, body) {
            return seq(keyword("catch"), punctuator("("), param, punctuator(")"), body);
        }),
        emptyStatement = (function() {
            return statement(punctuator(";"));
        }),
        debuggerStatement = (function() {
            return statement(keyword("debugger"), punctuator(";"));
        }),
        blockStatement = (function(body) {
            return statement(punctuator("{"), lineTerminator(), seq.apply(undefined, body), punctuator("}"));
        }),
        expressionStatement = (function(expression) {
            return statement(expression, punctuator(";"));
        }),
        ifStatement = (function(test, consequent, alternate) {
            return statement(keyword("if"), whitespace(), punctuator("("), test, punctuator(")"),
                consequent, (!alternate ? stream.end : seq(keyword("else"), whitespace(), alternate)));
        }),
        labeledStatement = (function(label, body) {
            return statement(identifier(label), punctuator(":"), body);
        }),
        breakStatement = (function(label) {
            return statement(keyword("break"), whitespace(), label, punctuator(";"));
        }),
        continueStatement = (function(label) {
            return statement(keyword("continue"), whitespace(), label, punctuator(";"));
        }),
        withStatement = (function(obj, body) {
            return statement(keyword("with"), punctuator("("), obj, punctuator(")"), punctuator("{"), body,
                punctuator("}"));
        }),
        switchStatement = (function(discriminant, cases) {
            return statement(keyword("switch"), punctuator("("), discriminant, punctuator(")"), punctuator(
                "{"), lineTerminator(), seq.apply(undefined, cases), punctuator("}"));
        }),
        returnStatement = (function(argument) {
            return statement(keyword("return"), whitespace(), argument, punctuator(";"));
        }),
        throwStatement = (function(argument) {
            return statement(keyword("throw"), whitespace(), argument, punctuator(";"));
        }),
        tryStatement = (function(block, handler, finalizer) {
            return statement(keyword("try"), block, (handler ? handler : stream.end), (finalizer ? seq(
                keyword("finally"), finalizer) : stream.end));
        }),
        whileStatement = (function(test, body) {
            return statement(keyword("while"), punctuator("("), test, punctuator(")"), body);
        }),
        doWhileStatement = (function(body, test) {
            return statement(keyword("do"), body, keyword("while"), punctuator("("), test, punctuator(")"),
                punctuator(";"));
        }),
        forDeclarationStatement = (function(init, test, update, body) {
            return statement(keyword("for"), punctuator("("), init, whitespace(), test, punctuator(";"),
                update, punctuator(")"), body);
        }),
        forStatement = (function(init, test, update, body) {
            return statement(keyword("for"), punctuator("("), init, punctuator(";"), test, punctuator(";"),
                update, punctuator(")"), body);
        }),
        forInStatement = (function(left, right) {
            return statement(keyword("for"), punctuator("("), node.left, punctuator("in"), node.right,
                punctuator(")"), node.body);
        }),
        thisExpression = (function() {
            return expression(keyword("this"));
        }),
        sequenceExpression = (function(expressions) {
            return expression(join(expressions, punctuator(",")));
        }),
        unaryExpression = (function(op, arg) {
            return expression(punctuator("("), op, whitespace(), arg, punctuator(")"));
        }),
        binaryExpression = (function(op, left, right) {
            return expression(punctuator("("), left, whitespace(), op, whitespace(), right, punctuator(")"));
        }),
        updateExpression = (function(op, arg, prefix) {
            return (prefix ? expression(op, arg) : expression(arg, op));
        }),
        conditionalExpression = (function(test, consequent, alternate) {
            return expression(punctuator("("), test, whitespace(), punctuator("?"), whitespace(),
                consequent, whitespace(), punctuator(":"), whitespace(), alternate, punctuator(")"));
        }),
        newExpression = (function(callee, args) {
            return expression(keyword("new"), whitespace(), punctuator("("), callee, punctuator(")"), (args ?
                seq(punctuator("("), joins(args, seq(punctuator(","), whitespace())), punctuator(")")) :
                stream.end));
        }),
        callExpression = (function(callee, args) {
            return expression(callee, punctuator("("), joins(args, seq(punctuator(","), whitespace())),
                punctuator(")"));
        }),
        memberExpression = (function(obj, property, computed) {
            return (computed ? expression(obj, punctuator("["), property, punctuator("]")) : expression(obj,
                punctuator("."), property));
        }),
        arrayExpression = (function(elements) {
            return expression(punctuator("["), joins(elements, seq(punctuator(","), whitespace())),
                punctuator("]"));
        }),
        objectExpression = (function(props) {
            return expression(punctuator("("), punctuator("{"), ((props && props.length) ? seq(
                lineTerminator(), joins(props, seq(punctuator(","), lineTerminator())),
                lineTerminator()) : stream.end), punctuator("}"), punctuator(")"));
        }),
        objectGetExpression = (function(key, body) {
            return seq(identifier("get"), whitespace(), key, punctuator("("), punctuator(")"), whitespace(),
                body);
        }),
        objectSetExpression = (function(key, params, body) {
            return seq(identifier("set"), whitespace(), key, punctuator("("), seq.apply(undefined, params),
                punctuator(")"), whitespace(), body);
        }),
        objectValueExpression = (function(key, value) {
            return seq(key, punctuator(":"), whitespace(), value);
        }),
        _unparse = (function(node) {
            if (!node) return stream.end;
            switch (node.type) {
                case "SwitchCase":
                    return switchCase((node.test ? _unparse(node.test) : null), node.consequent.map(
                        _unparse));
                case "CatchClause":
                    return catchClause(_unparse(node.param), _unparse(node.body));
                case "EmptyStatement":
                    return emptyStatement();
                case "DebuggerStatement":
                    return debuggerStatement();
                case "BlockStatement":
                    return blockStatement(node.body.map(_unparse));
                case "ExpressionStatement":
                    return expressionStatement(_unparse(node.expression));
                case "IfStatement":
                    return ifStatement(_unparse(node.test), _unparse(node.consequent), (node.alternate ?
                        _unparse(node.alternate) : null));
                case "LabeledStatement":
                    return labeledStatement(_unparse(node.label), _unparse(node.body));
                case "BreakStatement":
                    return breakStatement(_unparse(node.label));
                case "ContinueStatement":
                    return continueStatement(_unparse(node.label));
                case "WithStatement":
                    return withStatement(_unparse(node.object), _unparse(node.body));
                case "SwitchStatement":
                    return switchStatement(_unparse(node.discriminant), node.cases.map(_unparse));
                case "ReturnStatement":
                    return returnStatement(_unparse(node.argument));
                case "ThrowStatement":
                    return throwStatement(_unparse(node.argument));
                case "TryStatement":
                    return tryStatement(_unparse(node.block), (node.handler ? _unparse(node.handler) : null), (
                        node.finalizer ? _unparse(node.finalizer) : null));
                case "WhileStatement":
                    return whileStatement(_unparse(node.test), _unparse(node.body));
                case "DoWhileStatement":
                    return doWhileStatement(_unparse(node.body), _unparse(node.test));
                case "ForStatement":
                    var init = (node.init ? _unparse(node.init) : null);
                    var test = (node.test ? _unparse(node.test) : null);
                    var update = (node.update ? _unparse(node.update) : null);
                    var body = _unparse(node.body);
                    return ((node.init && (node.init.type === "VariableDeclaration")) ?
                        forDeclarationStatement(init, test, update, body) : forStatement(init, test, update,
                            body));
                case "ForInStatement":
                    return forInStatement(_unparse(node.left), _unparse(node.right), _unparse(node.body));
                case "ThisExpression":
                    return thisExpression();
                case "SequenceExpression":
                    return sequenceExpression(node.expressions.map(_unparse));
                case "UnaryExpression":
                    return unaryExpression(punctuator(node.operator), _unparse(node.argument));
                case "BinaryExpression":
                case "LogicalExpression":
                case "AssignmentExpression":
                    return binaryExpression(punctuator(node.operator), _unparse(node.left), _unparse(node.right));
                case "UpdateExpression":
                    return updateExpression(punctuator(node.operator), _unparse(node.argument), node.prefix);
                case "ConditionalExpression":
                    return conditionalExpression(_unparse(node.test), _unparse(node.consequent), _unparse(
                        node.alternate));
                case "NewExpression":
                    return newExpression(_unparse(node.callee), (node.args ? node.args.map(_unparse) : null));
                case "CallExpression":
                    return callExpression(_unparse(node.callee), node.args.map(_unparse));
                case "MemberExpression":
                    return memberExpression(_unparse(node.object), _unparse(node.property), node.computed);
                case "ArrayExpression":
                    return arrayExpression(node.elements.map(_unparse));
                case "ObjectExpression":
                    return objectExpression(node.properties.map(_unparse));
                case "ObjectValue":
                    return objectValueExpression(_unparse(node.key), _unparse(node.value));
                case "ObjectGetter":
                    return objectGetExpression(_unparse(node.key), _unparse(node.value.body));
                case "ObjectSetter":
                    return objectSetExpression(_unparse(node.key), node.value.params.map(_unparse),
                        _unparse(node.value.body));
                case "FunctionExpression":
                    return functionExpression((node.id ? _unparse(node.id) : null), node.params.map(
                        _unparse), _unparse(node.body));
                case "FunctionDeclaration":
                    return functionDeclaration(_unparse(node.id), node.params.map(_unparse), _unparse(node.body));
                case "Program":
                    return program(node.body.map(_unparse));
                case "VariableDeclaration":
                    return variableDeclaration(node.declarations.map(_unparse));
                case "VariableDeclarator":
                    return variableDeclarator(_unparse(node.id), (node.init ? _unparse(node.init) : null));
                case "Identifier":
                    return identifier(node.name);
                case "Literal":
                    switch (node.kind) {
                        case "string":
                            return string(node.value);
                        case "number":
                            return number(node.value);
                        case "null":
                            return nil(node.value);
                        case "boolean":
                            return boolean(node.value);
                        case "regexp":
                            return regexp(node.value);
                        default:
                            return stream.end;
                    }
                default:
                    return stream.end;
            }
        });
    (unparse = _unparse);
    (exports.unparse = unparse);
}));