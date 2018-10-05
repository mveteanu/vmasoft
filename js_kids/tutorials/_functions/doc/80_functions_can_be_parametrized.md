# Functions can be parametrized

To our surprise the current code is still drawing one single mini-house, even if we called the `drawHouse()` function twice. How is this possible?

As a matter of fact the code is drawing two houses ... but since both are drawn at the same coordinates, we only see the effect as one mini-house.
What we need to do is to specify where we want to draw each house when we call the `drawHouse()` function. We basically need to send some arguments / parameters.

In the code editor, go in the round parenthesis of the first function call and put the numbers `100, 100` and in between the parenthesis of the second function call and put `500, 100`.

> Note: This way of passing arguments should look familiar to you. We used to pass arguments in this way to built-in functions such as `circle` and `rect` from the very first lessons. We basically intend to make drawHouse function display the two houses at the provided x and y coordinates.

When done, click Play to see the effect… and if the output drawing still doesn’t make sense, click Next for explanation.
