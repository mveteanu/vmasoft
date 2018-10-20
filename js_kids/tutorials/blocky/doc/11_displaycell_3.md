# Delete cells

With the protection in place inside the `displayCell` function, our drawing happens only on the designated drawing surface.

We only need to implement one more enhancement:

> Allow the operator to delete cells if the right-mouse button is pressed

We'll implement this feature by choosing the fill color as `Black` if the left-mouse button is pressed or `White` if the right-mouse button is pressed. The `White` color will simulate the delete effect.

Let's go ahead and extend the `displayCell` function to take one more argument: the color.

Inside the function we will use this argument instead of the `Black` constant we used before.

```
function displayCell(x, y, color)
{
    ...
    fill(color);
    rect(cellX, cellY, squareSize, squareSize);
}
```

... and of course we need to change also the place where the `displayCell` is used. In our case the `loop` function.
Inside this function we will also check which mouse button is pressed (the system `mouseButton` variable gives us this information) and decide on the color acordingly.

```
function loop()
{
    if (mouseIsPressed)
    {
        var color = mouseButton == LEFT ? "Black" : "White";
        displayCell(mouseX, mouseY, color);
    }
}
```

Do you take the challenge to do this modifications yourself in the code on the right? If yes, then go ahead and type the code. If you are eger to see the results, click `Next` and we'll add these lines for you.
