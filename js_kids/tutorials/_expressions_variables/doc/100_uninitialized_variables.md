# Uninitialized variables

In many cases you don’t know what value to assign to a variable in the moment when you define it with `let`.

In that case use the `let` instruction to just define the variable:

```
let x;
let y;
let h;
```

Remember however to use the `=` operator and assign a value to that variable before you use it. Otherwise the variable will not be properly initialized with a valid value and your code may produce errors.

```
x = 200;
y = 350;
h = 150;
```

Check the code in the code editor for more details.

Click `Next` when ready.
