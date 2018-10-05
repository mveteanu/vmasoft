# Find hit square

The challenge that we have now is to make the `mousePressed()` function draw the black rectangle at the exact coordinates of the grid paper cell beneath - no matter where we click with the mouse inside that cell.

This is how we plan to do this:

* Find the row / column index of the grid paper cell. This can be easily determined using the inverse operation that we used when we drew the grid paper: we will use division.

```
var col = Math.floor( mouseX / squareSize );
var row = Math.floor( mouseY / squareSize );
```

Note: The `Math.floor` JavaScript function is used to round up the result of the division to the closest lower integer number.

* Once we have the row / column index, we can recalculate the (x, y) pixel coordinates of that cell. These are the same coordinates that we'll use to draw our black rectangle.

```
var x = col * squareSize;
var y = row * squareSize;
```

That's it! Our program is done! Give it a try and see how it behaves!

Take your time to play with the output then click 'Next' to see an enhancement!
