const justA = { a: 1 };
// Object Spread
const AandB = { ...justA, b: 2 };
// Object Rest
const { a: _, ...justB } = AandB;

// RegExp unicode ("u") flag
Boolean(/abc/u.exec("abc"));

// Promise.prototype.finally()
Promise.resolve().finally(() => {
    // at last!
});

// RegExp "s" flag
Boolean(/.{3}/s.exec("a\nb"));

// Regex Lookbehind Assertions
Boolean(/(?<=\$)\d+/.exec("$42"));

// Tagged template literal revision
String.raw`\unicode`; // Good

// RegExp named capture groups
/(?<year1>\d{4})-(?<year2>\d{4})/.exec("1992-2019");
