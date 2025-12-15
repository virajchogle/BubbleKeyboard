# Bubble Wheel Keyboard - Academic Paper

This directory contains the LaTeX source for the academic paper describing the Bubble Wheel Keyboard project, formatted using the **ACM Journals Primary Article Template**.

## Paper Information

**Title:** Bubble Wheel Keyboard: A Radial Predictive Text Entry System for Smartwatches with AI-Powered Character Prediction

**Author:** Viraj Chogle

**Template:** ACM Journals Primary Article Template (`acmart` document class)

## Files

| File | Description |
|------|-------------|
| `main.tex` | Main LaTeX source file |
| `references.bib` | BibTeX bibliography file |
| `README.md` | This file |

## Compilation

### Using Overleaf (Recommended)

1. Go to [Overleaf](https://www.overleaf.com)
2. Create a new project → Upload Project
3. Upload `main.tex` and `references.bib`
4. Set the main document to `main.tex`
5. The document will compile automatically

**Your Overleaf Project:** https://www.overleaf.com/project/693f81e285a9db2c2cd508d4

### Using Local LaTeX Installation

```bash
# Using pdflatex + bibtex (run multiple times for references)
pdflatex main.tex
bibtex main
pdflatex main.tex
pdflatex main.tex

# Or using latexmk (handles all passes automatically)
latexmk -pdf main.tex

# Clean auxiliary files
latexmk -c
```

## Template Configuration

The paper uses the ACM manuscript format for review:

```latex
\documentclass[manuscript,screen,review]{acmart}
```

### Document Class Options

| Option | Description |
|--------|-------------|
| `manuscript` | Full article format |
| `screen` | Colored hyperlinks for screen viewing |
| `review` | Line numbers for review process |

### For Final Submission

Change to the appropriate format:
```latex
% For ACM journal submission
\documentclass[acmsmall]{acmart}

% For conference proceedings
\documentclass[sigconf]{acmart}
```

## Paper Structure (~15-18 pages)

| Section | Content |
|---------|---------|
| **Abstract** | System overview, 90% prediction accuracy, 19× touch target increase |
| **1. Introduction** | Problem statement, 5 key innovations, contributions |
| **2. Related Work** | Text entry, predictive systems, radial menus, LLMs (5 subsections) |
| **3. System Design** | Architecture, wheel interface, bubble keyboard, touch target analysis |
| **4. Prediction Algorithms** | Gemini API, trigram fallback, accuracy comparison |
| **5. User Study Methodology** | Between-subjects design, metrics, questionnaire |
| **6. Implementation** | React/TypeScript stack, component architecture, optimizations |
| **7. Results & Discussion** | Latency, Fitts's Law analysis (43-50% time reduction) |
| **8. Limitations & Future Work** | Current constraints, future directions |
| **9. Conclusion** | Summary of contributions |
| **Appendices** | Study sentences, questionnaire, API format, data schemas |

## Key Figures and Tables

- **Figure 1:** System architecture diagram
- **Table 1:** Key scaling factors by prediction rank
- **Table 2:** Sample trigram probability distributions
- **Table 3:** Default predictions (English letter frequency)
- **Table 4:** Prediction accuracy comparison
- **Table 5:** Prediction latency measurements
- **Table 6:** Responsive breakpoints
- **Table 7:** Comparison with existing smartwatch text entry systems

## CCS Concepts

The paper uses the following ACM Computing Classification System concepts:

- Human-centered computing → Text input (500)
- Human-centered computing → Touch screens (500)
- Human-centered computing → Haptic devices (300)
- Computing methodologies → Natural language processing (300)

## Keywords

text entry, predictive keyboard, smartwatch interface, radial menu, AI prediction, human-computer interaction, wearable computing, Fitts's Law, large language models

## References

The paper includes 21 academic references covering:
- Text entry on small screens (MacKenzie, Dunlop, etc.)
- Fitts's Law and Hick's Law (foundational HCI)
- Predictive text systems (Kristensson & Zhai, etc.)
- Radial/pie menus (Callahan et al.)
- Large language models (Brown et al., Google DeepMind)

## Citation

If you use this work, please cite:

```bibtex
@article{chogle2024bubblewheelkeyboard,
  author = {Chogle, Viraj},
  title = {Bubble Wheel Keyboard: A Radial Predictive Text Entry System for Smartwatches with AI-Powered Character Prediction},
  journal = {Proceedings of the ACM on Interactive, Mobile, Wearable and Ubiquitous Technologies},
  year = {2024},
  volume = {1},
  number = {1},
  articleno = {1},
  doi = {10.1145/XXXXXXX.XXXXXXX}
}
```

## License

This paper and its source code are provided for academic and educational purposes.

