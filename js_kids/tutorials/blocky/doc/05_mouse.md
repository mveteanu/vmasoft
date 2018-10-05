# Adding blocks

With grid paper in place, let's define the mousePressed() function. If defined, this function will be called automatically by the CodeBeanz engine each time you click the mouse button.

To verify that the mousePressed() is called correctly, let's make this function draw a small black rectangle at mouse coordinates.

> Remember: mouseX and mouseY are system varibles that contains the mouse cursor position. The CodeBeanz runtime will automatically update thes variables each time the mouse cursor moves.

```
function mousePressed()
{
    fill('Black');
    rect(mouseX, mouseY, squareSize, squareSize);
}
```

Run the code! The program already starts to look how we want!
