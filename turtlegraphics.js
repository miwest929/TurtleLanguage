var TurtleCommand = function(step) {
  this.step = step;
  this.rotateDegrees = null;
  this.color = null;
  this.isPendown = null;
}

var TurtleCommandInterpreter = function() {
  this.commands = [];
  this.functionEvalMap = {
    forward: this.evalForward,
    color: this.evalColor,
    undo: this.evalUndo,
    rotate: this.evalRotate,
    pen: this.evalPen
//    left: this.evalLeft,
//    right: this.evalRight
  };

  this.fnArgCountMap = {
    forward: 1,
    color: 1,
    undo: 0,
    rotate: 1,
    pen: 1
//    left: 1,
//    right: 1
  }
}

// eval* functions must return a new TurtleCommand that
// represents the
TurtleCommandInterpreter.prototype.evalForward = function(amountArg) {
  var pixels = parseInt(amountArg, 10);
  if (isNaN(pixels)) {
    console.log("Argument to 'forward' command is not an integer value.");
    return;
  }

  return new TurtleCommand(-pixels);
}

TurtleCommandInterpreter.prototype.evalPen = function(flagArg) {
  var newCommand = new TurtleCommand(0);

  if (flagArg == "up") {
    newCommand.isPendown = false;
  } else if (flagArg == "down") {
    newCommand.isPendown = true;
  } else {
    console.log("Invalid argument '" + flagArg + "' to 'pen' command.");
    return nil;
  }

  return newCommand;
}

TurtleCommandInterpreter.prototype.evalLeft = function(degreesArg) {
  var degrees = parseInt(degreesArg, 10);
  if (isNaN(degrees)) {
    console.log("Argument to 'rotate' command is not an integer value.");
    return;
  }

  //TODO: Implement relative angle update
}

TurtleCommandInterpreter.prototype.evalRight = function(degreesArg) {
  var degrees = parseInt(degreesArg, 10);
  if (isNaN(degrees)) {
    console.log("Argument to 'rotate' command is not an integer value.");
    return;
  }

  //TODO: Implement relative angle update
}

TurtleCommandInterpreter.prototype.evalRotate = function(degreesArg) {
  var degrees = parseInt(degreesArg, 10);
  if (isNaN(degrees)) {
    console.log("Argument to 'rotate' command is not an integer value.");
    return;
  }

  var newCommand = new TurtleCommand(0);
  newCommand.rotateDegrees = degrees;
  return newCommand;
}

TurtleCommandInterpreter.prototype.evalColor = function(colorArg) {
  var colorMap = {
    red: "rgb(256, 0, 0)",
    green: "rgb(0, 256, 0)",
    blue: "rgb(0, 0, 256)",
    yellow: "rgb(256, 256, 0)",
    purple: "rgb(128,0,128)",
    pink: "rgb(255,192,203)",
    orange: "rgb(255,140,0)",
    lime: "rgb(0,255,0)",
    silver: "rgb(192,192,192)"
  }

  var colorStyle = colorMap[colorArg];

  if (colorStyle == undefined) {
    console.log("color '" + colorArg + "' is not recognized");
    return;
  }

  var newCommand = new TurtleCommand(0);
  newCommand.color = colorStyle;

  return newCommand
}

TurtleCommandInterpreter.prototype.evalUndo = function() {
  this.commands.pop();

  return null;
}

TurtleCommandInterpreter.prototype.execute = function(command) {
  // forward and FORWARD are the same command
  command = command.toLowerCase();
  var tokens = command.split(" ");

  while (tokens.length > 0) {
    var fnName = tokens.shift()
    var fn = this.functionEvalMap[fnName]

    if (fn == undefined) {
      console.log("'" + fnName + "' is not a valid command.");
      return;
    }

    var argsCount = this.fnArgCountMap[fnName];

    if (argsCount == undefined) {
      console.log("Unknown argument count for function '" + fnName + "'");
      return;
    }

    var args = [];
    for (var argIndex = 0; argIndex < argsCount; argIndex++) {
      args.push( tokens.shift() );
    }

    var newCommand = fn.apply(this, args);

    if (newCommand != null) {
      this.commands.push(newCommand);
    }
  }
};

var turtleInterpreter = new TurtleCommandInterpreter();

$(document).ready(function() {
  var canvas = document.getElementById('turtle');
  var ctx = canvas.getContext('2d');
  var centerX = (canvas.width / 2);
  var centerY = (canvas.height / 2);

  var renderBackground = function() {
    ctx.fillStyle = "rgb(200, 200, 200)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  var renderCommand = function(turtle, command) {
    // This is a rotation command
    if (command.rotateDegrees != null) {
      // do nothing for now
    } else if ((command.isPendown != null && command.isPendown) || turtle.isPendown) {
      ctx.strokeStyle = turtle.color;

      ctx.beginPath();
      ctx.moveTo(turtle.xPosition, turtle.yPosition);

      var radians = turtle.rotationAngle * Math.PI/180;

      ctx.lineTo(
        turtle.xPosition + command.step * Math.cos(radians),
        turtle.yPosition + command.step * Math.sin(radians)
      );

      if (command.color != null) {
        ctx.strokeStyle = command.color;
      }

      ctx.stroke();
    }
  }

  var loadImage = function(path) {
    var drawing = new Image();
    drawing.onload = function() {
      console.log("Loaded turtle sprite");
    }

    drawing.onerror = function() {
      console.log("Failed to load turtle sprite");
    }
    drawing.src = path;

    return drawing;
  }

  var turtleSprite = loadImage("imgs/turtle.png");

  var Turtle = function(xPosition, yPosition, rotationAngle) {
    this.xPosition = xPosition;
    this.yPosition = yPosition;
    this.rotationAngle = rotationAngle;
    this.color = "rgb(256, 256, 256)";
    this.isPendown = true;
  }

  Turtle.prototype.update = function(command) {
    var radians = this.rotationAngle * Math.PI/180;
    this.xPosition += command.step * Math.cos(radians);
    this.yPosition += command.step * Math.sin(radians);

    if (command.color != null) {
      this.color = command.color
    }

    if (command.rotateDegrees != null) {
      this.rotationAngle = command.rotateDegrees;
    }

    if (command.isPendown != null) {
      this.isPendown = command.isPendown;
    }
  }

  Turtle.prototype.render = function(context, img) {
    context.save();
    context.translate(this.xPosition, this.yPosition);
    context.rotate(this.rotationAngle * Math.PI/180)
    context.drawImage(img, 0, 0);
    context.restore();
  };

/*
  turtleInterpreter.execute("forward 50");
  turtleInterpreter.execute("rotate 90");
  turtleInterpreter.execute("forward 50");
  turtleInterpreter.execute("rotate 180");
  turtleInterpreter.execute("forward 50");
  turtleInterpreter.execute("rotate 270");
  turtleInterpreter.execute("forward 50");
  turtleInterpreter.execute("forward 50");
  turtleInterpreter.execute("rotate 0");
  turtleInterpreter.execute("forward 50");
  turtleInterpreter.execute("rotate 90");
  turtleInterpreter.execute("forward 50");
*/
  //turtleInterpreter.execute("penup");
  //turtleInterpreter.execute("rotate 90");
  //turtleInterpreter.execute("forward 100");
  //turtleInterpreter.execute("pendown");
  //turtleInterpreter.execute("rotate 180");
  //turtleInterpreter.execute("forward 100");

  setInterval(function () {
    renderBackground();

    var turtle = new Turtle(
      centerX - (turtleSprite.width / 2),
      centerY - (turtleSprite.height / 2),
      0
    );

    turtleInterpreter.commands.forEach(function(command) {
      renderCommand(turtle, command);

      turtle.update(command);
    });

    turtle.render(ctx, turtleSprite);
  }, 100);
});
