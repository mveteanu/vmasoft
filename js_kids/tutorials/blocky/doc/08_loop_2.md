# Adding back the click

The `loop` solution solved the too many clicks issue... but now the program will just continously draw without having an option to specify when to draw and when not do draw.

It will be nice to check the state of the mouse buttons inside the `loop` function and run the loop code only if the mouse is pressed. The CodeBeanz environment put at our disposal the `mouseIsPressed` system variable. Like `mouseX` and `mouseY` variables this is also updated automatically by the runtime. 

Using the code editor on the right, try to wrap the `loop` function code in an `if` condition:

```
if (mouseIsPressed)
{
    ...
}
```

When done editing the code, press the 'Play' button to see if your modification works.

If you added the `if` correctly, the code should run now as expected!
