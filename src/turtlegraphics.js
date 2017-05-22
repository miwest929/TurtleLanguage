class TurtleCommand {
  constructor() {
  }
}

class GoHomeCommand extends TurtleCommand {
  constructor() {
    super();
  }
}

class ChangePenStateCommand extends TurtleCommand {
  constructor(penStateFlag) {
    super();

    this.isPendown = penStateFlag;
  }
}

class ShowTurtleCommand extends TurtleCommand {
  constructor(showTurtleFlag) {
    super();

    this.showTurtleFlag = showTurtleFlag;
  }
}

class RotateCommand extends TurtleCommand {
  constructor(radians) {
    super();

    this.radians = radians;
  }
}

class LineCommand extends TurtleCommand {
  constructor(step) {
    super();

    this.step = step;
  }
}

class CircleCommand extends TurtleCommand {
  constructor(radius) {
    super();

    this.radius = radius;
  }
}

class ColorCommand extends TurtleCommand {
  constructor(color) {
    super();

    this.color = color;
  }
}

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
      show: this.evalShow,
      circle: this.evalCircle
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
      show: 0,
      circle: 1
    }
  }

  // eval* functions must return a new TurtleCommand that
  // represents the
  evalHide() {
    return new ShowTurtleCommand(false);
  }

  evalShow() {
    return new ShowTurtleCommand(true);
  }

  evalHome() {
    return new GoHomeCommand();
  }

  evalCircle(radiusArg) {
    let radius = parseInt(radiusArg, 10);
    if (isNaN(radius)) {
      console.log("Argument to 'circle' command is not an integer value.");
      return nil;
    }

    return new CircleCommand(radius);
  }

  evalForward(amountArg) {
    var pixels = parseInt(amountArg, 10);
    if (isNaN(pixels)) {
      console.log("Argument to 'forward' command is not an integer value.");
      return;
    }

    return new LineCommand(-pixels);
  }

  evalPenDown() {
    return new ChangePenStateCommand(true);
  }

  evalPenUp() {
    return new ChangePenStateCommand(false);
  }

  evalPen(flagArg) {
    let newState = null;
    if (flagArg == "up") {
      newState = false;
    } else if (flagArg == "down") {
      newState = true;
    } else {
      console.log("Invalid argument '" + flagArg + "' to 'pen' command.");
      return nil;
    }

    return new ChangePenStateCommand(newState);
  }

  evalRotate(degreesArg) {
    let degrees = parseInt(degreesArg, 10);
    if (isNaN(degrees)) {
      console.log("Argument to 'rotate' command is not an integer value.");
      return;
    }

    let radians = degrees * Math.PI/180;;
    return new RotateCommand(radians);
  }

  evalColor(colorArg) {
    let colorMap = {
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

    let colorStyle = colorMap[colorArg];

    if (colorStyle == undefined) {
      console.log("color '" + colorArg + "' is not recognized");
      return;
    }

    return new ColorCommand(colorStyle);
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
    if (!turtle.isPendown) {
      return;
    }

    if (command instanceof LineCommand) {
      ctx.strokeStyle = turtle.color;

      ctx.beginPath();
      ctx.moveTo(turtle.xPosition, turtle.yPosition);

      ctx.lineTo(
        turtle.xPosition + command.step * Math.cos(turtle.rotationAngle),
        turtle.yPosition + command.step * Math.sin(turtle.rotationAngle)
      );

      ctx.lineWidth = turtle.strokeWidth;
      ctx.stroke();
    } else if (command instanceof CircleCommand) {
      ctx.beginPath();

      ctx.arc(turtle.xPosition, turtle.yPosition, command.radius, 0, 2 * Math.PI, false);
      ctx.lineWidth = turtle.strokeWidth;
      ctx.strokeStyle = turtle.color;

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
      this.showTurtle = true;
      this.strokeWidth = 2;
    }

    update(command) {
      if (command instanceof LineCommand) {
        this.xPosition += command.step * Math.cos(this.rotationAngle);
        this.yPosition += command.step * Math.sin(this.rotationAngle);
      } else if (command instanceof ColorCommand) {
        this.color = command.color;
      } else if (command instanceof RotateCommand) {
        this.rotationAngle = command.radians;
      } else if (command instanceof ChangePenStateCommand) {
        this.isPendown = command.isPendown;
      } else if (command instanceof GoHomeCommand) {
        this.reset(centerX, centerY, 0);
      } else if (command instanceof ShowTurtleCommand) {
        this.showTurtle = command.showTurtleFlag;
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
      if (this.showTurtle) {
        context.save();
        context.translate(this.xPosition, this.yPosition);
        context.rotate(this.rotationAngle)

        if (this.isPendown) {
          context.drawImage(this.turtleSprite, 0, 0);
        } else {
          context.drawImage(this.turtlePenupSprite, 0, 0);
        }

        context.restore();
      } else {
        context.beginPath();
        context.arc(this.xPosition, this.yPosition, this.strokeWidth, 0, 2 * Math.PI, false);
        context.fillStyle = this.color;
        context.fill();
        context.stroke();
      }
    }
  }

  let turtle = new Turtle(
    centerX,// - (turtleSprite.width / 2),
    centerY,// - (turtleSprite.height / 2),
    0
  );

  turtleInterpreter.execute("forward 50");
  turtleInterpreter.execute("rotate 90");
  turtleInterpreter.execute("forward 50");
  turtleInterpreter.execute("rotate 180");
  turtleInterpreter.execute("forward 50");
  turtleInterpreter.execute("rotate 270");
  turtleInterpreter.execute("forward 50");
  turtleInterpreter.execute("home");
  turtleInterpreter.execute("color purple");
  turtleInterpreter.execute("rotate 45");
  turtleInterpreter.execute("forward 50");
  turtleInterpreter.execute("rotate 135");
  turtleInterpreter.execute("forward 50");
  turtleInterpreter.execute("hide");
  turtleInterpreter.execute("circle 15");

  setInterval(() => {
    renderBackground();

    turtle.reset(centerX, centerY, 0);

    turtleInterpreter.commands.forEach((command) => {
      renderCommand(turtle, command);
      turtle.update(command);
    });

    turtle.render(ctx);
  }, 100);
});
