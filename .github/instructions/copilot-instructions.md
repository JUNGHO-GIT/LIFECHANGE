# ALL_LANGUAGES

1. Priority: reduce memory waste/leaks, maximize performance and efficiency
2. Do not shorten variable/parameter names to extremes (e.g., result => r)
3. Never break a line before a semicolon
4. Never change comments, even simple `----` lines
5. Use JUST ONE SPACE around assignment operators ('=' or ':')
6. ALWAYS use line breaks and indentation after '{' and before '}' for all brackets: '()', '[]', '{}'
7. ONLY when 'if', 'else', 'else if', 'try', 'catch', 'finally' are unavoidable:
  - Must use braces {..} with line breaks and indentation
  - Line break immediately after '{' and before '}'
  - Never write on a single line
  - Format: `}\n\telse {` or `}\n\telse if (condition) {` or `}\n\tcatch (Exception e) {` or `}\n\tfinally {`
* INCORRECT:
    if (condition) { return value; }
    if (condition) return value;
* CORRECT:
    if (condition) {
      return value;
    }
    else {
			doOther();
    }

#  JAVA

0. Follow ALL_LANGUAGES rules
1. Maximum Java version: Java 11
2. The use of unnecessary or grammatically invalid lambda expressions or ternary operators is strictly prohibited.

# JAVASCRIPT / TYPESCRIPT / ETC..

1. Follow ALL_LANGUAGES rules
2. Always use modern ES6+ syntax and latest Web APIs
3. Use arrow function format and add 'fn' prefix (e.g., 'fnFoo')
4. Avoid 'if' statements - use ternary operator or '&&' / '||' instead
5. When modifying code, convert all 'if' statements to ternary or '&&' / '||'