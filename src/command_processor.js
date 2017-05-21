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

// function rules must return the following
//   Array[numTokensConsumed, replaceWithTokens]
//   If numTokensConsumed is 0 then the value of replaceWithTokens is ignored
/*parseEnglishNumbers(tokens) {
  englishNumberMap = {
    "hundred": 100,
    "thousand": 1000,
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "ten": 10
  }

  [0, ""]
}*/

