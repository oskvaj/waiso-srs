import { PrismaClient, QuestionType } from "@/../generated/prisma";

const prisma = new PrismaClient();

async function clearDatabase() {
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  for (const { tablename } of tablenames) {
    if (tablename === "_prisma_migrations") continue;
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE "public"."${tablename}" CASCADE`,
    );
  }
}

// --- Module content (rich TipTap JSON from the SQL dump) ---

const positionalNumeralSystemsContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          text: "In a positional number system, the value of a digit depends on its position within the number. Each position represents a power of the system's base, and the number's total value is the sum of each digit multiplied by its corresponding power of the base.",
          type: "text",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          text: "The familiar decimal system uses base 10, with digits 0-9. The number 247, for example, means 2×10² + 4×10¹ + 7×10⁰ = 2×100 + 4×10 + 7×1 = 200 + 40 + 7. The same principle applies to any base: change the base, change the set of valid digits and the powers used, but the underlying logic stays the same.",
          type: "text",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ text: "Binary (base 2)", type: "text" }],
    },
    {
      type: "paragraph",
      content: [
        {
          text: "Binary uses just two digits, 0 and 1, and each position represents a power of 2. Reading from right to left, the positions have values 1 (2⁰), 2 (2¹), 4 (2²), 8 (2³) and so on. The binary number 1011, for instance, equals 1×2³ + 0×2² + 1×2¹ + 1×2⁰ = 8 + 0 + 2 + 1 = 11 in decimal.",
          type: "text",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          text: "Binary is the native language of digital computers because electronic circuits can reliably represent two states, typically high and low voltage, corresponding to 1 and 0. Every piece of data a computer handles, from text to images to instructions, is ultimately stored and processed as binary.",
          type: "text",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ text: "Hexadecimal (base 16)", type: "text" }],
    },
    {
      type: "paragraph",
      content: [
        {
          text: "Hexadecimal, or hex, uses sixteen distinct digits: 0–9 followed by A–F, where A represents 10, B represents 11, and so on up to F for 15. Each position is a power of 16, so the hex number 2F equals 2×16¹ + 15×16⁰ = 32 + 15 = 47 in decimal.",
          type: "text",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          text: "Hex is popular in computing because it offers a compact, human-readable shorthand for binary. Since 16 is 2⁴, every hex digit corresponds to exactly four binary digits. The byte 11010110, for example, splits cleanly into 1101 and 0110, which translate to D (1101",
          type: "text",
        },
        { type: "inlineMath", attrs: { latex: "_{2}" } },
        { text: " = 13", type: "text" },
        { type: "inlineMath", attrs: { latex: "_{10}" } },
        { text: "  = D", type: "text" },
        { type: "inlineMath", attrs: { latex: "_{16}" } },
        { text: ") and 6 (0110", type: "text" },
        { type: "inlineMath", attrs: { latex: "_{2}" } },
        { text: " = 6", type: "text" },
        { type: "inlineMath", attrs: { latex: "_{6}" } },
        { text: " = 6", type: "text" },
        { type: "inlineMath", attrs: { latex: "_{16}" } },
        { text: "), written as D6 in hex.", type: "text" },
      ],
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ text: "Converting between bases", type: "text" }],
    },
    {
      type: "paragraph",
      content: [
        {
          text: "Converting from any base to decimal follows directly from the positional definition: multiply each digit by its corresponding power of the base and sum the results. Between binary and hex, the four-bits-per-digit relationship makes conversion almost mechanical, which is a large part of why the two systems coexist so comfortably in computing.",
          type: "text",
        },
      ],
    },
  ],
};

const booleanAlgebraContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ text: "The Operations NOT, AND, OR", type: "text" }],
    },
    {
      type: "paragraph",
      content: [
        {
          text: "The three fundamental Boolean operations are the building blocks from which all logic and boolean algebra can be constructed:",
          type: "text",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        { text: "NOT", type: "text", marks: [{ type: "bold" }] },
        { text: " (negation, an overline such as ", type: "text" },
        { type: "inlineMath", attrs: { latex: "\\overline{x}" } },
        {
          text: ") is an operation that inverts its input: NOT 0 = 1 and NOT 1 = 0.",
          type: "text",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        { text: "AND", type: "text", marks: [{ type: "bold" }] },
        { text: " (conjunction, multiplication, ×) is a ", type: "text" },
        { text: "binary", type: "text", marks: [{ type: "italic" }] },
        { text: " operation that yields 1 only when ", type: "text" },
        { text: "both", type: "text", marks: [{ type: "italic" }] },
        {
          text: ' inputs are 1. It corresponds to the logical "and" in everyday language. So 1×1=1, 1×0=0, 0×1=0, 0×0=0 ',
          type: "text",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        { text: "OR", type: "text", marks: [{ type: "bold" }] },
        { text: " (disjunction, addition, or +) is a ", type: "text" },
        { text: "binary", type: "text", marks: [{ type: "italic" }] },
        { text: " operation that yields 1 when ", type: "text" },
        { text: "at least one", type: "text", marks: [{ type: "italic" }] },
        { text: " input is 1. Note that this is the ", type: "text" },
        { text: "inclusive", type: "text", marks: [{ type: "italic" }] },
        {
          text: " or — it is also true when both inputs are 1. So 1+1=1, 1+0=1, 0+1=1, 0+0=0",
          type: "text",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        { text: "Together, {NOT, AND, OR} form a ", type: "text" },
        {
          text: "functionally complete",
          type: "text",
          marks: [{ type: "italic" }],
        },
        {
          text: " set, meaning any Boolean function whatsoever can be expressed using only these three operations. However a fourth operation is also common, XOR.",
          type: "text",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        { text: "XOR", type: "text", marks: [{ type: "bold" }] },
        {
          text: " (⊕) is an exclusive OR operation meaning only one input can be 1 for the coutcome to be 1. So 1⊕1=0, 1⊕0=1, 0⊕1=1, 0⊕0=0",
          type: "text",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ text: "Logic Gates ", type: "text" }],
    },
    {
      type: "paragraph",
      content: [
        { text: "A ", type: "text" },
        { text: "logic gate network", type: "text", marks: [{ type: "bold" }] },
        {
          text: " is a circuit built from interconnected logic gates that processes binary signals — values that are either 0 (false, low voltage) or 1 (true, high voltage). These networks form the foundation of all digital electronics, from simple calculators to modern processors. By combining gates, that preform the above described operations, in different configurations, we can implement any Boolean function, perform arithmetic, store data, and make decisions in hardware.",
          type: "text",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ text: "Calculation Rules", type: "text" }],
    },
    {
      type: "paragraph",
      content: [
        {
          text: "Boolean algebra obeys a set of laws that allow expressions to be rewritten and simplified, much like ordinary algebra. The most important rules include:",
          type: "text",
        },
      ],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                { text: " The ", type: "text" },
                {
                  text: "commutative laws,",
                  type: "text",
                  marks: [{ type: "bold" }],
                },
                { text: " A × B = B × A and A + B = B + A", type: "text" },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                { text: "The ", type: "text" },
                {
                  text: "associative laws",
                  type: "text",
                  marks: [{ type: "bold" }],
                },
                { text: ", A + (B + C) = (A + B) + C", type: "text" },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                { text: "The ", type: "text" },
                {
                  text: "distributive laws",
                  type: "text",
                  marks: [{ type: "bold" }],
                },
                {
                  text: ", which include both A × (B + C) = (A × B) + (A × C) as well as A + (B × C) = (A + B) × (A + C)",
                  type: "text",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                { text: "The ", type: "text" },
                {
                  text: "identity laws",
                  type: "text",
                  marks: [{ type: "bold" }],
                },
                { text: ", A + 0 = A and A × 1 = A", type: "text" },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                { text: "The ", type: "text" },
                {
                  text: "complement laws",
                  type: "text",
                  marks: [{ type: "bold" }],
                },
                { text: ", A + ", type: "text" },
                { type: "inlineMath", attrs: { latex: "\\overline{A}" } },
                { text: " = 1 and A × ", type: "text" },
                { type: "inlineMath", attrs: { latex: "\\overline{A}" } },
                { text: "= 0.", type: "text" },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  text: "De Morgan's laws, ",
                  type: "text",
                  marks: [{ type: "bold" }],
                },
                { type: "inlineMath", attrs: { latex: "\\overline{(A × B)}" } },
                { text: " = ", type: "text" },
                { type: "inlineMath", attrs: { latex: "\\overline{A}" } },
                { text: " + ", type: "text" },
                { type: "inlineMath", attrs: { latex: "\\overline{B}" } },
                { text: " and ", type: "text" },
                { type: "inlineMath", attrs: { latex: "\\overline{(A + B)}" } },
                { text: " = ", type: "text" },
                { type: "inlineMath", attrs: { latex: "\\overline{A}" } },
                { text: " × ", type: "text" },
                { type: "inlineMath", attrs: { latex: "\\overline{B}" } },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  text: "The absorption law",
                  type: "text",
                  marks: [{ type: "bold" }],
                },
                { text: " (A + (A × B) = A)", type: "text" },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                { text: " ", type: "text" },
                {
                  text: "Idempotence",
                  type: "text",
                  marks: [{ type: "bold" }],
                },
                { text: " (A × A = A, A + A = A)", type: "text" },
              ],
            },
          ],
        },
      ],
    },
    { type: "paragraph" },
  ],
};

const moreGatesContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          text: "In addition to the basic gates, three more gates are commonly used in digital logic. Each is formed by negating the output of one of the gates already introduced — essentially, an inverter (NOT) is placed at the output of an AND, OR, or XOR gate.",
          type: "text",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        { text: "NAND", type: "text", marks: [{ type: "bold" }] },
        {
          text: " (NOT-AND) yields the inverse of AND. The output is 0 only when both inputs are 1, and 1 in all other cases. So ",
          type: "text",
        },
        { type: "inlineMath", attrs: { latex: "\\overline{1\\times1}=0" } },
        { text: ",  ", type: "text" },
        { type: "inlineMath", attrs: { latex: "\\overline{1\\times0}=1" } },
        { text: ",  ", type: "text" },
        { type: "inlineMath", attrs: { latex: "\\overline{0\\times1}=1" } },
        { text: ",  ", type: "text" },
        { type: "inlineMath", attrs: { latex: "\\overline{0\\times0}=1" } },
        { text: ".", type: "text" },
      ],
    },
    {
      type: "paragraph",
      content: [
        { text: "NOR", type: "text", marks: [{ type: "bold" }] },
        {
          text: " (NOT-OR) yields the inverse of OR. The output is 1 only when both inputs are 0, and 0 otherwise. So ",
          type: "text",
        },
        { type: "inlineMath", attrs: { latex: "\\overline{1+1}=0" } },
        { text: ",  ", type: "text" },
        { type: "inlineMath", attrs: { latex: "\\overline{1+0}=0" } },
        { text: ", ", type: "text" },
        { type: "inlineMath", attrs: { latex: "\\overline{0+1}=0" } },
        { text: ",  ", type: "text" },
        { type: "inlineMath", attrs: { latex: "\\overline{0+0}=1" } },
        { text: ".", type: "text" },
      ],
    },
    {
      type: "paragraph",
      content: [
        { text: "XNOR", type: "text", marks: [{ type: "bold" }] },
        {
          text: " (NOT-XOR), written NXOR, yields the inverse of XOR. The output is 1 when both inputs are equal, and 0 when they differ. For this reason it is also called the ",
          type: "text",
        },
        { text: "equivalence", type: "text", marks: [{ type: "italic" }] },
        { text: " gate. So ", type: "text" },
        { type: "inlineMath", attrs: { latex: "\\overline{1\\oplus1}=1" } },
        { text: ", ", type: "text" },
        { type: "inlineMath", attrs: { latex: "\\overline{1\\oplus0}=0" } },
        { text: ",  ", type: "text" },
        { type: "inlineMath", attrs: { latex: "\\overline{0\\oplus1}=0" } },
        { text: ",  ", type: "text" },
        { type: "inlineMath", attrs: { latex: "\\overline{0\\oplus0}=0" } },
        { text: ".", type: "text" },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          text: "A particularly important property of NAND and NOR is that each is ",
          type: "text",
        },
        {
          text: "functionally complete on its own",
          type: "text",
          marks: [{ type: "italic" }],
        },
        {
          text: " — any Boolean function whatsoever can be built using only NAND gates, or only NOR gates.",
          type: "text",
        },
      ],
    },
  ],
};

const functionAndTruthTablesContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          text: "A truth table is a systematic way of listing every possible combination of input values for a Boolean expression alongside the resulting output. If an expression has n variables, the table will have 2ⁿ rows, since each variable can independently be true or false.",
          type: "text",
        },
        { type: "hardBreak" },
        {
          text: "For instance the truth table for the AND operation looks like this:",
          type: "text",
        },
      ],
    },
    {
      type: "imageResize",
      attrs: {
        alt: null,
        src: "https://g6a2qahpd2.ufs.sh/f/21IHWhvlcBF8jOW8oHBXo2gzHFEfY91sJxRKSZqluIVU7j4m",
        title: null,
        width: null,
        height: null,
        wrapperStyle: "display: flex;",
        containerStyle: "position: relative; margin: 0px auto;",
      },
    },
    {
      type: "paragraph",
      content: [
        {
          text: "A function table generalizes this idea. Instead of describing a single logical operator, it describes any Boolean function, a description of every combinations of inputs to their output. Every Boolean function, no matter how complex, can be fully defined by its function table, and conversely, any function table can be expressed as a Boolean formula built from AND, OR, and NOT.",
          type: "text",
        },
        { type: "hardBreak" },
        {
          text: "Here is the function table for the function A x B+C",
          type: "text",
        },
      ],
    },
    {
      type: "imageResize",
      attrs: {
        alt: null,
        src: "https://g6a2qahpd2.ufs.sh/f/21IHWhvlcBF8jRQ4E2Xo2gzHFEfY91sJxRKSZqluIVU7j4mp",
        title: null,
        width: null,
        height: null,
        wrapperStyle: "display: flex;",
        containerStyle: "position: relative; margin: 0px auto;",
      },
    },
    {
      type: "paragraph",
      content: [
        {
          text: "Once a Boolean function is described by its function table, a natural question follows: how do we write down a formula that produces it? Two standard recipes do exactly this, and either one works for ",
          type: "text",
        },
        { text: "any", type: "text", marks: [{ type: "italic" }] },
        { text: " function.", type: "text" },
      ],
    },
    {
      type: "paragraph",
      content: [
        { text: "In ", type: "text" },
        {
          text: "disjunctive normal form (DNF)",
          type: "text",
          marks: [{ type: "bold" }],
        },
        {
          text: ", we look at the rows where the output is 1. Each such row is captured by an AND of its variables (negated when they are 0), and the rows are joined with OR. For the example above of the first three rows only the second, A=0, B=0 and C= 1 would be included and the term would be written as ",
          type: "text",
        },
        {
          type: "inlineMath",
          attrs: { latex: "(\\overline{A}\\times\\overline{B}\\times C)" },
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          text: "Conjunctive normal form (CNF)",
          type: "text",
          marks: [{ type: "bold" }],
        },
        {
          text: " flips the perspective: we focus on rows where the output is 0, build an OR-clause that rules each one out, and combine them with AND. For the first three rows here the first and third row would be included and the terms would be written as ",
          type: "text",
        },
        { type: "inlineMath", attrs: { latex: "( A + B + C )" } },
        {
          text: " (for the row where A=0, B=0, C=0) ",
          type: "text",
        },
        {
          type: "inlineMath",
          attrs: { latex: "\\times (A + \\overline{B} + C)" },
        },
        { text: " (for the row where A=0, B=1, C=0)", type: "text" },
      ],
    },
  ],
};

const grayEncodingContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        { text: "Gray code", type: "text", marks: [{ type: "bold" }] },
        {
          text: " is an alternative way of encoding integers in binary, designed so that ",
          type: "text",
        },
        {
          text: "consecutive numbers differ in exactly one bit",
          type: "text",
          marks: [{ type: "bold" }],
        },
        {
          text: ". This single-bit-change property is what distinguishes Gray code from standard binary representation. Do note that the binary representation and graycode representation of a number always has the same number of significant bits.",
          type: "text",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ text: "The Problem Gray Code Solves", type: "text" }],
    },
    {
      type: "paragraph",
      content: [
        {
          text: "In standard binary, moving from one number to the next can flip several bits at once. For example, going from 7 to 8 in 4-bit binary changes ",
          type: "text",
        },
        { text: "all four bits", type: "text", marks: [{ type: "italic" }] },
        { text: ": 7", type: "text" },
        { type: "inlineMath", attrs: { latex: "_{10}" } },
        { text: " = 0111", type: "text" },
        { type: "inlineMath", attrs: { latex: "_2" } },
        { text: ", 8", type: "text" },
        { type: "inlineMath", attrs: { latex: "_{10}" } },
        { text: " = 1000", type: "text" },
        { type: "inlineMath", attrs: { latex: "_2" } },
        {
          text: ". In physical systems, where multiple bits cannot be guaranteed to switch at exactly the same instant, such multi-bit transitions are problematic. If the bits change slightly out of sync, the system might briefly read an entirely wrong value (for instance, passing through 0110, 1110, or 1100 on its way from 0111 to 1000). Gray code eliminates this hazard by ensuring only one bit ever changes between adjacent values.",
          type: "text",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ text: "Converting Between Binary and Gray", type: "text" }],
    },
    {
      type: "paragraph",
      content: [
        { text: "The conversion uses the XOR operation.", type: "text" },
      ],
    },
    {
      type: "paragraph",
      content: [
        { text: "Binary → Gray:", type: "text", marks: [{ type: "bold" }] },
        {
          text: " Keep the most significant bit unchanged, then XOR each remaining bit with the bit to its left. ",
          type: "text",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          text: "For example, binary 1011: keep the leftmost 1 (the most significant bit), do XOR with the next bit ",
          type: "text",
        },
        { type: "inlineMath", attrs: { latex: "(1\\oplus0=1)" } },
        {
          text: " the second bit is a one. Do XOR with the next pair, (the 0 and 1 in positions 2 and 3 from the left), ",
          type: "text",
        },
        { type: "inlineMath", attrs: { latex: "(0\\oplus1=1)" } },
        {
          text: ", the third bit is a one. Do XOR with the final pair of bits (the 1 and 1 in positions 3 and 4 from the left), ",
          type: "text",
        },
        { type: "inlineMath", attrs: { latex: "(1\\oplus1=0)" } },
        {
          text: ", the final bit is a 0. Resulting in graycode 1110.",
          type: "text",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        { text: "Gray → Binary:", type: "text", marks: [{ type: "bold" }] },
        {
          text: " The most significant bit is again kept, and each subsequent binary bit is the XOR of the corresponding Gray bit with the previously computed binary bit:",
          type: "text",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          text: "Doing the previous example in reverse we start with graycode: 1110: Keep the first bit of 1. Do XOR between the first bit of the new binary number and the second bit of the Graycode number (1 from the new binary and 1 from the graycode we are converting (second 1 from the left)) ",
          type: "text",
        },
        { type: "inlineMath", attrs: { latex: "(1\\oplus1=0)" } },
        {
          text: ", the second bit of the new binary number is 0, so far we have 10xx. Do an XOR operation on the second bit of the new binary number and the third number of the old graycode number (a 0 from the binary and a 1 from the graycode) ",
          type: "text",
        },
        { type: "inlineMath", attrs: { latex: "(0\\oplus1=1)" } },
        {
          text: ", the third bit in the new binary number is a 1, so far we have 101x. Do a final XOR operation on the third bit of the binary and the fourth bit of the graycode number (a 1 from the binary and a 0 from the graycode) ",
          type: "text",
        },
        { type: "inlineMath", attrs: { latex: "(1\\oplus0=1)" } },
        {
          text: ", the final bit is a 1. The binary number is 1011, which is what we started with at the start of the previous example.",
          type: "text",
        },
      ],
    },
  ],
};

const conversionContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          text: "Once a Boolean function has been written in disjunctive or conjunctive form, it can be transformed into a circuit that uses only NAND gates or only NOR gates. The conversion process exploits a clever trick: applying double negation. Inverting an expression twice leaves it unchanged in meaning, but the two inversions can be redistributed so that every gate in the circuit becomes the same type using De Morgans Law.",
          type: "text",
        },
        { type: "hardBreak" },
        { type: "hardBreak" },
        {
          text: "Disjunctive to a NAND/NAND Network",
          type: "text",
          marks: [{ type: "bold" }],
        },
        { type: "hardBreak" },
        {
          text: "Disjunctive form is naturally a two-level structure. The first level consists of AND gates, and the second level is a single OR gate that combines all of these AND results into the final output.",
          type: "text",
        },
        { type: "hardBreak" },
        {
          text: "To turn this into a network of only NAND gates, we apply double negation to the whole expression and then use De Morgan's laws on the outer inverted OR gate. This will result in all AND and the OR gate converting to a NAND gate, while maintaining the two level structure.",
          type: "text",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          text: "Conjuctive to a NOR/NOR Network",
          type: "text",
          marks: [{ type: "bold" }],
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          text: "Conjunctive normal form mirrors this structure but with the roles of AND and OR swapped. So to convert into a NOR/NOR network you apply a double inversion to the entire expression again, and once again utilize De Morgnan's laws. This will convert the couter AND gate to a NOR gate and invert all the inner OR gates to NOR gates.",
          type: "text",
        },
      ],
    },
  ],
};

// --- Helper for short rich-text values used in question content ---
function richText(content: unknown[]) {
  return { type: "doc", content };
}
function para(content: unknown[]) {
  return { type: "paragraph", content };
}
function txt(text: string, marks?: { type: string }[]) {
  return marks ? { type: "text", text, marks } : { type: "text", text };
}
function math(latex: string) {
  return { type: "inlineMath", attrs: { latex } };
}
function plainDoc(text: string) {
  return richText([para([txt(text)])]);
}

// --- Question definitions ---
// Each question stores its name, type, and the JSON content blob.

type QuestionDef = {
  name: string;
  type: QuestionType;
  content: unknown;
};

// Module 1: Positional Numeral Systems
const positionalQuestions: QuestionDef[] = [
  {
    name: "Convert the number 45 to binary (base 2)",
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: plainDoc("Convert the number 45 to binary (base 2)"),
      answers: [
        { text: plainDoc("101101"), correct: true },
        { text: plainDoc("100101"), correct: false },
        { text: plainDoc("110101"), correct: false },
        { text: plainDoc("101011"), correct: false },
      ],
      explanation: richText([
        para([
          txt("45 = 32 + 8 + 4 + 1 = 1×2"),
          math("^{5}"),
          txt(" + 0×2"),
          math("^{4}"),
          txt(" + 1×2"),
          math("^{3}"),
          txt(" + 1×"),
          math("^{2}"),
          txt(" + 0×2"),
          math("^{1}"),
          txt(" + 1×2"),
          math("^{0}"),
          txt(" = 101101"),
        ]),
      ]),
    },
  },
  {
    name: "What is the decimal value of 2C",
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: richText([
        para([txt("What is the decimal value of 2C"), math("_{16}")]),
      ]),
      answers: [
        { text: plainDoc("42"), correct: false },
        { text: plainDoc("44"), correct: true },
        { text: plainDoc("46"), correct: false },
        { text: plainDoc("48"), correct: false },
      ],
      explanation: richText([
        para([
          txt("2C = 2×16"),
          math("^{1}"),
          txt(" + 12×16"),
          math("^{0}"),
          txt(" = 32 + 12 = 44"),
        ]),
      ]),
    },
  },
  {
    name: "Convert 11010 to decimal",
    type: QuestionType.FREE_TEXT,
    content: {
      question: richText([
        para([txt("Convert 11010"), math("_{2}"), txt(" to decimal")]),
      ]),
      answers: [{ text: "26", fuzzy: false }],
      explanation: richText([
        para([
          txt("11010 = 1×2"),
          math("^{4}"),
          txt(" + 1×2"),
          math("^{3}"),
          txt(" + 0×2"),
          math("^{2}"),
          txt(" + 1×2"),
          math("^{1}"),
          txt(" + 0×2"),
          math("^{0}"),
          txt(" = 16 + 8 + 0 + 2 + 0 = 26"),
        ]),
      ]),
    },
  },
  {
    name: "Convert the decimal number 200 to hexadecimal",
    type: QuestionType.FREE_TEXT,
    content: {
      question: plainDoc("Convert the decimal number 200 to hexadecimal"),
      answers: [{ text: "C8", fuzzy: false }],
      explanation: richText([
        para([
          txt("200 = 192 + 8 = 12×16"),
          math("^{1}"),
          txt(" + 8×16"),
          math("^{0}"),
          txt(" = C8"),
        ]),
      ]),
    },
  },
  {
    name: "Match the decimal values to their binary representation",
    type: QuestionType.PAIR,
    content: {
      question: plainDoc(
        "Match the decimal values to their binary representation",
      ),
      pairs: [
        { left: plainDoc("7"), right: plainDoc("111") },
        { left: plainDoc("16"), right: plainDoc("10000") },
        { left: plainDoc("21"), right: plainDoc("10101") },
      ],
      explanation: richText([
        para([
          txt("7 = 4 + 2 + 1 = 1×2"),
          math("^2"),
          txt(" + 1×2"),
          math("^1"),
          txt(" + 1×2"),
          math("^0"),
          txt(" = 111"),
        ]),
        para([txt("16 = 1×2"), math("^4"), txt(" = 10000")]),
        para([
          txt("21 = 16 + 4 + 1 = 1×2"),
          math("^4"),
          txt(" + 1×2"),
          math("^2"),
          txt(" + 1×2"),
          math("^0"),
          txt(" = 10101 "),
        ]),
      ]),
    },
  },
  {
    name: "Match the following hexadecimal number to their decimal representation",
    type: QuestionType.PAIR,
    content: {
      question: plainDoc(
        "Match the following hexadecimal number to their decimal representation",
      ),
      pairs: [
        { left: plainDoc("1F"), right: plainDoc("31") },
        { left: plainDoc("A0"), right: plainDoc("160") },
        { left: plainDoc("FF"), right: plainDoc("255") },
        { left: plainDoc("3B"), right: plainDoc("59") },
      ],
      explanation: richText([
        para([
          txt("1F = 1×16"),
          math("^1"),
          txt(" + 15×16"),
          math("^0"),
          txt(" = 16 + 15 = 31"),
        ]),
        para([
          txt("A0 = 10×16"),
          math("^1"),
          txt(" + 0×16"),
          math("^0"),
          txt(" = 160 + 0 = 160"),
        ]),
        para([
          txt("FF = 15×16"),
          math("^1"),
          txt(" + 15×16"),
          math("^0"),
          txt(" = 240 + 15 = 255"),
        ]),
        para([
          txt("3B = 3×16"),
          math("^1"),
          txt(" + 11×16"),
          math("^0"),
          txt(" = 48 + 11 = 59"),
        ]),
      ]),
    },
  },
  {
    name: "Convert B7 to its binary representation",
    type: QuestionType.FREE_TEXT,
    content: {
      question: richText([
        para([
          txt("Convert B7"),
          math("_{16}"),
          txt(" to its binary representation"),
        ]),
      ]),
      answers: [{ text: "10110111", fuzzy: false }],
      explanation: richText([
        para([
          txt("B"),
          math("_{16}"),
          txt(" = 11"),
          math("_{10}"),
          txt(" = 1011"),
          math("_2"),
        ]),
        para([
          txt("7"),
          math("_{16}"),
          txt(" = 7"),
          math("_{10}"),
          txt(" = 0111"),
          math("_2"),
        ]),
      ]),
    },
  },
  {
    name: "Convert 11011010 to hexadecimal",
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: richText([
        para([txt("Convert 11011010"), math("_2"), txt(" to hexadecimal")]),
      ]),
      answers: [
        { text: plainDoc("CA"), correct: false },
        { text: plainDoc("DA"), correct: true },
        { text: plainDoc("AD"), correct: false },
        { text: plainDoc("DB"), correct: false },
      ],
      explanation: richText([
        para([
          txt("1101"),
          math("_2"),
          txt(" = 13"),
          math("_{10}"),
          txt(" = D"),
          math("_{16}"),
        ]),
        para([
          txt("1010"),
          math("_2"),
          txt(" = 10"),
          math("_{10}"),
          txt(" = A"),
          math("_{16}"),
        ]),
      ]),
    },
  },
  {
    name: "Match these pairs",
    type: QuestionType.PAIR,
    content: {
      question: plainDoc("Match these pairs"),
      pairs: [
        {
          left: richText([para([txt("12"), math("_{10}")])]),
          right: richText([para([txt("C"), math("_{16}")])]),
        },
        {
          left: richText([para([txt("1010"), math("_2")])]),
          right: richText([para([txt("10"), math("_{10}")])]),
        },
        {
          left: richText([para([txt("1A"), math("_{16}")])]),
          right: richText([para([txt("26"), math("_{10}")])]),
        },
        {
          left: plainDoc("11111"),
          right: richText([para([txt("1F"), math("_{16}")])]),
        },
      ],
      explanation: richText([
        para([
          txt("12"),
          math("_{10}"),
          txt(" = 1100"),
          math("_2"),
          txt(" = C"),
          math("_{16}"),
        ]),
        para([
          txt("1010"),
          math("_2"),
          txt(" = 10"),
          math("_{10}"),
          txt(" = A"),
          math("_{16}"),
        ]),
        para([
          txt("1A"),
          math("_{16}"),
          txt(" = 26"),
          math("_{10}"),
          txt(" = 11010"),
          math("_2"),
        ]),
        para([
          txt("11111"),
          math("_2"),
          txt(" = 31"),
          math("_{10}"),
          txt(" = 1F"),
          math("_{16}"),
          txt(" "),
        ]),
      ]),
    },
  },
];

// Module 2: Boolean algebra
const booleanQuestions: QuestionDef[] = [
  {
    name: "What is the result of NOT(1) + (1 × 0)?",
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: richText([
        para([
          txt("What is the result of the following Boolean expression: "),
          math("\\overline{1}"),
          txt(" + (1 × 0)?"),
        ]),
      ]),
      answers: [
        { text: plainDoc("0"), correct: true },
        { text: plainDoc("1"), correct: false },
        { text: plainDoc("Cannot be determined"), correct: false },
        { text: plainDoc("Both 0 and 1"), correct: false },
      ],
      explanation: richText([
        para([math("\\overline{1}"), txt(" = 0, 1 × 0 = 0, 0+0=0")]),
      ]),
    },
  },
  {
    name: "Which of the following statements about the XOR operation are true?",
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: plainDoc(
        "Which of the following statements about the XOR operation are true?",
      ),
      answers: [
        { text: plainDoc("1 ⊕ 1 = 1"), correct: false },
        { text: plainDoc("1 ⊕ 0 = 1"), correct: true },
        { text: plainDoc(" 0 ⊕ 0 = 0 "), correct: true },
        {
          text: plainDoc("XOR yields 1 when both inputs are 1"),
          correct: false,
        },
        {
          text: plainDoc("XOR yields 1 when exactly one input is 1"),
          correct: true,
        },
      ],
      explanation: richText([
        para([
          txt("XOR", [{ type: "bold" }]),
          txt(
            " (⊕) is an exclusive OR operation meaning only one input can be 1 for the coutcome to be 1. So 1⊕1=0, 1⊕0=1, 0⊕1=1, 0⊕0=0",
          ),
        ]),
      ]),
    },
  },
  {
    name: "According to De Morgan's law, NOT(A × B) is equal to which expression?",
    type: QuestionType.FREE_TEXT,
    content: {
      question: richText([
        para([
          txt(
            "According to De Morgan's law, NOT(A × B) is equal to which expression? ",
          ),
          txt("Write not operations as NOT(x)", [{ type: "bold" }]),
        ]),
      ]),
      answers: [{ text: "NOT(A) + NOT(B)", fuzzy: true }],
      explanation: richText([
        para([
          txt("De Morgan's laws, ", [{ type: "bold" }]),
          math("\\overline{(A × B)}"),
          txt(" = "),
          math("\\overline{A}"),
          txt(" + "),
          math("\\overline{B}"),
          txt(" and "),
          math("\\overline{(A + B)}"),
          txt(" = "),
          math("\\overline{A}"),
          txt(" × "),
          math("\\overline{B}"),
        ]),
      ]),
    },
  },
  {
    name: "Match each Boolean law on the left with its correct expression on the right.",
    type: QuestionType.PAIR,
    content: {
      question: plainDoc(
        "Match each Boolean law on the left with its correct expression on the right.",
      ),
      pairs: [
        { left: plainDoc("Commutative law"), right: plainDoc("A + B = B + A") },
        {
          left: plainDoc("Distributive law"),
          right: plainDoc("A × (B + C) = (A × B) + (A × C)"),
        },
        { left: plainDoc("Identity law"), right: plainDoc("A × 1 = A") },
        {
          left: plainDoc("Absorption law"),
          right: plainDoc("A + (A × B) = A"),
        },
      ],
    },
  },
  {
    name: 'Which logic operation corresponds to "at least one of these is true"?',
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: plainDoc(
        'Which logic operation corresponds to the everyday meaning of "at least one of these is true"?',
      ),
      answers: [
        { text: plainDoc("NOT"), correct: false },
        { text: plainDoc("AND"), correct: false },
        { text: plainDoc("XOR"), correct: false },
        { text: plainDoc("OR"), correct: true },
      ],
      explanation: richText([
        para([
          txt("OR", [{ type: "bold" }]),
          txt(" (disjunction, addition, or +) is a "),
          txt("binary", [{ type: "italic" }]),
          txt(" operation that yields 1 when "),
          txt("at least one", [{ type: "italic" }]),
          txt(" input is 1. Note that this is the "),
          txt("inclusive", [{ type: "italic" }]),
          txt(
            " or — it is also true when both inputs are 1. So 1+1=1, 1+0=1, 0+1=1, 0+0=0",
          ),
        ]),
      ]),
    },
  },
  {
    name: "Which single operation gives output 1 only when its two inputs are different?",
    type: QuestionType.FREE_TEXT,
    content: {
      question: plainDoc(
        "Which single operation gives output 1 only when its two inputs are different from each other?",
      ),
      answers: [{ text: "XOR", fuzzy: false }],
      explanation: richText([
        para([
          txt("XOR", [{ type: "bold" }]),
          txt(
            " (⊕) is an exclusive OR operation meaning only one input can be 1 for the coutcome to be 1. So 1⊕1=0, 1⊕0=1, 0⊕1=1, 0⊕0=0",
          ),
        ]),
      ]),
    },
  },
  {
    name: "Which expressions are equal to A according to the Boolean calculation rules?",
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: plainDoc(
        "Which of the following expressions are equal to A according to the Boolean calculation rules?",
      ),
      answers: [
        { text: plainDoc("A + 0"), correct: true },
        { text: plainDoc("A × 1"), correct: true },
        { text: plainDoc("A + (A × B)"), correct: true },
        { text: plainDoc("A × A"), correct: true },
        { text: plainDoc("A + 1"), correct: false },
      ],
    },
  },
  {
    name: "Simplify A × (B + 1) + (A × A)",
    type: QuestionType.FREE_TEXT,
    content: {
      question: plainDoc(
        "What is the simplified result of the expression A × (B + 1) + (A × A)?",
      ),
      answers: [{ text: "A", fuzzy: false }],
      explanation: plainDoc(
        "B + 1 = 1, A × A = A -> A × (B + 1) + (A × A) = A × (1) + A = A + A = A",
      ),
    },
  },
];

// Module 3: Function and Truth Tables
const truthTableQuestions: QuestionDef[] = [
  {
    name: "How many rows does a truth table have if the Boolean expression contains n variables?",
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: richText([
        para([
          txt(
            "How many rows does a truth table have if the Boolean expression contains ",
          ),
          txt("n", [{ type: "italic" }]),
          txt(" variables?"),
        ]),
      ]),
      answers: [
        { text: plainDoc("n"), correct: false },
        { text: plainDoc("2n"), correct: false },
        { text: richText([para([txt("2"), math("^n")])]), correct: true },
        { text: richText([para([txt("n"), math("^2")])]), correct: false },
      ],
      explanation: richText([
        para([
          txt("the truth table will have 2"),
          math("^n"),
          txt(" rows where n is the number of variables"),
        ]),
      ]),
    },
  },
  {
    name: "What is the main purpose of a truth table?",
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: plainDoc("What is the main purpose of a truth table?"),
      answers: [
        {
          text: plainDoc("To simplify Boolean expressions automatically"),
          correct: false,
        },
        {
          text: plainDoc(
            "To list every possible combination of input values alongside the resulting output",
          ),
          correct: true,
        },
        {
          text: plainDoc("To convert decimal numbers into binary"),
          correct: false,
        },
        { text: plainDoc("To design physical circuits"), correct: false },
      ],
    },
  },
  {
    name: "Which statements about function tables are correct?",
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: plainDoc("Which statements about function tables are correct?"),
      answers: [
        {
          text: plainDoc("A function table can describe any Boolean function,"),
          correct: true,
        },
        {
          text: plainDoc(
            "Every Boolean function can be fully defined by its function table",
          ),
          correct: true,
        },
        {
          text: plainDoc("A function table can only describe simple functions"),
          correct: false,
        },
        {
          text: plainDoc(
            "Any function table can be expressed as a Boolean formula using AND, OR, and NOT",
          ),
          correct: true,
        },
      ],
    },
  },
  {
    name: "Match each term to its correct description",
    type: QuestionType.PAIR,
    content: {
      question: plainDoc("Match each term to its correct description:"),
      pairs: [
        {
          left: plainDoc("Truth table"),
          right: plainDoc(
            "A table describing any Boolean function and its outputs",
          ),
        },
        {
          left: plainDoc("Function table"),
          right: plainDoc(
            "A systematic listing of input combinations and outputs for a Boolean expression",
          ),
        },
        {
          left: plainDoc("Boolean variable"),
          right: plainDoc(
            "A value that can independently be true (1) or false (0)",
          ),
        },
      ],
      explanation: richText([{ type: "paragraph" }]),
    },
  },
  {
    name: "Match the number of variables to the correct number of rows in the truth table",
    type: QuestionType.PAIR,
    content: {
      question: plainDoc(
        "Match the number of variables to the correct number of rows in the truth table:",
      ),
      pairs: [
        { left: plainDoc("2"), right: plainDoc("4") },
        { left: plainDoc("3"), right: plainDoc("8") },
        { left: plainDoc("1"), right: plainDoc("2") },
      ],
      explanation: richText([
        para([
          txt("There are 2"),
          math("^n"),
          txt(" rows in a truthtable where n is the number of variables"),
        ]),
      ]),
    },
  },
  {
    name: "What name is given to the type of table that systematically lists every combination of inputs and outputs?",
    type: QuestionType.FREE_TEXT,
    content: {
      question: plainDoc(
        "What name is given to the type of table that systematically lists every possible combination of input values for a Boolean expression along with its output?",
      ),
      answers: [{ text: "truth table", fuzzy: true }],
    },
  },
  {
    name: "In disjunctive normal form (DNF), which rows do we focus on?",
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: plainDoc(
        "In disjunctive normal form (DNF), which rows of the function table do we focus on when constructing the formula?",
      ),
      answers: [
        { text: plainDoc("Rows where the output is 0"), correct: false },
        { text: plainDoc("Rows where the output is 1"), correct: true },
        { text: plainDoc("Rows where all inputs are 1"), correct: false },
        { text: plainDoc("Rows where all inputs are 0"), correct: false },
      ],
      explanation: richText([
        para([
          txt("In "),
          txt("disjunctive normal form (DNF)", [{ type: "bold" }]),
          txt(
            ", we look at the rows where the output is 1. Each such row is captured by an AND of its variables (negated when they are 0), and the rows are joined with OR. ",
          ),
        ]),
      ]),
    },
  },
  {
    name: "In conjunctive normal form (CNF), which operators connect variables and terms?",
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: plainDoc(
        "In conjunctive normal form (CNF), each term is built by combining varriables with which operator, and terms are then joined by which operator?",
      ),
      answers: [
        {
          text: plainDoc("Variables joined by AND; Terms joined by OR"),
          correct: false,
        },
        {
          text: plainDoc("Variables joined by OR; Terms joined by AND"),
          correct: true,
        },
        {
          text: plainDoc("Variables joined by AND; Terms joined by AND"),
          correct: false,
        },
        {
          text: plainDoc("Variables joined by OR; Terms joined by OR"),
          correct: false,
        },
      ],
      explanation: richText([
        para([
          txt("Conjunctive normal form (CNF)", [{ type: "bold" }]),
          txt(
            " we focus on rows where the output is 0, build an OR-clause that rules each one out (inverting the input if 1), and combine them with AND. ",
          ),
        ]),
      ]),
    },
  },
  {
    name: "Which of the following statements about DNF and CNF are true?",
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: plainDoc(
        "Which of the following statements about DNF and CNF are true?",
      ),
      answers: [
        {
          text: plainDoc("Every Boolean function can be expressed in DNF."),
          correct: true,
        },
        {
          text: plainDoc("Every Boolean function can be expressed in CNF."),
          correct: true,
        },
        {
          text: plainDoc(
            "DNF is built by reading off rows where the output is 1, while CNF is built by reading off rows where the output is 0.",
          ),
          correct: true,
        },
        {
          text: plainDoc(
            "Only functions with at most three variables can be written in DNF or CNF.",
          ),
          correct: false,
        },
      ],
      explanation: richText([
        para([
          txt("In "),
          txt("disjunctive normal form (DNF)", [{ type: "bold" }]),
          txt(
            ", we look at the rows where the output is 1. Each such row is captured by an AND of its variables (negated when they are 0), and the rows are joined with OR.",
          ),
        ]),
        para([
          txt("Conjunctive normal form (CNF)", [{ type: "bold" }]),
          txt(
            " flips the perspective: we focus on rows where the output is 0, build an OR-clause that rules each one out, and combine them with AND.",
          ),
        ]),
      ]),
    },
  },
];

// Module 4: More gates
const moreGatesQuestions: QuestionDef[] = [
  {
    name: "What is the output of a NAND gate when both inputs are 1?",
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: plainDoc(
        "What is the output of a NAND gate when both inputs are 1?",
      ),
      answers: [
        { text: plainDoc("1"), correct: false },
        { text: plainDoc("0"), correct: true },
        { text: plainDoc("Undefined"), correct: false },
        { text: plainDoc("Depends on voltage level"), correct: false },
      ],
      explanation: plainDoc(
        "NAND is the inverse of AND. Since 1 AND 1 = 1, NAND inverts this to 0.",
      ),
    },
  },
  {
    name: "A NOR gate outputs 1 in which of the following situations?",
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: plainDoc(
        "A NOR gate outputs 1 in which of the following situations?",
      ),
      answers: [
        { text: plainDoc("When both inputs are 1"), correct: false },
        { text: plainDoc("When exactly one input is 1"), correct: false },
        { text: plainDoc("When both inputs are 0"), correct: true },
        { text: plainDoc("When the inputs differ"), correct: false },
      ],
      explanation: plainDoc(
        "NOR is the inverse of OR. Only 0 OR 0 = 0, so its inversion gives 1.",
      ),
    },
  },
  {
    name: "Why is the NXOR gate also known as the equivalence gate?",
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: richText([
        para([
          txt("Why is the NXOR gate also known as the "),
          txt("equivalence", [{ type: "italic" }]),
          txt(" gate?"),
        ]),
      ]),
      answers: [
        {
          text: plainDoc(
            "Because it always outputs the same value as its inputs",
          ),
          correct: false,
        },
        {
          text: plainDoc(
            "Because it outputs 1 only when the two inputs are equal",
          ),
          correct: true,
        },
        {
          text: plainDoc("Because it is equivalent to a NAND gate"),
          correct: false,
        },
        {
          text: plainDoc("Because it produces the same output as an OR gate"),
          correct: false,
        },
      ],
    },
  },
  {
    name: "Which statements are TRUE about NAND and NOR gates?",
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: plainDoc(
        "Which of the following statements are TRUE about NAND and NOR gates?",
      ),
      answers: [
        {
          text: plainDoc("NAND is functionally complete on its own"),
          correct: true,
        },
        {
          text: plainDoc("NOR is functionally complete on its own"),
          correct: true,
        },
        {
          text: plainDoc(
            "NAND and NOR can only be used together to build any Boolean function",
          ),
          correct: false,
        },
        {
          text: plainDoc("XNOR isfunctionally complete on its own"),
          correct: false,
        },
      ],
      explanation: plainDoc(
        "Both NAND and NOR are individually functionally complete. XNOR is not.",
      ),
    },
  },
  {
    name: "Which input combinations produce an output of 1?",
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: plainDoc(
        "Which of the following input combinations produce an output of 1?",
      ),
      answers: [
        {
          text: richText([para([math("\\overline{0\\times0}")])]),
          correct: true,
        },
        {
          text: richText([para([math("\\overline{1+0}")])]),
          correct: false,
        },
        {
          text: richText([para([math("\\overline{1\\oplus1}")])]),
          correct: true,
        },
        {
          text: richText([para([math("\\overline{0\\oplus1}")])]),
          correct: false,
        },
        {
          text: richText([para([math("\\overline{0+0}")])]),
          correct: true,
        },
      ],
      explanation: richText([{ type: "paragraph" }]),
    },
  },
  {
    name: "How can NAND, NOR, and XNOR be described in terms of basic gates?",
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: plainDoc(
        "How can each of the gates NAND, NOR, and XNOR be described in terms of the basic gates?",
      ),
      answers: [
        {
          text: plainDoc(
            "They are entirely new operations unrelated to AND, OR, and XOR",
          ),
          correct: false,
        },
        {
          text: plainDoc(
            "They are formed by placing a NOT gate at the input of AND, OR, or XOR",
          ),
          correct: false,
        },
        {
          text: plainDoc(
            "They are formed by placing a NOT gate at the output of AND, OR, or XOR",
          ),
          correct: true,
        },
        {
          text: plainDoc(
            "They are formed by combining two AND gates with an OR gate",
          ),
          correct: false,
        },
      ],
    },
  },
];

// Module 5: Gray-encoding
const grayQuestions: QuestionDef[] = [
  {
    name: "What is the defining property of Gray code?",
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: plainDoc(
        "What is the defining property of Gray code that distinguishes it from standard binary representation?",
      ),
      answers: [
        {
          text: plainDoc("Gray code uses fewer bits than standard binary"),
          correct: false,
        },
        {
          text: plainDoc("Consecutive numbers differ in exactly one bit"),
          correct: true,
        },
        {
          text: plainDoc("Gray code can represent negative numbers"),
          correct: false,
        },
        { text: plainDoc("Gray code always starts with a 1"), correct: false },
      ],
      explanation: plainDoc(
        "Gray code is specifically designed so that any two consecutive numbers differ in exactly one bit position, which is the single property that distinguishes it from standard binary.",
      ),
    },
  },
  {
    name: "In 4-bit binary, going from 7 to 8 changes how many bits?",
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: richText([
        para([
          txt("In 4-bit binary, going from 7"),
          math("_{10}"),
          txt(" (0111"),
          math("_2"),
          txt(") to 8"),
          math("_{10}"),
          txt(" (1000"),
          math("_2"),
          txt(") changes how many bits?"),
        ]),
      ]),
      answers: [
        { text: plainDoc("1"), correct: false },
        { text: plainDoc("2"), correct: false },
        { text: plainDoc("3"), correct: false },
        { text: plainDoc("4"), correct: true },
      ],
    },
  },
  {
    name: "Which Boolean operation is used to convert between binary and Gray code?",
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: plainDoc(
        "Which Boolean operation is used to convert between binary and Gray code?",
      ),
      answers: [
        { text: plainDoc("AND"), correct: false },
        { text: plainDoc("OR"), correct: false },
        { text: plainDoc("NOT"), correct: false },
        { text: plainDoc("XOR"), correct: true },
      ],
    },
  },
  {
    name: "When converting from binary to Gray code, what happens to the most significant bit?",
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: plainDoc(
        "When converting from binary to Gray code, what happens to the most significant bit?",
      ),
      answers: [
        { text: plainDoc("It is inverted"), correct: false },
        { text: plainDoc("It is kept unchanged"), correct: true },
        { text: plainDoc("It is XOR'ed with itself"), correct: false },
        { text: plainDoc("It is removed"), correct: false },
      ],
    },
  },
  {
    name: "Convert the binary number 1011 to Gray code.",
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: plainDoc("Convert the binary number 1011 to Gray code."),
      answers: [
        { text: plainDoc("1110"), correct: true },
        { text: plainDoc("1101"), correct: false },
        { text: plainDoc("0111"), correct: false },
        { text: plainDoc("1011"), correct: false },
      ],
      explanation: plainDoc(
        "Keep the leading 1, then XOR each pair of adjacent bits: 1⊕0=1, 0⊕1=1, 1⊕1=0, giving 1110",
      ),
    },
  },
  {
    name: "Which statements about Gray code are correct?",
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: plainDoc(
        "Which of the following statements about Gray code are correct?",
      ),
      answers: [
        {
          text: plainDoc(
            "Gray code and the binary representation of a number always have the same number of significant bits",
          ),
          correct: true,
        },
        {
          text: plainDoc(
            "Gray code eliminates the hazard of multi-bit transitions in physical systems",
          ),
          correct: true,
        },
        {
          text: plainDoc("Gray code uses three digits instead of two"),
          correct: false,
        },
        {
          text: plainDoc(
            "Converting between binary and Gray code uses the XOR operation",
          ),
          correct: true,
        },
      ],
      explanation: plainDoc(
        "Gray code is still a binary encoding (only 0s and 1s), uses the same bit-width as standard binary, prevents multi-bit transition hazards, and is built on the XOR operation.",
      ),
    },
  },
  {
    name: "Convert the Gray code 1110 to binary.",
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: plainDoc("Convert the Gray code 1110 to binary."),
      answers: [
        { text: plainDoc("1110"), correct: false },
        { text: plainDoc("0100"), correct: false },
        { text: plainDoc("1011"), correct: true },
        { text: plainDoc("1001"), correct: false },
      ],
      explanation: plainDoc(
        "Keep the leading 1, then XOR each new binary bit with the next Gray bit: 1⊕1=0, 0⊕1=1, 1⊕0=1, resulting in 1011",
      ),
    },
  },
];

// Module 6: Disjunctive/Conjunctive to NAND-NAND/NOR-NOR
const conversionQuestions: QuestionDef[] = [
  {
    name: "Disjunctive form is naturally a two-level structure. What does this consist of?",
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: plainDoc(
        "An expression in Disjunctive form is naturally a two-level structure. What does this structure consist of?",
      ),
      answers: [
        {
          text: plainDoc(
            "A first level of OR gates feeding into a single AND gate",
          ),
          correct: false,
        },
        {
          text: plainDoc(
            "A first level of NAND gates feeding into a single NOR gate",
          ),
          correct: false,
        },
        {
          text: plainDoc(
            "A first level of AND gates feeding into a single OR gate",
          ),
          correct: true,
        },
        {
          text: plainDoc(
            "A first level of XOR gates feeding into a single AND gate",
          ),
          correct: false,
        },
      ],
      explanation: plainDoc(
        "Disjunctive form is naturally a two-level structure where the first level consists of AND gates and the second level is a single OR gate that combines the AND results into the final output.",
      ),
    },
  },
  {
    name: "What mathematical trick is used to convert to NAND/NAND or NOR/NOR networks?",
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: plainDoc(
        "What mathematical trick is used to convert a disjunctive or conjunctive expression into a network of only NAND or only NOR gates?",
      ),
      answers: [
        { text: plainDoc("Single negation of the output"), correct: false },
        {
          text: plainDoc("Double negation combined with De Morgan's laws"),
          correct: true,
        },
        { text: plainDoc("Distributive law applied twice"), correct: false },
        { text: plainDoc("Idempotence of AND and OR"), correct: false },
      ],
      explanation: plainDoc(
        "Inverting an expression twice leaves its meaning unchanged, but the two inversions can be redistributed using De Morgan's laws so that every gate becomes the same type.",
      ),
    },
  },
  {
    name: "When converting a conjunctive expression to NOR/NOR, what happens to the outer AND gate?",
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: plainDoc(
        "When converting a conjunctive expression to a NOR/NOR network, what happens to the outer AND gate?",
      ),
      answers: [
        {
          text: plainDoc("It is removed from the circuit entirely"),
          correct: false,
        },
        { text: plainDoc("It is replaced with an inverter"), correct: false },
        {
          text: plainDoc("It stays as an AND gate but with inverted inputs"),
          correct: false,
        },
        { text: plainDoc("It is converted into a NOR gate"), correct: true },
      ],
      explanation: plainDoc(
        "Applying double inversion and then using De Morgan's laws on the CNF expression converts the outer AND gate into a NOR gate",
      ),
    },
  },
  {
    name: "Which statements about converting a disjunctive expression to NAND/NAND are correct?",
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: plainDoc(
        "Which of the following statements about converting a disjunctive expression to a NAND/NAND network are correct?",
      ),
      answers: [
        {
          text: plainDoc(
            "The two-level structure of the original disjunctive expression is preserved",
          ),
          correct: true,
        },
        {
          text: plainDoc("All the inner AND gates become NAND gates"),
          correct: true,
        },
        {
          text: plainDoc("The outer OR gate becomes a NAND gate"),
          correct: true,
        },
        {
          text: plainDoc(
            "The conversion requires changing the function's truth table",
          ),
          correct: false,
        },
      ],
      explanation: plainDoc(
        "The conversion using double negation and De Morgan's laws converts both the inner AND gates and the outer OR gate into NAND gates while maintaining the original two-level structure.",
      ),
    },
  },
  {
    name: "Which are true about the role of De Morgan's laws in NAND/NOR conversions?",
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: plainDoc(
        "Which of the following are true about the role of De Morgan's laws in NAND/NAD & NOR/NOR conversions?",
      ),
      answers: [
        {
          text: plainDoc(
            "They allow one of the two inversions to convert the outer gate from AND to NOR or OR to NAND",
          ),
          correct: true,
        },
        {
          text: plainDoc(
            "They change OR operations into AND-like operations under negation and vice versa",
          ),
          correct: true,
        },
        {
          text: plainDoc(
            "They eliminate the need for any inversions in the final circuit",
          ),
          correct: false,
        },
      ],
    },
  },
  {
    name: "Parallel between disjunct-to-NAND and conjunct-to-NOR conversions",
    type: QuestionType.MULTIPLE_CHOICE,
    content: {
      question: plainDoc(
        "Which of the following statements correctly describe the parallel between disjunct-to-NAND and conjunct-to-NOR conversions?",
      ),
      answers: [
        {
          text: plainDoc(
            "Both conversions begin by applying double negation to the entire expression",
          ),
          correct: true,
        },
        {
          text: plainDoc(
            "Both conversions use De Morgan's laws on the outer gate",
          ),
          correct: true,
        },
        {
          text: plainDoc(
            "Both conversions preserve the original two-level structure",
          ),
          correct: true,
        },
        {
          text: plainDoc(
            "Both conversions produce a circuit using a single, uniform type of gate",
          ),
          correct: true,
        },
      ],
      explanation: plainDoc(
        "The two procedures mirror each other exactly — both start with double inversion, both apply De Morgan's laws, both preserve the two-level structure, and both yield a uniform-gate network",
      ),
    },
  },
];

// --- Main seed function ---

async function main() {
  await clearDatabase();

  // Teacher
  const teacher = await prisma.user.create({
    data: {
      id: "teacher-1",
      name: "Oskar",
      email: "swedishguy997@gmail.com",
    },
  });
  await prisma.teacher.create({ data: { userId: teacher.id } });

  // Course
  const course = await prisma.course.create({
    data: {
      name: "Basic Computer Technology",
      description:
        "Proof of Concept course by creators of the application covering the basics of computer technology",
      published: false,
      teacherId: teacher.id,
    },
  });

  // Modules
  const positional = await prisma.module.create({
    data: {
      name: "Positional Numeral Systems",
      courseId: course.id,
      content: positionalNumeralSystemsContent,
    },
  });

  const booleanAlgebra = await prisma.module.create({
    data: {
      name: "Boolean algebra",
      courseId: course.id,
      content: booleanAlgebraContent,
    },
  });

  const truthTables = await prisma.module.create({
    data: {
      name: "Function and Truth Tables",
      courseId: course.id,
      content: functionAndTruthTablesContent,
    },
  });

  const moreGates = await prisma.module.create({
    data: {
      name: "More gates",
      courseId: course.id,
      content: moreGatesContent,
    },
  });

  const grayEncoding = await prisma.module.create({
    data: {
      name: "Gray-encoding",
      courseId: course.id,
      content: grayEncodingContent,
    },
  });

  const conversion = await prisma.module.create({
    data: {
      name: "Converting from disjuctive&conjunctive form to NAND/NAD & NOR/NOR",
      courseId: course.id,
      content: conversionContent,
    },
  });

  // Prerequisites (matches the dump's _ModulePrerequisite rows)
  await prisma.module.update({
    where: { id: truthTables.id },
    data: { prerequisites: { connect: [{ id: booleanAlgebra.id }] } },
  });
  await prisma.module.update({
    where: { id: moreGates.id },
    data: { prerequisites: { connect: [{ id: booleanAlgebra.id }] } },
  });
  await prisma.module.update({
    where: { id: grayEncoding.id },
    data: {
      prerequisites: {
        connect: [{ id: positional.id }, { id: booleanAlgebra.id }],
      },
    },
  });
  await prisma.module.update({
    where: { id: conversion.id },
    data: {
      prerequisites: {
        connect: [{ id: moreGates.id }, { id: truthTables.id }],
      },
    },
  });

  // Questions per module
  const questionsByModule: Array<{ moduleId: string; defs: QuestionDef[] }> = [
    { moduleId: positional.id, defs: positionalQuestions },
    { moduleId: booleanAlgebra.id, defs: booleanQuestions },
    { moduleId: truthTables.id, defs: truthTableQuestions },
    { moduleId: moreGates.id, defs: moreGatesQuestions },
    { moduleId: grayEncoding.id, defs: grayQuestions },
    { moduleId: conversion.id, defs: conversionQuestions },
  ];

  for (const { moduleId, defs } of questionsByModule) {
    for (const q of defs) {
      await prisma.question.create({
        data: {
          name: q.name,
          moduleId,
          type: q.type,
          content: q.content as never,
        },
      });
    }
  }

  console.log("Seeding complete!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
