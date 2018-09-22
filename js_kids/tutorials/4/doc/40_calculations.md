# Calculations

Our original intent was to draw a small house in the middle of the screen. The solution we selected consists in drawing a `100` pixels wide by `100` pixels height square in the canvas center.

![Mini house](~/doc/img/mini_house.png)

Since the canvas center is `400, 300`... the coordinates of the top left corner of the square are:

## (350, 250)

- 400 - 100 / 2 = 350
- 300 - 100 / 2 = 250

In the same way, we calculated the coordinates of the lines that makeup the roof:

## (400, 200)

-	300 – 100 / 2 – 100 / 2 = 200 (we made roof be half the height of the house)

## (450, 250)

-	400 + 100 / 2 = 450
-	300 – 100 / 2 = 250
