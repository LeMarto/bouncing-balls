//Config
const max_balls = 100;
const gravity = 9.8;
const terminal_velocity = 980;

// Setup scene
var balls = [];
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

var lastts = 0;

// function to generate random number

function Random(min, max)
{
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

function Vector2D(x, y)
{
	this.x = x;
	this.y = y;
}

Vector2D.prototype.magnitude = function()
{
	return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
};


/*
Ball Class
*/
function Ball(x, y, color, size)
{
	this.position = new Vector2D(x, y);
	this.initialPosition = new Vector2D(x, y);
	this.velocity = new Vector2D(0, 0);

	while (this.velocity.x === 0) {
		this.velocity.x = Random(-7, 7);
	}
	this.vqueue = [];
	this.color = color;
	this.size = size;
	this.bouncesy = 0;
	this.grounded = false;
}

Ball.prototype.Draw = function ()
{
	ctx.beginPath();
	ctx.fillStyle = this.color;
	ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);
	ctx.fill();
	
	ctx.fillStyle = 'rgba(0, 0, 0, 1)';

	ctx.beginPath();
	ctx.moveTo(this.position.x, this.position.y);
	ctx.lineTo(this.position.x + this.velocity.x*6, this.position.y);
	ctx.moveTo(this.position.x, this.position.y);
	ctx.lineTo(this.position.x, this.position.y + this.velocity.y*6);
	ctx.closePath();
	ctx.stroke();
	
}

Ball.prototype.Update = function (delta)
{
	if (!this.grounded)
		this.velocity.y += gravity * delta;

	if (this.velocity.y >= terminal_velocity)
		this.velocity.y = terminal_velocity;

	if ((this.position.y + this.size) >= height && this.velocity.y > 0 && !this.grounded)
	{
		this.velocity.y /= 4;
		this.velocity.y *= 3;
		this.velocity.y *= -1;
		this.bouncesy++;

		this.vqueue.push(Math.abs(this.velocity.y));

		if (this.vqueue.length > 5) {
			let elem = this.vqueue.shift();

			let avg = this.vqueue.reduce((acc, value) => acc + value, 0) / this.vqueue.length;

			if (avg > 0 && avg < 1)
			{
				this.velocity.y = 0;
				this.grounded = true;
			}

		}

	}
	
	if (!this.grounded)
		this.position.y += this.velocity.y;

	if (this.position.x + this.size >= width || this.position.x - this.size <= 0)
	{
		this.velocity.x /= 4;
		this.velocity.x *= 3;
		this.velocity.x *= -1;
	}

	if (this.grounded)
		this.velocity.x -= this.velocity.x * 0.01;

	this.position.x += this.velocity.x;

}

function SpawnBalls()
{
	while (balls.length < max_balls)
	{
		var size = Random(10, 20);
		var ball = new Ball(
		  Random(0 + size, width - size),
		  Random(0 + size, height - size),
		  'rgb(' + Random(0, 255) + ',' + Random(0, 255) + ',' + Random(0, 255) + ')',
		  size
		);
		balls.push(ball);
	}
}


function loop(ts)
{
	var delta = (ts || 0) - (lastts || 0);
	lastts = ts;

	delta /= 1000;


	ctx.clearRect(0, 0, width, height);
	ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';

	for (var i = 0; i < balls.length; i++)
	{
		balls[i].Draw();
		balls[i].Update(delta);
	}

	requestAnimationFrame(loop);
}

SpawnBalls();
loop();