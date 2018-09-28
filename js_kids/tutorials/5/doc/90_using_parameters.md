# Using parameters

To our surprise, the code still draws the two houses in the same position, even if we instructed to display them at different coordinates.

If you look closely at the code, you’ll notice that although we are telling `drawHouse` to draw at those specific coordinates... the `rect` and `line` instructions inside the function code block are still drawing at the same coordinates as before.

To correct this we will proceed like this:

-	in between the parenthesis of `function drawHouse()` add `x, y`
-	from within the main function code block remove the two lines that define `x` and `y`

Run again the code and see the effect! If you did the exercise correctly, you should see now two house, one on the left, at coordinates `100, 100` and one on the right at coordinates `500, 100`.
