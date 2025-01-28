# Contributing to SONETRA

First off, thank you for considering contributing to SONETRA! It's people like you that make SONETRA such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:
- Be respectful and inclusive
- Focus on collaboration
- Constructive feedback is welcome
- No harassment or discrimination

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- A clear and descriptive title
- Exact steps to reproduce the problem
- What you expected would happen
- What actually happens
- Code samples if relevant
- Audio samples if relevant (without copyright issues)

### 💡 Suggesting Enhancements

If you have an idea for a new feature or improvement:

1. Check if it's already been suggested
2. Create a new issue with the "enhancement" label
3. Describe your idea in detail
4. Explain why this enhancement would be useful

### 🔧 Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes
4. Make sure your code lints
5. Issue that pull request!

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sonetra.git
```

2. Install dependencies:
```bash
# Frontend
cd src/frontend
npm install

# Backend
cd src/backend
pip install -r requirements.txt
```

3. Run the development servers:
```bash
# Frontend
npm start

# Backend
uvicorn main:app --reload
```

## Project Structure

```
sonetra/
├── src/
│   ├── frontend/        # React/TypeScript frontend
│   ├── backend/         # FastAPI backend
│   ├── models/          # AI/ML models
│   └── data/           # Data processing
├── tests/              # Test suites
└── docs/              # Documentation
```

## Coding Guidelines

- Follow PEP 8 for Python code
- Use TypeScript for frontend development
- Write meaningful commit messages
- Document your code
- Add tests for new features

## First Time Contributors

Looking for something to work on? Look for issues tagged with:
- `good first issue`
- `help wanted`
- `beginner friendly`

## Getting Help

- 📧 Email: cryonicx@protonmail.com
- 💬 Telegram: [@cryonicx](https://t.me/cryonicx)

## Recognition

Contributors will be added to our README.md and will receive credit for their work.

Thank you for contributing! 🎉 