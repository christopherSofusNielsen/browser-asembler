const example=[
   "; Instructions",
   "MOVA R0, R1   ; this is an inline comment",
   "",
   "INC R0, R1",
   "",
   "ADD R0, R1, R2",
   "",
   "SUB R0, R1, R2",
   "",
   "DEC R0, R1",
   "",
   "AND R0, R1, R2",
   "",
   "OR R0, R1, R2",
   "",
   "XOR R0, R1, R2",
   "",
   "NOT R0, R1",
   "",
   "MOVB R0, R2",
   "",
   ";SHR R0, R2 - use SLM instead",
   "",
   ";SHL R0, R2 - use SRM instead",
   "",
   "LDI R0, 5",
   "",
   "ADI R0, R1, 7",
   "",
   "LD R0, R1",
   "",
   "ST R1, R2",
   "",
   "BRZ R1, 20",
   "",
   "BRN R1, -15",
   "",
   "JMP R1",
   "",
   "; 3 cycle instruction",
   "LRI R0, R1",
   "",
   "; 4 cycle instruction",
   ";SRM - not supported",
   "",
   ";SLM - not supported",
   "",
]