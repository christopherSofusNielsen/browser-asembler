
***************************************
Instructions
***************************************

//2 operands - sourece A
MOVA RD, SA
INC RD, SA
DEC RD, SA
NOT RD, SA

//2 operands - sourece B
MOVB RD, SB
SHR RD, SB
SHL RD, SB

//3 operands
ADD RD, SA, SB
SUB RD, SA, SB
AND RD, SA, SB
OR RD, SA, SB
XOR RD, SA, SB


//immediate
LDI RD, OP
ADI RD, SA, OP

//memory interactions
LD RD, SA
ST SA, SB

//branch and jump
BRZ SA, AD
BRN SA, AD

//jump
JMP SA



***************************************
Syntax
***************************************

