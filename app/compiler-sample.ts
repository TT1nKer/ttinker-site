export type CompilerCodeLine = { number: number; text: string };

export type CompilerCorrespondenceRow = {
  id: string;
  kind: "runtime" | "setup" | "source" | "teardown" | "fallback";
  label: string;
  sourceLines: number[];
  assemblyLines: number[];
  note: string;
  expression?: string;
  mnemonic?: string;
  instructionLine?: number;
};

function listing(text: string) {
  const lines = text.trimEnd().split("\n").map((line, index) => ({ number: index + 1, text: line }));
  return { text, lines };
}

// Captured from an actual build and execution of the pinned public fstCC revision.
// source.text and assembly.text retain their exact bytes, including final newlines.
// The main excerpt is contiguous; omitted startup/fallthrough code remains in full text.
export const compilerSample = {
  "id": "fstcc-double",
  "title": "A local variable, an addition, a return",
  "source": {
    "file": "evidence/double.c",
    "language": "c",
    ...listing(`int main() {
  int x = 21;
  int doubled = x + x;
  return doubled;
}
`),
  },
  "assembly": {
    "file": "evidence/double.s",
    "language": "riscv",
    ...listing(`	.text
	.globl _start
_start:
	call	main
	li	a7, 93
	ecall
	.globl	main
main:
	mv	t0, sp
	addi	sp, sp, -32
	sd	ra, -8(t0)
	sd	s0, -16(t0)
	mv	s0, t0
	li	a0, 21
	sd	a0, -24(s0)
	ld	a0, -24(s0)
	addi	sp, sp, -16
	sd	a0, 0(sp)
	ld	a0, -24(s0)
	ld	a1, 0(sp)
	addi	sp, sp, 16
	addw	a0, a1, a0
	sd	a0, -32(s0)
	ld	a0, -32(s0)
	ld	ra, -8(s0)
	mv	t0, s0
	ld	s0, -16(s0)
	mv	sp, t0
	ret
	li	a0, 0
	ld	ra, -8(s0)
	mv	t0, s0
	ld	s0, -16(s0)
	mv	sp, t0
	ret
`),
    "excerpt": {
      "label": "main — explicit return path",
      "lineNumbers": [
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29
      ],
      "omitted": [
        {
          "start": 1,
          "end": 6,
          "reason": "Process entry; retained in the full output."
        },
        {
          "start": 30,
          "end": 35,
          "reason": "Unreachable implicit return; retained in the full output."
        }
      ]
    }
  },
  "rows": [
    {
      "id": "entry",
      "kind": "runtime",
      "label": "Process entry",
      "sourceLines": [],
      "assemblyLines": [
        1,
        2,
        3,
        4,
        5,
        6
      ],
      "note": "The Linux entry point calls main, then exits using its result in a0. Syscall number 93 selects exit."
    },
    {
      "id": "frame",
      "kind": "setup",
      "label": "Stack frame",
      "sourceLines": [
        1
      ],
      "assemblyLines": [
        7,
        8,
        9,
        10,
        11,
        12,
        13
      ],
      "note": "main reserves 32 bytes for the saved return address, frame pointer, and two eight-byte local slots.",
      "expression": "main",
      "mnemonic": "addi",
      "instructionLine": 10
    },
    {
      "id": "initialize",
      "kind": "source",
      "label": "Local initialization",
      "sourceLines": [
        2
      ],
      "assemblyLines": [
        14,
        15
      ],
      "note": "The value 21 is loaded into a0 and stored in the local slot at s0 − 24.",
      "expression": "21",
      "mnemonic": "li",
      "instructionLine": 14
    },
    {
      "id": "addition",
      "kind": "source",
      "label": "Integer addition",
      "sourceLines": [
        3
      ],
      "assemblyLines": [
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23
      ],
      "note": "The compiler loads x twice, adds the two 32-bit values with addw, and stores the result in doubled.",
      "expression": "x + x",
      "mnemonic": "addw",
      "instructionLine": 22
    },
    {
      "id": "result",
      "kind": "source",
      "label": "Return value",
      "sourceLines": [
        4
      ],
      "assemblyLines": [
        24
      ],
      "note": "The value of doubled is loaded into a0, the return-value register.",
      "expression": "doubled",
      "mnemonic": "ld",
      "instructionLine": 24
    },
    {
      "id": "restore",
      "kind": "teardown",
      "label": "Frame teardown",
      "sourceLines": [
        4
      ],
      "assemblyLines": [
        25,
        26,
        27,
        28,
        29
      ],
      "note": "The saved return address, frame pointer, and stack pointer are restored before ret returns to _start.",
      "expression": "return",
      "mnemonic": "ret",
      "instructionLine": 29
    },
    {
      "id": "fallthrough",
      "kind": "fallback",
      "label": "Implicit return",
      "sourceLines": [
        5
      ],
      "assemblyLines": [
        30,
        31,
        32,
        33,
        34,
        35
      ],
      "note": "The compiler also emits main's implicit return 0. This sequence is unreachable in this example because line 29 has already returned.",
      "expression": "}",
      "mnemonic": "li",
      "instructionLine": 30
    }
  ],
  "evidence": {
    "repository": "https://github.com/TT1nKer/fstCC",
    "commit": "34c14248287f042ad675d1c66a7d2487022bbcfd",
    "commitUrl": "https://github.com/TT1nKer/fstCC/commit/34c14248287f042ad675d1c66a7d2487022bbcfd",
    "commitDate": "2026-11-10T12:41:38-05:00",
    "capturedAt": "2026-11-21T02:21:10Z",
    "stage": "Stage 0 (fstcc0)",
    "target": "Linux little-endian RV64IM / LP64",
    "sourceOrigin": "This five-line example was authored for the site and compiled with an unmodified upstream compiler.",
    "mappingOrigin": "Line correspondence was manually checked against the generated assembly. These are explanatory groups, not compiler-emitted debug mappings.",
    "containerBase": "ubuntu:24.04@sha256:fe81560990fae86dc4743202b2cb4d3df98d0bcf949173cecef15ce1127ef852",
    "compilerSha256": "048fe057ec99f395f1f09f68f492659ead173cede87f526bcc8cdecee0c89ff4",
    "sourceSha256": "f9c27785b3f447e4388e9b2852d94311c987eeeeda6c00218c5385b395aedbba",
    "assemblySha256": "4b53831c1231b194e7289b992906280fdfb45d382e9b8dcbb20807647402076b",
    "toolVersions": {
      "qemu-riscv64": "qemu-riscv64 version 8.2.2 (Debian 1:8.2.2+ds-0ubuntu1.18)",
      "riscv64-linux-gnu-as": "GNU assembler (GNU Binutils for Ubuntu) 2.42",
      "riscv64-linux-gnu-ld": "GNU ld (GNU Binutils for Ubuntu) 2.42",
      "gcc": "gcc (Ubuntu 13.3.0-6ubuntu2~24.04.1) 13.3.0"
    },
    "commands": [
      "git clone https://github.com/TT1nKer/fstCC.git fstcc-evidence",
      "cd fstcc-evidence",
      "git checkout 34c14248287f042ad675d1c66a7d2487022bbcfd",
      "docker build -t ttinker-fstcc-evidence -f tools/Dockerfile .",
      "docker run --rm --user \"$(id -u):$(id -g)\" -v \"$PWD:/work\" ttinker-fstcc-evidence sh tools/verify.sh",
      "mkdir -p evidence\ncat > evidence/double.c <<'C'\nint main() {\n  int x = 21;\n  int doubled = x + x;\n  return doubled;\n}\nC",
      "docker run --rm --user \"$(id -u):$(id -g)\" -v \"$PWD:/work\" ttinker-fstcc-evidence qemu-riscv64 bootstrap/build/fstcc0 evidence/double.c evidence/double.s",
      "docker run --rm --user \"$(id -u):$(id -g)\" -v \"$PWD:/work\" ttinker-fstcc-evidence riscv64-linux-gnu-as -march=rv64im -mabi=lp64 evidence/double.s -o evidence/double.o",
      "docker run --rm --user \"$(id -u):$(id -g)\" -v \"$PWD:/work\" ttinker-fstcc-evidence riscv64-linux-gnu-ld -m elf64lriscv evidence/double.o -o evidence/double",
      "docker run --rm --user \"$(id -u):$(id -g)\" -v \"$PWD:/work\" ttinker-fstcc-evidence gcc -std=c11 -O0 -fsanitize=undefined -fno-sanitize-recover=all evidence/double.c -o evidence/reference-o0",
      "docker run --rm --user \"$(id -u):$(id -g)\" -v \"$PWD:/work\" ttinker-fstcc-evidence gcc -std=c11 -O2 -fsanitize=undefined -fno-sanitize-recover=all evidence/double.c -o evidence/reference-o2",
      "docker run --rm --user \"$(id -u):$(id -g)\" -v \"$PWD:/work\" ttinker-fstcc-evidence sh -c 'qemu-riscv64 evidence/double; result=$?; printf \"Observed exit status: %s\\n\" \"$result\"; test \"$result\" -eq 42'",
      "docker run --rm --user \"$(id -u):$(id -g)\" -v \"$PWD:/work\" ttinker-fstcc-evidence sh -c 'evidence/reference-o0; result=$?; test \"$result\" -eq 42'",
      "docker run --rm --user \"$(id -u):$(id -g)\" -v \"$PWD:/work\" ttinker-fstcc-evidence sh -c 'evidence/reference-o2; result=$?; test \"$result\" -eq 42'"
    ],
    "sampleRuns": [
      {
        "label": "fstCC / QEMU",
        "exitCode": 42,
        "stdout": "",
        "stderr": ""
      },
      {
        "label": "GCC -O0 / UBSan",
        "exitCode": 42,
        "stdout": "",
        "stderr": ""
      },
      {
        "label": "GCC -O2 / UBSan",
        "exitCode": 42,
        "stdout": "",
        "stderr": ""
      }
    ],
    "verification": {
      "command": "sh tools/verify.sh",
      "passed": 252,
      "total": 252,
      "generatedPrograms": 128,
      "seed": 376,
      "byteIdenticalCompilerBuilds": true,
      "reportPath": "bootstrap/build/tests-8m7opv5z/report.json"
    },
    "checks": [
      {
        "label": "Sample execution",
        "observed": "Exit status 42 under QEMU; no stdout or stderr."
      },
      {
        "label": "Independent comparison",
        "observed": "GCC -O0 and -O2 with undefined-behavior sanitization also exit 42 with no diagnostics."
      },
      {
        "label": "Repository validation",
        "observed": "252 / 252 checks passed, including 128 generated programs with seed 376."
      },
      {
        "label": "Rebuild check",
        "observed": "Two clean compiler builds were byte-identical in the recorded toolchain."
      }
    ],
    "limitations": [
      "This is one observed example, not a claim of ISO C conformance or general compiler correctness.",
      "Linux exit status exposes only the low eight bits; 42 is exactly representable. The upstream differential suite separately checks full 32-bit return values.",
      "The compiler emits unoptimized assembly, including the unreachable implicit return shown in the full output.",
      "Package versions may change on a future Docker build; the versions and hashes recorded here identify this run."
    ],
    "links": [
      {
        "label": "Pinned compiler source",
        "href": "https://github.com/TT1nKer/fstCC/blob/34c14248287f042ad675d1c66a7d2487022bbcfd/bootstrap/src/fstcc0.s"
      },
      {
        "label": "L0 language contract",
        "href": "https://github.com/TT1nKer/fstCC/blob/34c14248287f042ad675d1c66a7d2487022bbcfd/doc/l0-language.md"
      },
      {
        "label": "Validation procedure",
        "href": "https://github.com/TT1nKer/fstCC/blob/34c14248287f042ad675d1c66a7d2487022bbcfd/tools/verify.sh"
      }
    ]
  }
} satisfies { rows: CompilerCorrespondenceRow[]; [key: string]: unknown };
