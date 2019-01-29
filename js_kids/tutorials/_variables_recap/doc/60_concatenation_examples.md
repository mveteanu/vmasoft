# More about string concatenation

In general you should remember to contactenate strings only with other strings. However JavaScript is clever enough and if you try to concatenate a string with a number, it will first convert the number to a string and the contactenate the two strings together.

Check out the example in the code editor:

```
alert("Sum=" + 2 + 3);

alert("Sum=" + (2 + 3));
```

What do you think it displays? Think for a second and then run the program.

You’ll notice that the first alert displays: Sum=23 while the second alert displays the expected result Sum=5.

Notice that the parenthesis `()` have been used in the second case to indicate JavaScript the order in which we want to do the operations: addition and concatenation. In the first case we are getting 23 because the operations are executed from left to right, and in the moment the string “Sum=” is contactenated with number 2 ... it becomes a new string to which number 3 is contactenated!

Click Next to advance
