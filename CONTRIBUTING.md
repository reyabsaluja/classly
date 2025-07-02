# Contributing to Classly

Thank you for your interest in contributing to Classly! This document provides guidelines for contributing to the project.

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/classly.git`
3. Install dependencies: `npm install --legacy-peer-deps`
4. Copy `.env.example` to `.env.local` and add your environment variables
5. Start development server: `npm run dev`

## Environment Variables

You'll need:
- Supabase project URL and anon key
- Google Gemini API key (optional, for AI features)

## Code Style

- Use TypeScript for all new code
- Follow the existing code style (we use ESLint and Prettier)
- Use meaningful variable and function names
- Add comments for complex logic

## Submitting Changes

1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Test your changes: `npm run build`
4. Commit your changes: `git commit -m "Add your feature"`
5. Push to your fork: `git push origin feature/your-feature-name`
6. Create a Pull Request

## Pull Request Guidelines

- Provide a clear description of what your PR does
- Include screenshots for UI changes
- Make sure all tests pass
- Keep PRs focused on a single feature/fix

## Reporting Bugs

Please use the GitHub issue tracker to report bugs. Include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser/OS information

## Feature Requests

Feature requests are welcome! Please use the GitHub issue tracker and include:
- Clear description of the feature
- Use case/motivation
- Possible implementation approach

## Questions?

Feel free to open an issue for any questions about contributing.
