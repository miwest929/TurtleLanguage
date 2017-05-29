# Introduction  

This project aims to provide a natural speech interface to the Turtle Graphics platform. The spoken
dialect is a subset of the Turtle Graphics language (LOGO programming language). The dialect
is designed to be efficiently spoken while still maintaining the same expressive power as the
original programming language.

```
Please note that in order to run this locally you must register for a Google API token.
Then in recognize.js replace <key> with your actual API key.
```

Run:
  - ruby recognize.rb
  - python -m SimpleHTTPServer
  
  
# Language Specification

## Commands
- `FORWARD`
- `COLOR`
- `UNDO`
- `ROTATE`
- `DOWN`
- `UP`
- `HOME`
- `CIRCLE`
- `WIDTH`
- `GOTO`
- `POLYGON`
- `LEFT`
- `RIGHT`

# Future Additions
- Support following commands:
  - `REPEAT <number> DO <command> <command> END`
  - `REPEAT LAST <number>`
  - `DEFINE <identifier> WITH <arg> DO <command> <command> END`
    - `<identifier>` must be part of NATO-phonetic alphabet (ex: `alpha`, `beta`, etc.)
    - `<arg>` must be `<step>`, or `<angle>`. More specification to come
  - `CALL <identifier> WITH <arg-value>`
  
# References
- http://abz.inf.ethz.ch/wp-content/uploads/unterrichtsmaterialien/primarschulen/logo_heft_en.pdf
- https://people.eecs.berkeley.edu/~bh/pdf/v1ch10.pdf
- https://en.wikipedia.org/wiki/L-system
- https://pdfs.semanticscholar.org/e98c/414cc4cb7b5fd54f82f33f49d35dbb28df56.pdf
