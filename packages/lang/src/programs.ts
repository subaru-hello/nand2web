/** Sample programs shipped with the /lang playground. */

export interface SampleProgram {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly source: string;
}

export const SAMPLE_PROGRAMS: readonly SampleProgram[] = [
  {
    id: "countdown",
    name: "Countdown",
    description: "Counts down from 5 to 1 using a while loop.",
    source: `let n = 5;
while (n > 0) {
  print n;
  n = n - 1;
}`,
  },
  {
    id: "sum",
    name: "Sum 1..10",
    description: "Adds integers 1 through 10 and prints the result.",
    source: `let i = 1;
let sum = 0;
while (i <= 10) {
  sum = sum + i;
  i = i + 1;
}
print sum;`,
  },
  {
    id: "gcd",
    name: "GCD",
    description: "Computes GCD of 48 and 18 using Euclidean algorithm.",
    source: `let a = 48;
let b = 18;
while (b != 0) {
  let t = b;
  b = a % b;
  a = t;
}
print a;`,
  },
  {
    id: "maxvia",
    name: "Max via if",
    description: "Finds the maximum of two values using if/else.",
    source: `let x = 13;
let y = 7;
let m = 0;
if (x > y) {
  m = x;
} else {
  m = y;
}
print m;`,
  },
];
