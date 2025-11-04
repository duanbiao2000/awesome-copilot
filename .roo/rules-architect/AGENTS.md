# Project Architecture Rules (Non-Obvious Only)

- The project is a static documentation generator. There is no database or backend server.
- The architecture is centered around the `DocGenerator` class, which is responsible for reading, parsing, and generating documentation.
- The use of "collections" is a key architectural pattern that allows for flexible grouping of content.
