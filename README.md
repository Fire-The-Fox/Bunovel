# Bunovel
Bunovel is a connection of 2 words: Bun and Novel. Bunovel is a Visual Novel engine written in bun for creating visual novel games with ease and fun.
# Guidelines
Because this engine doesn't provide own language, you code in js/ts and thus you <ins>must</ins> follow them <br>

1. Only one `Engine` instance per scene! Others won't work
2. Only one `Scene` instance per scene! Other won't work
3. <ins>no variables</ins> <ins>outside</ins> engine's state
4. <ins>no control logic</ins> <ins>outside</ins> engine or `actions`
5. As in 1. rule, <ins>no `character` data</ins> <ins>outside</ins> `character`
6. Every `action`, event **must return** value
7. Every <ins>changed value</ins> during action execution <ins>must be returned</ins>, otherwise the engine cannot confirm changes and will crash!
8. Every `action` <ins>must not throw any error</ins>! and <ins>if something does, use **try**/**catch** </ins>
9. If you do not follow of any of these guidelines, things **will break**!
