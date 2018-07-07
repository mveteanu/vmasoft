var particlesQuantity = 22222;

var positionX = new Array(particlesQuantity);
var positionY = new Array(particlesQuantity);
var velocityX = new Array(particlesQuantity).fill(0);
var velocityY = new Array(particlesQuantity).fill(0);

//stroke(64, 255, 255);

for (var particle = 1; particle < particlesQuantity; particle++) {
	positionX[particle] = random(0, width);
	positionY[particle] = random(0, height);
}

positionX[0] = 0;
positionY[0] = 0;

background(0, 128);

function loop() 
{
	stroke(64, 255, 255);

	velocityX[0] = velocityX[0] * 0.5 + (mouseX - positionX[0]) * 0.1;
	velocityY[0] = velocityY[0] * 0.5 + (mouseY - positionY[0]) * 0.1;
	
	positionX[0] += velocityX[0];
	positionY[0] += velocityY[0];
	
	for (var particle = 1; particle < particlesQuantity; particle++) {
		var whatever = 1024 / (sq(positionX[0] - positionX[particle]) + sq(positionY[0] - positionY[particle]));
		
		velocityX[particle] = velocityX[particle] * 0.95 + (velocityX[0] - velocityX[particle]) * whatever;
		velocityY[particle] = velocityY[particle] * 0.95 + (velocityY[0] - velocityY[particle]) * whatever;
		
		positionX[particle] += velocityX[particle];
		positionY[particle] += velocityY[particle];
		
		if ((positionX[particle] < 0 && velocityX[particle] < 0) || (positionX[particle] > width && velocityX[particle] > 0)) {
			velocityX[particle] = -velocityX[particle];
		}
		
		if ((positionY[particle] < 0 && velocityY[particle] < 0) || (positionY[particle] > height && velocityY[particle] > 0)) {
			velocityY[particle] = -velocityY[particle];
		}
		
		point(positionX[particle], positionY[particle]);
	}

	var fps = window.frameRate();
	fill(255);
	stroke(0);
	text("FPS: " + fps.toFixed(2), 10, height - 10);
}

function mousePressed() 
{
	for (var particle = 1; particle < particlesQuantity; particle++) {
		positionX[particle] = random(0, width);
		positionY[particle] = random(0, height);
	}
}
