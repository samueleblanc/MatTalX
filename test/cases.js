/*
    Conversion cases used by parser.test.js

    Each case is {in, out} and optionally {settings}, which is merged into the
    defaults of core.js. Every case runs with math mode off, so \$...\$ delimits math.
    These are meant to stay readable: the exhaustive coverage is in snapshot.json
*/

export const cases = [
    // --- sentences ---
    { in: "Let $A \\in M_{mxn}(K)$ be a matrix",
      out: "Let 𝐴 ∈ 𝑀ₘₓₙ(𝐾) be a matrix " },
    { in: "$f:\\mathbb{R} \\rightarrow \\mathbb{R} ; x \\mapsto f(x) \\coloneqq x^{2}$",
      out: "𝑓∶ℝ → ℝ;𝑥 ⟼ 𝑓(𝑥) ≔ 𝑥² " },
    { in: "Let $f$ be a function such that $f(x) \\geq 0 \\forall x \\in \\mathbb{Z}$",
      out: "Let 𝑓 be a function such that 𝑓(𝑥) ≥ 0∀𝑥 ∈ ℤ " },
    { in: "$\\mathbf{\\mathfrak{abc}}$",
      out: "𝖆𝖇𝖈 " },
    { in: "curl written as $\\nabla \\times \\mathbf{F}$",
      out: "curl written as ∇ × 𝑭 " },
    { in: "$\\sqrt{\\sqrt[3]{\\sqrt[4]{\\cdots\\sqrt[n]{n}}}}$",
      out: "√∛∜(⋯ⁿ√𝑛) " },
    { in: "Bien s\\^{u}r, $\\frac{1}{2}$ est rationnelle. De plus, $\\frac{\\frac{\\frac{1}{2}}{2}}{2}$ l'est aussi.",
      out: "Bien sûr, ¹∕₂ est rationnelle. De plus, ((¹∕₂/2)/2) l'est aussi. " },
    { in: "$n!$ grows fast, but less so than $n \\uparrow\\uparrow\\uparrow n$",
      out: "𝑛! grows fast, but less so than 𝑛↑↑↑𝑛 " },
    { in: "\\textbf{Proposition}: Let $a \\in \\mathbb{R}$, then $a \\leq x  \\forall x \\in \\emptyset$",
      out: "𝗣𝗿𝗼𝗽𝗼𝘀𝗶𝘁𝗶𝗼𝗻: Let 𝑎 ∈ ℝ, then 𝑎 ≤ 𝑥∀𝑥 ∈ ∅ " },
    { in: "$\\mathbb{P}(X \\geq \\alpha) \\leq \\frac{\\mathbb{E}[X]}{\\alpha}$",
      out: "ℙ(𝑋 ≥ 𝛼) ≤ (𝔼[𝑋]/𝛼) " },
    { in: "$\\mathrm{CO}_{2} \\rightarrow \\overset{:}{\\underset{:}{\\mathrm{O}}}{=}\\mathrm{C}{=}\\overset{:}{\\underset{:}{\\mathrm{O}}}$",
      out: "CO₂ → Ö̤=C=Ö̤ " },
    // --- braceless superscript and subscript ---
    { in: "$x^2 + y_1$ is shorter than $x^{2} + y_{1}$",
      out: "𝑥² + 𝑦₁ is shorter than 𝑥² + 𝑦₁ " },
    { in: "$\\sum_i a_i \\leq \\int_0^1 f$",
      out: "∑ᵢ𝑎ᵢ ≤ ∫₀¹𝑓 " },
    { in: "$e^x$ and $a_i$",
      out: "𝑒ˣ and 𝑎ᵢ " },
    { in: "$x^2n$",
      out: "𝑥²𝑛 " },
    { in: "$x^-1$",
      out: "𝑥⁻1 " },
    { in: "$x^(a)$",
      out: "𝑥⁽𝑎) " },
    { in: "x^2 outside math mode",
      out: "x^2 outside math mode " },
    // --- curly brackets when the symbol does not exist in unicode ---
    { in: "$x^{Y}$ and $x_{ab}$",
      out: "𝑥^{𝑌} and 𝑥_{𝑎𝑏} " },
    { in: "$x^{x^x}$",
      out: "𝑥^{𝑥ˣ} " },
    { in: "$x^{x^{x^x}}$",
      out: "𝑥^{𝑥^{𝑥ˣ}} " },
    { in: "$x^{\\alpha}$",
      out: "𝑥^{𝛼} " },
    // --- math mode delimiters ---
    { in: "Let \\(f(x) = x^2\\) be a function",
      out: "Let 𝑓(𝑥) = 𝑥² be a function " },
    { in: "a \\(x\\) b and $y$",
      out: "a 𝑥 b and 𝑦 " },
    { in: "\\(\\sum_i a_i \\leq \\int_0^1 f\\)",
      out: "∑ᵢ𝑎ᵢ ≤ ∫₀¹𝑓 " },
    { in: "x\\)",
      out: "x\\) " },                             // A ')' that closes nothing is left alone
    { in: "I want to write an integral $\\int f(x)dx for fun",
      out: "I want to write an integral ∫𝑓(𝑥)𝑑𝑥𝑓𝑜𝑟𝑓𝑢𝑛" },   // Math mode left open is closed at the end
    { in: "\\(x^2",
      out: "𝑥²" },
    { in: "\\[x^2\\]",
      out: "\u000A𝑥²\u000A " },                  // '\\[' still skips a line, '\\(' doesn't

    // --- text that can't be converted is shown as it was written ---
    { in: "Here is a command: $\\oingt$",
      out: "Here is a command: \\oingt " },
    { in: "$\\mathbf{\\oingt}$",
      out: "\\mathbf{\\oingt} " },                 // The command is kept whole, not just what failed
    { in: "$\\oingt{\\alpha}$",
      out: "\\oingt{𝛼} " },                     // An unknown command keeps its converted argument
    { in: "$\\mathbf{\\oingt{\\alpha}}$",
      out: "\\mathbf{\\oingt{𝛼}} " },
    { in: "$a \\oingt b$",
      out: "𝑎\\oingt𝑏 " },
    { in: "café — 90%",
      out: "café — 90% " },                     // Characters MatTalX doesn't know are left alone
    { in: "$\\hspace{a}$",
      out: "\\hspace{𝑎} " },

    // --- settings ---
    { in: "$\\alpha x$",
      out: "αx ",
      settings: {"mathFont":false} },
    { in: "$a ; b$",
      out: "𝑎 ; 𝑏 ",
      settings: {"adjustSpaces":false} },
    { in: "x^2",
      out: "𝑥²",
      settings: {"mathMode":true} },
    // --- commands built by the user ---
    { in: "$x \\in \\RR$",
      out: "𝑥 ∈ ℝ ",
      settings: {"customCommands":[{"type":"\\newcommand","newInput":"\\RR","output":"\\mathbb{R}"}]} },
    { in: "$\\alpha$",
      out: "𝛽 ",
      settings: {"customCommands":[{"type":"\\renewcommand","newInput":"\\alpha","output":"\\beta"}]} },
    { in: "$\\Aut{G}$",
      out: "𝐴𝑢𝑡[𝐺] ",
      settings: {"customCommands":[{"type":"\\DeclareMathOperator","newInput":"\\Aut","output":"Aut"}]} },
];
