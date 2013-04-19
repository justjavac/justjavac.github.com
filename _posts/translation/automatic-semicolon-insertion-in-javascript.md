---
layout: post
title: 「译」JavaScript 中的自动分号插入（ASI）
keywords: javascript,ASI
category : javascript
tags : [javascript, ASI]
---

原文：[Automatic semicolon insertion in JavaScript](http://www.2ality.com/2011/05/semicolon-insertion.html)

译文：[「译」JavaScript 中的自动分号插入（ASI）](http://justjavac.com/javascript/2013/04/24/automatic-semicolon-insertion-in-javascript.html)

译者：

----------------------------------------------------

In JavaScript, automatic semicolon insertion allows one to omit a semicolon at the end of a line. 
While you always should write semicolons, knowing how JavaScript handles their omission is important knowledge, 
because it helps you understand code without semicolons and because it has effects even in code with semicolons.

## 1. Background: JavaScript syntax

First, a few syntactic phenomena need to be explained that are relevant for the remainder of this post.

## Expression versus statement:

* Expression: everything that becomes a value when evaluated. Examples:

        3 * Math.sqrt(x)
        i++
        obj.prop
        [ "a", "b", "c" ]
        { first: "Jane", last: "Doe" }
        function() {} // function expression


* Statement: everything that “does something”. A program is always a sequence of statements. Examples:

        for(var i=0; i<3; i++) {
            console.log(i);
        }
        function twice(x) { // function declaration
            return 2 * x;
        }
        var foo = twice(21); // assignment

Note that the right hand side of the assignment is an expression.

**Statements that have to be terminated by a semicolon**: 
Every statement in JavaScript is terminated by a semicolon, except the following ones.

* Loops: `for`, `while` (not `do-while`)
* Branching: `if`, `switch`, `try`
* Function declarations (not function expressions)

Example: `while` versus `do-while`

    while(a > 0) {
        a--;
    } // no semicolon
    
    do {
        a--;
    } while(a > 0);

Example: function declaration versus function expression.

    function foo() {
    } // no semicolon
    
    var foo = function() {
    };

Note: if you do add a semicolon after the above mentioned statements, you do not get a syntax error, 
because it is considered an empty statement (see below).

**The empty statement**. A semicolon on its own is an empty statement and does nothing. 
Empty statements can appear anywhere a statement is expected. 
They are useful in situations where a statement is demanded, but not needed. 
In such situations, blocks are usually also allowed, but an empty block is longer than a semicolon. 

Example: The following two statements are equivalent.


    while(processNextItem() > 0);
    while(processNextItem() > 0) {}

The function processNextItem is assumed to return the number of remaining items. 
The following program is also syntactically correct: three empty statements.

    ;;;

**Expressions as statements**. Any expression can become a statement. 
Then it has to be terminated by a semicolon. 

Example:

    "hello world";
    a + b;
    sum(5, 3);
    a++;

All of the above are expression statements. 
The first two have no effect.

## 2. The rules of automatic semicolon insertion (ASI)

"Semicolon insertion" is just a term. 
It does not necessarily mean that actual semicolons are inserted into the source code during parsing. 
Instead, it is a nice metaphor for explaining when semicolons are optional.

**The norm**: The parser treats every new token as part of the current statement, unless there is a semicolon that terminates it. 
The following examples show code where you might think a semicolon should be inserted, but isn’t. 
This illustrates the risks of omitting semicolons.

No ASI:

    a = b + c
    (d + e).print()

This does not trigger ASI, because the opening parenthesis could follow c in a function call. 
The above is thus interpreted as:

    a = b + c(d + e).print();

No ASI:

    a = b
    /hi/g.exec(c).map(d);

No semicolon is inserted, the second line is not interpreted as a regular expression literal. 
Instead, the above is equivalent to:

    a = b / hi / g.exec(c).map(d);        

No ASI:

    var foo = "bar"
    [ "red", "green" ].foreach(function(c) { console.log(c) })

No semicolon is inserted. Instead, the beginning of the second line is interpreted as an index for the string "bar"; 
the comma is allowed due to the comma operator 
(which evaluates both its left-hand side and its right-hand side and returns its right-hand side).

No ASI: In many browsers, the code below assigns 0 to func, 
because a++ is interpreted as the argument of an invocation of the function in the previous line.

    var a = 0;
    var func = function(x) { return x }
    (a++)

**Exceptions to the norm**: ASI is applied in the following cases.

*   **Newline plus illegal token**: If a newline is encountered and followed by a token that cannot be added to the current statement, 
a semicolon is inserted.

    Example:

        if (a < 0) a = 0
        console.log(a)

    This triggers ASI and becomes

        if (a < 0) a = 0;
        console.log(a);

*   **Forbidden LineTerminators**: The following syntactic constructs forbid a newline (“LineTerminator”) at a certain position. 
    If there is a newline at that position, a semicolon is inserted. 
    The ECMAScript standard calls the grammar rules below restricted productions.

        PostfixExpression
            LeftHandSideExpression [no LineTerminator here] ++
            LeftHandSideExpression [no LineTerminator here] --
        ContinueStatement
            continue [no LineTerminator here] Identifier? ;
        BreakStatement
            break [no LineTerminator here] Identifier? ;
        ReturnStatement
            return [no LineTerminator here] Expression? ;
        ThrowStatement
            throw [no LineTerminator here] Expression? ;

    For PostfixExpression, the rationale is avoiding the modification of a value on the previous line. 
    For continue, break, return and throw, the rationale is that if they are used without an argument, 
    they should not refer to the next line if one forgets a semicolon.

    Example:

        a
        ++
        c

    Triggers ASI and becomes

        a;
        ++
        c

    Example:

        return
        a + b

    Triggers ASI and becomes

        return;
        a + b;

    Example by Crockford:

        return
        {
          ok: false;
        };

    Triggers ASI and is interpreted as an empty return statement, followed by a block (with the label ok and the expression statement false), 
    followed by an empty statement (after the closing brace). 
    Thus, if you want to return an object literal, do it as follows.

        return {
          ok: false;
        };


*   **Last statements in blocks and programs**: Missing semicolons are added before a closing brace and at the end of a program. 
    The following example would be syntactically incorrect without ASI.

        function add(a,b) { return a+b }

    ASI turns this code into

        function add(a,b) { return a+b; }

    **Cases where ASI is not performed**

*   **Head of for loop**: Semicolons are not inserted inside the head of a for loop. 
    This is obvious, because inserted (line-terminating) semicolons are different from the (argument-separating) head semicolons.

*   **Causing empty statements**: Semicolons are not inserted if they would be parsed as empty statements. 

    Example:

        if (a > b)
        else c = d

    Normally, ASI would be triggered, because else cannot follow the if head. 
    However, adding a semicolon after the head would create an empty statement and is thus not done. 
    Accordingly, the above code causes a syntax error. 
    However, if one manually inserts a semicolon, the result is syntactically correct.

        if (a > b);
        else c = b

    Note that this rule is not necessary in the following example, where there is no danger of ASI, 
    because the opening brace can follow the if head.

        if (a > b)
        {
            c = a
        }

## 3. Recommendations

* Always add semicolons and avoid the headaches of semicolon insertion, at least for your own code. 
Yes, you will have to type more. But for me, semicolons increase the readability of code, because I’m so used to them.

* Don’t put postfix ++ (or postfix --) and its operand in separate lines.

* If the following statements have an argument, don’t put it in a separate line: return, throw, break, continue.

* For consistency (with return), if an opening brace or bracket is part of a statement, don’t put it in a separate line.

    var obj = { // don’t move the brace to a new line
        name: "John"
    };
    var arr = [ // don’t move the bracket to a new line
        5, 13, 29
    ];

Compare:

    return {
        name: "John"
    };

## 4. Related reading

1. ECMAScript Language Specification, 5th edition, section 7.9. [Source of this post and of some of the examples.]

2. JavaScript Semicolon Insertion [In-depth coverage, inspiration for the section on empty statements and the ++ example.]

1. [ECMAScript 语言规范，第5版](http://www.ecma-international.org/publications/standards/Ecma-262.htm)，第7.9节。[本文的一些示例来自这本书。]

2. [JavaScript 的分号插入](http://inimino.org/~inimino/blog/javascript_semicolons) [In-depth coverage, inspiration for the section on empty statements and the ++ example.]
