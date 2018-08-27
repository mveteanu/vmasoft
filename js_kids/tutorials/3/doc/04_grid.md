# Drawing the grid paper

Let's refactor the code a little bit and extract all this logic that draws the grid paper in a separate function... and call it imediately.

The effect should be the same as before ... with the only difference that now the code is better encapsulated. Although we can parametrize the function, we will let it read the global consts for now.
