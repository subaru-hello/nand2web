/** Sample programs shipped with the /cpu playground. */

export interface SampleProgram {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly source: string;
}

export const SAMPLE_PROGRAMS: readonly SampleProgram[] = [
  {
    id: "add",
    name: "3 + 4",
    description: "Adds two constants and halts with the sum on OUT.",
    source: `; compute 3 + 4, show it, stop
  LDI 3
  TAB          ; B = 3
  LDI 4
  ADD          ; A = 4 + 3
  OUT
  HLT`,
  },
  {
    id: "counter",
    name: "Counter",
    description: "Counts 0, 1, 2 … on the output forever, wrapping at 15.",
    source: `; count up on OUT
  LDI 1
  TAB          ; B = 1, forever
  LDI 0        ; A = 0
loop:
  OUT          ; display A
  ADD          ; A = A + 1
  JMP loop`,
  },
  {
    id: "countdown",
    name: "Countdown",
    description: "Reads the input port and counts down to zero.",
    source: `; countdown from IN to 0
  IN           ; A = input port
  ST 0         ; stash n
  LDI 1
  TAB          ; B = 1, forever
  LD 0         ; A = n
loop:
  OUT
  SUB          ; A = A - 1, sets zero flag
  JZ end
  JMP loop
end:
  OUT          ; show the final 0
  HLT`,
  },
  {
    id: "fibonacci",
    name: "Fibonacci",
    description: "Outputs 1, 1, 2, 3, 5, 8, 13 — then halts when 4 bits overflow.",
    source: `; RAM[0] = prev (starts 0), RAM[1] = current
  LDI 1
  ST 1         ; current = 1
loop:
  LD 1
  OUT          ; show current
  TAB          ; B = current
  LD 0
  ADD          ; A = prev + current
  JC end       ; overflow past 15: stop
  ST 2         ; next (scratch)
  LD 1
  ST 0         ; prev = current
  LD 2
  ST 1         ; current = next
  JMP loop
end:
  HLT`,
  },
];
