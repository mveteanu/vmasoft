# Coordinates 

As in many other computer bases systems, CodeBeanz considers the first pixel as being the one in the upper-left corner. This pixel has coordinates (0, 0).

> Note: The first pixel on each direction is pixel “0” not “1”. The second pixel is “1”, the third one “2” and so on. That means that the last pixel that you can address on a given direction is 1 less than the dimension of the canvas on that direction.

* Horizontal: 0 – 799 (800 pixels in total on horizontal)
* Vertical: 0 – 599 (600 pixels in total on vertical)

> Note: Even complex shapes such as circles are drawn on the canvas by setting the appropriate pixels (the `circle` instruction in this case is doing this automatically):

![Pixels on canvas](~/doc/img/pixels_2.png)
