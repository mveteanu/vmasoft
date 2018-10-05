# Drawing the grid paper

To draw the grid paper we can use either one of the following ways:

* We can draw horizontal and vertical lines in a pattern that define the grid paper, or
* We can draw small rectangles arranged in rows and columns to define the cells of our grid paper

We’ll select the second method in this tutorial. 

The only challenge is to figure out the coordinates of each grid paper cell. At these coordinates we will have to display our rectangles. Since all cells are the same size, the top left coordinates of each cell can be obtained by multiplying the current column / row with the cell size.

```
var x = col * squareSize;
var y = row * squareSize;
```

> Note: The code assumes that the grid paper starts at the (0, 0) coordinates of the canvas. If you want to place the entire grid paper area in a different position, you will need to shift the x and y coordinates accordingly with the appropriate amount.

At this point our code is ready to be tested! Try it!
