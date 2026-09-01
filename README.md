# Hazel's Kitchen
Hazel's Kitchen is a Nuxt recipe site with Vue 3 and TypeScript. It is built without the help of AI/LLMs as an exercise for the developer.

# Setup
`npm i` to install packages and dependencies

`npm run dev` to run a development server

`npm run generate` to generate static HTML for all pages (SSG)

`npm run build` to create a production build (SSR)


# Principles
This project follows a few rules to keep code readable, maintainable, and efficient:
- Apply readability rules from Clean Code by Robert C. Martin.
    - Variable and function names should convey intent.
    - Verbosity is better than code you can't understand.
    - Functions should be small reusable. A given function should encapsulate a single idea or piece of logic.
    - Comment any logic that isn't immediately understandable by looking at the code, once again with the aim of conveying intent.
- Prioritize `undefined` instead of empty strings, zeros, and objects. This makes it easier to check for missing values instead of just falsy ones.
    - The exception to this rule is arrays. Empty arrays are used instead of `undefined` or `null` because mapping functions and loops can run safely on them. Truthiness checks should be on the array's `length` property.
- Use `null` in JSON, and `undefined` in objects and classes. Use the nullish coalescing operator `??` to convert between them as needed.
- Be explicit with types. TypeScript may infer types for many properties and functions, but in the interest of readability (especially in older IDEs and text editors), types should be written out when they can't be immediately inferred, either by TypeScript OR the developer.