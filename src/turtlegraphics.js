class TurtleCommandInterpreter {
  constructor() {
    this.commands = [];

    this.functionEvalMap = {
      forward: this.evalForward,
      color: this.evalColor,
      undo: this.evalUndo,
      rotate: this.evalRotate,
      pen: this.evalPen,
      down: this.evalPenDown,
      up: this.evalPenUp,
      home: this.evalHome,
      hide: this.evalHide,
      show: this.evalShow
    };

    this.fnArgCountMap = {
      forward: 1,
      color: 1,
      undo: 0,
      rotate: 1,
      pen: 1,
      down: 0,
      up: 0,
      home: 0,
      hide: 0,
      show: 0
    }
  }

  // eval* functions must return a new TurtleCommand that
  // represents the
  evalForward(amountArg) {
    var pixels = parseInt(amountArg, 10);
    if (isNaN(pixels)) {
      console.log("Argument to 'forward' command is not an integer value.");
      return;
    }

    return new TurtleCommand(-pixels);
  }

  evalPenDown() {
    var newCommand = new TurtleCommand(0);

    newCommand.isPendown = true;

    return newCommand;
  }

  evalPenUp() {
    var newCommand = new TurtleCommand(0);

    newCommand.isPendown = false;

    return newCommand;
  }

  evalPen(flagArg) {
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

  evalRotate(degreesArg) {
    var degrees = parseInt(degreesArg, 10);
    if (isNaN(degrees)) {
      console.log("Argument to 'rotate' command is not an integer value.");
      return;
    }

    var newCommand = new TurtleCommand(0);
    newCommand.rotateDegrees = degrees;
    return newCommand;
  }

  evalColor(colorArg) {
    var colorMap = {
      red: "rgb(256, 0, 0)",
      green: "rgb(0, 256, 0)",
      blue: "rgb(0, 0, 256)",
      yellow: "rgb(256, 256, 0)",
      purple: "rgb(128,0,128)",
      pink: "rgb(255,192,203)",
      orange: "rgb(255,140,0)",
      lime: "rgb(0,255,0)",
      silver: "rgb(192,192,192)",
      gold: "rgb(255,215,0)",
      olive: "rgb(128,128,0)",
      beige: "rgb(245,245,220)",
      aqua: "rgb(0,255,255)",
      teal: "rgb(0,128,128)",
      brown: "rgb(139,69,19)"
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

  evalUndo() {
    this.commands.pop();

    return null;
  }

  execute(command) {
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
  }
}

class TurtleCommand {
  constructor(step) {
    this.step = step;
    this.rotateDegrees = null;
    this.color = null;
    this.isPendown = null;
  }
}

//    left: 1,
//    right: 1

/*TurtleCommandInterpreter.prototype.evalHome = function() {
  // Send turtle to home position (origin)
  return new TurtleCommand(-pixels);
}*/


/*TurtleCommandInterpreter.prototype.evalLeft = function(degreesArg) {
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
*/

var turtleInterpreter = new TurtleCommandInterpreter();

$(document).ready(() => {
  let canvas = document.getElementById('turtle');
  let ctx = canvas.getContext('2d');
  let centerX = (canvas.width / 2);
  let centerY = (canvas.height / 2);

  let renderBackground = () => {
    ctx.fillStyle = "rgb(200, 200, 200)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  let renderCommand = (turtle, command) => {
    // This is a rotation command
    if (command.rotateDegrees != null) {
      // do nothing for now
    } else if ((command.isPendown != null && command.isPendown) || turtle.isPendown) {
      ctx.strokeStyle = turtle.color;

      ctx.beginPath();
      ctx.moveTo(turtle.xPosition, turtle.yPosition);

      let radians = turtle.rotationAngle * Math.PI/180;

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

  let loadImage = (path) => {
    let drawing = new Image();
    drawing.onload = () => {
      console.log("Loaded turtle sprite");
    }

    drawing.onerror = () => {
      console.log("Failed to load turtle sprite");
    }
    drawing.src = path;

    return drawing;
  }


  class Turtle {
    constructor(xPosition, yPosition, rotationAngle) {
      this.xPosition = xPosition;
      this.yPosition = yPosition;
      this.rotationAngle = rotationAngle;
      this.color = "rgb(256, 256, 256)";
      this.isPendown = true;
      this.turtleSprite = loadImage("imgs/turtle.png");
      this.turtlePenupSprite = loadImage("imgs/turtlepenup.png");
    }

    update(command) {
      let radians = this.rotationAngle * Math.PI/180;
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

    reset(xPosition, yPosition, rotationAngle) {
      this.xPosition = xPosition;
      this.yPosition = yPosition;
      this.rotationAngle = rotationAngle;
      this.color = "rgb(256, 256, 256)";
      this.isPendown = true;
    }

    render(context) {
      context.save();
      context.translate(this.xPosition, this.yPosition);
      context.rotate(this.rotationAngle * Math.PI/180)

      if (this.isPendown) {
        context.drawImage(this.turtleSprite, 0, 0);
      } else {
        context.drawImage(this.turtlePenupSprite, 0, 0);
      }

      context.restore();
    }
  }

  let turtle = new Turtle(
    centerX,// - (turtleSprite.width / 2),
    centerY,// - (turtleSprite.height / 2),
    0
  );

  setInterval(function () {
    renderBackground();

    turtle.reset(centerX, centerY, 0);

    turtleInterpreter.commands.forEach(function(command) {
      renderCommand(turtle, command);

      turtle.update(command);
    });

    turtle.render(ctx);
  }, 100);
});
