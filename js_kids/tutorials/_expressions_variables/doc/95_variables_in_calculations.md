#Variables in calculations

Since we now have the house height as a variable, we can use it inside our calculations.

```
let h = 100;

rect(400 – h / 2, 300 – h / 2, h, h);
line(400 – h / 2, 300 – h / 2, 400, 300 – h /2 – h / 2);
line(400, 300 – h / 2 – h / 2, 400 + h / 2, 300 – h / 2);
```

Notice that the code is the same, but `h` is used instead of the `100` or `200` values that we used before. 

Try to run this code and see the effect... then modify the value of `h` and re-run the code.

See how simple it is now! With only 1 single change in the code, we can draw our house in different sizes!
