# House at different position

If you execute the program, you’ll notice that the mini-house is not drawn anymore in the middle of the screen, but in the left part.

This is because the variable `x` is reassigned with value before the drawing begins.

> Remember: The computer executes your program line by line, from top to bottom. Therefore even if `x` is initially assigned with `400`, that value changes to `100` when the line `x = 100;` is reached.
