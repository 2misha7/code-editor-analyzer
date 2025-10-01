import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp"; // approximate for C#

export const sampleCode = {
    javascript: "// JavaScript sample code\nfunction hello() {\n  console.log('Hello world');\n}",
    java: "// Java sample code\npublic class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello world\");\n    }\n}",
    python: "# Python sample code\ndef hello():\n    print('Hello world')",
    csharp: "// C# sample code\nusing System;\nclass Program {\n    static void Main() {\n        Console.WriteLine(\"Hello world\");\n    }\n}",
};

export const languageExtensions = {
    javascript: javascript({ jsx: true }),
    java: java(),
    python: python(),
    csharp: cpp(),
};

export const snippets = {
    javascript: [
        { label: "for", type: "keyword", detail: "for loop", apply: "for (let i = 0; i < 10; i++) {\n  \n}" },
        { label: "forof", type: "keyword", detail: "for...of loop", apply: "for (const item of array) {\n  \n}" },
        { label: "while", type: "keyword", detail: "while loop", apply: "while (condition) {\n  \n}" },
        { label: "if", type: "keyword", detail: "if statement", apply: "if (condition) {\n  \n}" },
        { label: "else", type: "keyword", detail: "else statement", apply: "else {\n  \n}" },
        { label: "function", type: "keyword", detail: "function", apply: "function name(params) {\n  \n}" },
        { label: "class", type: "keyword", detail: "class", apply: "class ClassName {\n  constructor() {\n    \n  }\n}" },
        { label: "try", type: "keyword", detail: "try/catch", apply: "try {\n  \n} catch (error) {\n  console.error(error);\n}" },
    ],

    java: [
        { label: "for", type: "keyword", detail: "for loop", apply: "for (int i = 0; i < 10; i++) {\n  \n}" },
        { label: "foreach", type: "keyword", detail: "for-each loop", apply: "for (Type item : collection) {\n  \n}" },
        { label: "while", type: "keyword", detail: "while loop", apply: "while (condition) {\n  \n}" },
        { label: "if", type: "keyword", detail: "if statement", apply: "if (condition) {\n  \n}" },
        { label: "else", type: "keyword", detail: "else statement", apply: "else {\n  \n}" },
        { label: "method", type: "keyword", detail: "method", apply: "public void methodName() {\n  \n}" },
        { label: "class", type: "keyword", detail: "class", apply: "public class ClassName {\n  \n}" },
        { label: "try", type: "keyword", detail: "try/catch", apply: "try {\n  \n} catch (Exception e) {\n  e.printStackTrace();\n}" },
    ],

    python: [
        { label: "for", type: "keyword", detail: "for loop", apply: "for i in range(10):\n    " },
        { label: "while", type: "keyword", detail: "while loop", apply: "while condition:\n    " },
        { label: "if", type: "keyword", detail: "if statement", apply: "if condition:\n    " },
        { label: "elif", type: "keyword", detail: "elif statement", apply: "elif condition:\n    " },
        { label: "else", type: "keyword", detail: "else statement", apply: "else:\n    " },
        { label: "def", type: "keyword", detail: "function", apply: "def function_name(params):\n    " },
        { label: "class", type: "keyword", detail: "class", apply: "class ClassName:\n    def __init__(self):\n        " },
        { label: "try", type: "keyword", detail: "try/except", apply: "try:\n    \nexcept Exception as e:\n    print(e)" },
    ],

    csharp: [
        { label: "for", type: "keyword", detail: "for loop", apply: "for (int i = 0; i < 10; i++) {\n  \n}" },
        { label: "foreach", type: "keyword", detail: "foreach loop", apply: "foreach (var item in collection) {\n  \n}" },
        { label: "while", type: "keyword", detail: "while loop", apply: "while (condition) {\n  \n}" },
        { label: "if", type: "keyword", detail: "if statement", apply: "if (condition) {\n  \n}" },
        { label: "else", type: "keyword", detail: "else statement", apply: "else {\n  \n}" },
        { label: "method", type: "keyword", detail: "method", apply: "void MethodName() {\n  \n}" },
        { label: "class", type: "keyword", detail: "class", apply: "class ClassName {\n  \n}" },
        { label: "try", type: "keyword", detail: "try/catch", apply: "try {\n  \n} catch (Exception e) {\n  Console.WriteLine(e.Message);\n}" },
    ],
};
