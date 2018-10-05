# Solution for a bigger house

This is the solution. Press ‘Play’ to see the bigger house.

```
rect(400 – 200 / 2, 300 – 200 / 2, 200, 200);
line(400 – 200 / 2, 300 – 200 / 2, 400, 300 – 200 /2 – 200 / 2);
line(400, 300 – 200 / 2 – 200 / 2, 400 + 200 / 2, 300 – 200 / 2);
```

As you can see the expressions included in the code helped us a quite a bit when we had to change our code to draw a bigger house. We didn’t have to recalculate the new coordinates. Instead we had to do about 12 replacements in the code.

If there is one thing in coding that coders don’t like is “repeating” themselves. On the next page we’ll see how to eliminate even these replacement activities next time we’ll be asked to change the size of our house.
