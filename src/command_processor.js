class CommandProcessor {
  constructor() {
    this.matchRules = [
      {match: ["for", "word"], replace: ["forward"]},
      {match: ["4", "word"], replace: ["forward"]},
      {match: ["four", "word"], replace: ["forward"]}
    ];
    this.functionRules = [];
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
    }

    return tokens.join(" ");
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

/*CommandProcessor.prototype.registerRule = function(rule) {
  this.rules.push(rule);
}

CommandProcessor.prototype.process = function(commandTokens) {
  // Apply each match rule to the command tokens.
  while (commandTokens.length > 0) {

  }
}

// Rules
var combineForWordTogether = function(tokens) {

}

var Rule = function() {
};
*/
