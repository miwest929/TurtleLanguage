// Occasionally, the text returned by speech processor isn't exactly
// what the user meant. Since we have full control over the context
// we can use a simple rules engine to massage the incoming text into
// something that makes more sense.
class CommandProcessor {
  constructor() {
    this.matchRules = [
      {match: ["for", "word"], replace: ["forward"]},
      {match: ["4", "word"], replace: ["forward"]},
      {match: ["four", "word"], replace: ["forward"]},
      {match: ["go", "to"], replace: ["goto"]},
      {match: ["polygons"], replace: ["polygon"]},
      {match: ["write"], replace: ["right"]}
    ];
    this.functionRules = [this.matchEnglishNumbers];
  }

  tokenize(command) {
    return command.toLowerCase().split(" ");
  }

  process(command) {
    let tokens = this.tokenize(command);

    for (let index=0; index < tokens.length; index++) {
      let remainder = tokens.slice(index);

      for (let currMatchRule of this.matchRules) {
        if (this.testMatchRule(currMatchRule, remainder)) {
          Array.prototype.splice.apply(
            tokens,
            [index, currMatchRule.match.length].concat(currMatchRule.replace)
          );
        }
      }

      // Now try each of the function rules
      for (let currFnRule of this.functionRules) {
        let result = currFnRule(remainder);

        // if something was consumed
        if (result.consumedCount > 0) {
          Array.prototype.splice.apply(
            tokens,
            [index, result.consumedCount].concat(result.replace)
          )
        }
      }
    }

    return tokens.join(" ");
  }

  matchEnglishNumbers(tokens) {
    let englishToDecimalMap = {
      "one": "1",
      "two": "2",
      "three": "3",
      "four": "4",
      "five": "5",
      "six": "6",
      "seven": "7",
      "eight": "8",
      "nine": "9",
      "ten": "10"
    };

    let asDecimal = englishToDecimalMap[tokens[0]];

    if (asDecimal) {
      return {consumedCount: 1, replace: asDecimal};
    } else {
      return {consumedCount: 0};
    }
  }

  // Returns a boolean
  testMatchRule(rule, tokens) {
    let matchIndex = 0;

    for (let currToken of tokens) {
      if (matchIndex == rule.match.length) {
        return true;
      }

      if (rule.match[matchIndex] != currToken) {
        return false;
      }

      matchIndex += 1;
    }

    return (matchIndex == rule.match.length);
  }
}

class ColorWheel {
  static lookup(colorWord) {
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
      brown: "rgb(139,69,19)",
      black: "rgb(0,0,0)",
      white: "rgb(255,255,255)"
    }

    return colorMap[colorWord];
  }

  // This is a simplistic algorithm for computing
  // a constrasting shade given a specific color.
  // Determine if given color is light or dark by
  // comparing the colors average shade value.
  // If dark then return WHITE. If light then BLACK.
  static contrasting(color) {
    let components = color.match(/\d+/g);
    let red = parseInt(components[0]);
    let green = parseInt(components[1]);
    let blue = parseInt(components[2]);
    let avgShade = (red + blue + green) / 3;

    if (avgShade >= 128) {
      return "rgb(0, 0, 0)";
    } else {
      return "rgb(255, 255, 255)";
    }
  }
}

class TurtleCommand {
  constructor(isUpdate, isRender) {
    this.isUpdateCommand = isUpdate;
    this.isRenderCommand = isRender;
  }

  execute() {}
}

class GoHomeCommand extends TurtleCommand {
  constructor() {
    super(true, false);
  }

  execute(turtle) {
    turtle.xPosition = centerX;
    turtle.yPosition = centerY;
    turtle.rotationAngle = 0;
  }
}

class ChangePenStateCommand extends TurtleCommand {
  constructor(penStateFlag) {
    super(true, false);

    this.isPendown = penStateFlag;
  }

  execute(turtle) {
    turtle.isPendown = this.isPendown;
  }
}

class ShowTurtleCommand extends TurtleCommand {
  constructor(showTurtleFlag) {
    super(true, false);

    this.showTurtleFlag = showTurtleFlag;
  }

  execute(turtle) {
    turtle.showTurtle = this.showTurtleFlag;
  }
}

class RotateCommand extends TurtleCommand {
  constructor(radians) {
    super(true, false);

    this.radians = radians;
  }

  execute(turtle) {
    turtle.rotationAngle = this.radians;
  }
}

class RightCommand extends TurtleCommand {
  constructor(radians) {
    super(true, false);

    this.radians = radians;
  }

  execute(turtle) {
    turtle.rotationAngle += this.radians;
  }
}

class LeftCommand extends TurtleCommand {
  constructor(radians) {
    super(true, false);

    this.radians = radians;
  }

  execute(turtle) {
    turtle.rotationAngle -= this.radians;
  }
}

class GotoCommand extends TurtleCommand {
  constructor(x, y) {
    super(true, false);

    this.x = x;
    this.y = y;
  }

  execute(turtle) {
    turtle.xPosition = this.x;
    turtle.yPosition = this.y;
  }
}

class SetWidthCommand extends TurtleCommand {
  constructor(width) {
    super(true, false);

    this.width = width;
  }

  execute(turtle) {
    turtle.strokeWidth = this.width;
  }
}

class LineCommand extends TurtleCommand {
  constructor(step) {
    super(true, true);

    this.step = step;
  }

  execute(turtle) {
    turtle.xPosition += this.step * Math.cos(turtle.rotationAngle);
    turtle.yPosition += this.step * Math.sin(turtle.rotationAngle);
  }

  render(ctx, turtle) {
    ctx.strokeStyle = turtle.color;

    ctx.beginPath();
    ctx.moveTo(turtle.xPosition, turtle.yPosition);

    ctx.lineTo(
      turtle.xPosition + this.step * Math.cos(turtle.rotationAngle),
      turtle.yPosition + this.step * Math.sin(turtle.rotationAngle)
    );

    ctx.lineWidth = turtle.strokeWidth;
    ctx.stroke();
  }
}

class CircleCommand extends TurtleCommand {
  constructor(radius) {
    super(false, true);

    this.radius = radius;
  }

  render(ctx, turtle) {
    ctx.beginPath();

    ctx.arc(turtle.xPosition, turtle.yPosition, this.radius, 0, 2 * Math.PI, false);
    ctx.lineWidth = turtle.strokeWidth;
    ctx.strokeStyle = turtle.color;

    ctx.stroke();
  }
}

class PolygonCommand extends TurtleCommand {
  constructor(sides) {
    super(false, true);

    this.sides = sides;
  }

  render(ctx, turtle) {
    let size = 25;
    ctx.beginPath();
    ctx.moveTo(
      turtle.xPosition + size * Math.cos(0),
      turtle.yPosition + size * Math.sin(0)
    );

    for (let i = 0; i <= this.sides; i += 1) {
      ctx.lineTo(
        turtle.xPosition + size * Math.cos(i * 2 * Math.PI / this.sides),
        turtle.yPosition + size * Math.sin(i * 2 * Math.PI / this.sides)
      );
    }

    ctx.strokeStyle = turtle.color;
    ctx.lineWidth = turtle.strokeWidth;
    ctx.stroke();
  }
}

class ColorCommand extends TurtleCommand {
  constructor(color) {
    super(true, false);

    this.color = color;
  }

  execute(turtle) {
    turtle.color = this.color;
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
      circle: this.evalCircle,
      width: this.evalWidth,
      clear: this.evalClear,
      "goto": this.evalGoto,
      polygon: this.evalPolygon,
      left: this.evalLeft,
      right: this.evalRight
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
      circle: 1,
      width: 1,
      clear: 0,
      "goto": 2,
      polygon: 1,
      left: 1,
      right: 1
    }
  }

  notIntegerValueError(command, arg) {
    return `Argument '${arg}' to '${command}' command is not an integer value.`
  }

  // eval* functions must return a new TurtleCommand that
  // represents the
  evalGoto(xArg, yArg) {
    let x = parseInt(xArg, 10);
    let y = parseInt(yArg, 10);

    if (isNaN(x)) {
      return {error: this.notIntegerValueError("goto", "x")};
    }

    if (isNaN(y)) {
      return {error: this.notIntegerValueError("goto", "y")};
    }

    return {command: new GotoCommand(x, y)};
  }

  evalHide() {
    return {command: new ShowTurtleCommand(false)};
  }

  evalShow() {
    return {command: new ShowTurtleCommand(true)};
  }

  evalHome() {
    return {command: new GoHomeCommand()};
  }

  evalWidth(widthArg) {
    let width = parseInt(widthArg, 10);
    if (isNaN(width)) {
      return {error: this.notIntegerValueError("width", "width")};
    }

    return {command: new SetWidthCommand(width)};
  }

  evalCircle(radiusArg) {
    let radius = parseInt(radiusArg, 10);
    if (isNaN(radius)) {
      return {error: this.notIntegerValueError("circle", "radius")};
    }

    return {command: new CircleCommand(radius)};
  }

  evalForward(amountArg) {
    var pixels = parseInt(amountArg, 10);
    if (isNaN(pixels)) {
      return {error: this.notIntegerValueError("forward", "step")};
    }

    return {command: new LineCommand(-pixels)};
  }

  evalPolygon(sidesArg) {
    var sides = parseInt(sidesArg, 10);
    if (isNaN(sides)) {
      return {error: this.notIntegerValueError("polygon", "sides")};
    } else if (sides <= 2) {
      return {error: "Argument 'sides' to 'polygon' command must be greater than 2."};
    }

    return {command: new PolygonCommand(sides)};
  }

  evalPenDown() {
    return {command: new ChangePenStateCommand(true)};
  }

  evalPenUp() {
    return {command: new ChangePenStateCommand(false)};
  }

  evalPen(flagArg) {
    let newState = null;
    if (flagArg == "up") {
      newState = false;
    } else if (flagArg == "down") {
      newState = true;
    } else {
      return {error: "Invalid value for argument 'state' in 'pen' command."};
    }

    return {command: new ChangePenStateCommand(newState)};
  }

  evalRotate(degreesArg) {
    let degrees = parseInt(degreesArg, 10);
    if (isNaN(degrees)) {
      return {error: this.notIntegerValueError("rotate", "degrees")};
    }

    let radians = degrees * Math.PI/180;;
    return {command: new RotateCommand(radians)};
  }

  evalLeft(degreesArg) {
    let degrees = parseInt(degreesArg, 10);
    if (isNaN(degrees)) {
      return {error: this.notIntegerValueError("left", "degrees")};
    }

    let radians = degrees * Math.PI / 180;
    return {command: new LeftCommand(radians)};
  }

  evalRight(degreesArg) {
    let degrees = parseInt(degreesArg, 10);
    if (isNaN(degrees)) {
      return {error: this.notIntegerValueError("right", "degrees")};
    }

    let radians = degrees * Math.PI / 180;
    return {command: new RightCommand(radians)};
  }

  evalColor(colorArg) {
    let colorStyle = ColorWheel.lookup(colorArg);

    if (colorStyle == undefined) {
      return {error: `Color '${colorArg}' is not a recognized color.`};
    }

    return {command: new ColorCommand(colorStyle)};
  }

  evalUndo() {
    this.commands.pop();

    return {};
  }

  evalClear() {
    this.commands = [];

    return {};
  }


  execute(command) {
    // forward and FORWARD are the same command
    command = command.toLowerCase();
    var tokens = command.split(/[ ,]/);

    // Remove empty strings
    let index = tokens.indexOf("");
    while (index !== -1) {
      tokens.splice(index, 1);
      index = tokens.indexOf("");
    }

    let errors = [];
    while (tokens.length > 0) {
      var fnName = tokens.shift()
      var fn = this.functionEvalMap[fnName]

      if (fn == undefined) {
        return `'${fnName}' is not a valid command`;
      }

      var argsCount = this.fnArgCountMap[fnName];

      if (argsCount == undefined) {
        return "Unknown argument count for function '" + fnName + "'";
      }

      var args = [];
      for (var argIndex = 0; argIndex < argsCount; argIndex++) {
        args.push( tokens.shift() );
      }

      //var newCommand = fn.apply(this, args);
      let result = fn.apply(this, args);

      if (result.command != null) {
        this.commands.push(result.command);
      }

      if (result.error != null) {
        errors.push(result.error);
      }
    }

    return errors;
  }
}

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
    if (!turtle.isPendown || !command.isRenderCommand) {
      return;
    }

    command.render(ctx, turtle);
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
      if (command.isUpdateCommand) {
        command.execute(this);
      }
    }

    reset(xPosition, yPosition, rotationAngle) {
      this.xPosition = xPosition;
      this.yPosition = yPosition;
      this.rotationAngle = rotationAngle;
      this.color = "rgb(256, 256, 256)";
      this.isPendown = true;
      this.strokeWidth = 2;
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
        let iconWidth = 5;

        context.beginPath();
        context.arc(this.xPosition, this.yPosition, iconWidth, 0, 2 * Math.PI, false);
        context.fillStyle = this.color;
        context.fill();
        context.strokeStyle = ColorWheel.contrasting(this.color);
        context.stroke();

        context.beginPath();
        context.arc(
          this.xPosition,
          this.yPosition,
          iconWidth,
          this.rotationAngle - 0.4 + Math.PI,
          this.rotationAngle + 0.4 + Math.PI
        );
        context.strokeStyle = this.color;
        context.stroke();
      }
    }
  }

  let turtle = new Turtle(
    centerX,// - (turtleSprite.width / 2),
    centerY,// - (turtleSprite.height / 2),
    0
  );

  turtleInterpreter.execute("hide");
  turtleInterpreter.execute("color green");
  turtleInterpreter.execute("forward 50");
  turtleInterpreter.execute("right 90");
  turtleInterpreter.execute("forward 50");
  turtleInterpreter.execute("right 90");
  turtleInterpreter.execute("forward 50");
  turtleInterpreter.execute("right 90");
  turtleInterpreter.execute("forward 50");
  turtleInterpreter.execute("left 90");
  turtleInterpreter.execute("forward 50");
  turtleInterpreter.execute("left 90");
  turtleInterpreter.execute("forward 50");
  turtleInterpreter.execute("left 90");
  turtleInterpreter.execute("forward 50");
  turtleInterpreter.execute("circle 50");
  turtleInterpreter.execute("right 90");
  turtleInterpreter.execute("forward 50");
  turtleInterpreter.execute("circle 50");

/*
  turtleInterpreter.execute("home");
  turtleInterpreter.execute("color purple");
  turtleInterpreter.execute("rotate 45");
  turtleInterpreter.execute("forward 50");
  turtleInterpreter.execute("rotate 135");
  turtleInterpreter.execute("forward 50");
  turtleInterpreter.execute("polygon 8");
*/

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
