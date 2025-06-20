// This script animates moving beige dots that bounce and connect with lines
// It also connects the closest dots to the mouse when nearby

window.addEventListener('DOMContentLoaded', function() {
  // Get the canvas element
  var canvas = document.querySelector('.hero-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');

  // Settings for dots and lines
  var dotColor = '#f5f5dc'; // beige
  var lineColor = '#f5f5dc'; // beige
  var dotRadius = 4;
  var numDots = 50; // Increased number of dots for more movement
  var maxSpeed = 1.2; // Maximum speed for dots
  var connectDistance = 120; // Max distance to draw a line

  var dots = [];

  // Function to create dots with random positions and velocities
  function createDots() {
    dots = [];
    for (var i = 0; i < numDots; i++) {
      var x = Math.random() * canvas.width;
      var y = Math.random() * canvas.height;
      // Random speed and direction
      var vx = (Math.random() - 0.5) * maxSpeed * 2;
      var vy = (Math.random() - 0.5) * maxSpeed * 2;
      dots.push({x: x, y: y, vx: vx, vy: vy});
    }
  }

  // Resize canvas and recreate dots
  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    createDots();
  }

  // Update dot positions and bounce off edges
  function updateDots() {
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      d.x += d.vx;
      d.y += d.vy;

      // Bounce off left/right edges
      if (d.x < dotRadius) {
        d.x = dotRadius;
        d.vx *= -1;
      }
      if (d.x > canvas.width - dotRadius) {
        d.x = canvas.width - dotRadius;
        d.vx *= -1;
      }
      // Bounce off top/bottom edges
      if (d.y < dotRadius) {
        d.y = dotRadius;
        d.vy *= -1;
      }
      if (d.y > canvas.height - dotRadius) {
        d.y = canvas.height - dotRadius;
        d.vy *= -1;
      }
    }
  }

  var mouse = { x: null, y: null }; // Store mouse position

  // Listen for mouse movement over the canvas
  canvas.addEventListener('mousemove', function(e) {
    // Get mouse position relative to the canvas
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  // When mouse leaves the canvas, reset position
  canvas.addEventListener('mouseleave', function() {
    mouse.x = null;
    mouse.y = null;
  });

  // Draw dots and lines
  function drawDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw lines between nearby dots
    for (var i = 0; i < numDots; i++) {
      for (var j = i + 1; j < numDots; j++) {
        var dx = dots[i].x - dots[j].x;
        var dy = dots[i].y - dots[j].y;
        var dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < connectDistance) { // Only connect close dots
          ctx.strokeStyle = lineColor;
          ctx.globalAlpha = 0.3;
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }
      }
    }

    // Draw lines from mouse to closest dots if mouse is present
    if (mouse.x !== null && mouse.y !== null) {
      // Find the 3 closest dots to the mouse
      var dotsWithDist = dots.map(function(dot) {
        var dx = dot.x - mouse.x;
        var dy = dot.y - mouse.y;
        var dist = Math.sqrt(dx*dx + dy*dy);
        return { dot: dot, dist: dist };
      });
      // Sort by distance
      dotsWithDist.sort(function(a, b) { return a.dist - b.dist; });

      // Connect to up to 3 closest dots within a certain distance
      var maxMouseConnect = 3;
      var mouseConnectDistance = 120;
      for (var i = 0; i < Math.min(maxMouseConnect, dotsWithDist.length); i++) {
        if (dotsWithDist[i].dist < mouseConnectDistance) {
          ctx.strokeStyle = lineColor;
          ctx.globalAlpha = 0.5;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(dotsWithDist[i].dot.x, dotsWithDist[i].dot.y);
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }
      }
    }

    // Draw dots
    for (var i = 0; i < numDots; i++) {
      ctx.fillStyle = dotColor;
      ctx.beginPath();
      ctx.arc(dots[i].x, dots[i].y, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Animation loop
  function animate() {
    updateDots();
    drawDots();
    requestAnimationFrame(animate); // Keep animating
  }

  // Redraw and reset dots on resize
  window.addEventListener('resize', resizeCanvas);

  // Initial setup
  resizeCanvas();
  animate();
});
