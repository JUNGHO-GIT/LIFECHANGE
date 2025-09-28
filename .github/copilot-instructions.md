# AI Coding Agent Instructions (LIFECHANGE)

# IMPORTANT 2

0. The most important thing to keep in mind is to reduce unnecessary memory waste and leaks, and maximize performance and efficiency.
1. When writing new code or modifying existing code, keep the following highlights in mind
2. Please reply in "Korean" unless requested in English.
3. Never change comments in the code I send, even if they are simple "-----" lines.
4. Use "JUST ONE SPACE" around assignment operators (ex. '=' or ':') and avoid more than one spacing for alignment.
5. Never break a line before a semicolon.
6. Always use line breaks and indentation in parentheses, square brackets, etc.
7. When rewriting, avoid using 'if' statements whenever possible and use symbols like the ternary operator or '&&' instead.
8. When modifying existing code, revise all 'if' statements to use the ternary operator or symbols like '&&' for brevity.
9. Nevertheless, only in the absolutely unavoidable case where you must use an 'if' conditional statement, follow these guidelines:

9-1. All if statements must use braces { } and proper line breaks/indentation, especially when they contain return statements.
9-2. Never write "if" statements on a single line. Always use braces { } even for single-line statements.
9-3. Use "}\n\telse {" or "}\n\telse if {" or "}\n\tcatch {" instead of "}else{" or "}else if {" or "}catch{".
9-4. Convert all single-line if statements like "if (condition) return value;" to:"if (condition) {\n\treturn value;\n}"