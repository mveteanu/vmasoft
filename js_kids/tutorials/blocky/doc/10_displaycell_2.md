# Prevent outside drawing

Our code is almost complete. We only need to put a small protection inside the `displayCell` function in case the user tries to color cells outside the grid paper.

A simple col / row verification like in the following example should do it:

```
if (col >= noCols || row >= noRows)
    return;
```

Challenge: Where is best place to place this verification? Take some time and add these lines.
