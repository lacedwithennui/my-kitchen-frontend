# Hazel's Kitchen
Hazel's Kitchen is a Nuxt recipe site with Vue 3 and TypeScript. It is built without the help of AI/LLMs as an exercise for the developer.

# Setup
`npm i` to install packages and dependencies

`npm run dev` to run a development server

`npm run generate` to generate static HTML for all pages (SSG)

`npm run build` to create a production build (SSR)

# Principles
This project follows a few rules to keep code readable, maintainable, efficient, and performant:
- Never use AI tools, including Agent-based IDEs, generative autocomplete, and standalone LLMs, when writing or reviewing this project.
    - AI writes code with bloat, can't consistently apply styling and readability rules, and doesn't always understand what the developer wants.
    - A main goal of this project is to practice writing production-grade code using only my existing knowledge and publicly-available documentation. Using AI would forefit the learning experience that comes with that, especially because Nuxt and Vue are relatively new to me.
    - In the context of this project, AI code review is considered a shortcut. Instead, create pull requests and review code line-by-line against documentation and industry best practices before committing to `main`.
- Apply readability rules from Clean Code by Robert C. Martin.
    - Variable and function names should convey intent.
    - Verbosity is better than code you can't understand.
    - Functions should be small and reusable. A given function should encapsulate a single idea or piece of logic.
    - Comment any logic that isn't immediately understandable by looking at the code, once again with the aim of conveying intent.
- Prioritize `undefined` instead of empty strings, zeros, and empty objects. This makes it easier to check for missing values instead of just falsy ones.
    - The exception to this rule is arrays. Empty arrays are used instead of `undefined` or `null` because pushing and mapping functions can run safely on them. Truthiness checks should be on the array's `length` property.
- Use `null` in JSON, and `undefined` in objects and classes. Use the nullish coalescing operator `??` to convert between them as needed.
- Be explicit with types. TypeScript may infer types for many properties and functions, but in the interest of readability (especially in older IDEs and text editors), types should be written out when they can't be immediately inferred, either by TypeScript OR the developer.