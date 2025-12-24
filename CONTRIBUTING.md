# Contributing to ReactGauge

Thanks for your interest in contributing! We welcome fixes, new questions, and
small improvements that keep the app clean and reliable.

## Ways to contribute
- Report bugs or request features via GitHub Issues.
- Submit new quiz questions in `data/questions.json`.
- Improve UI/UX, accessibility, or performance.

## Development setup
1. Fork the repo and create a feature branch.
2. Install dependencies: `npm install`
3. Run the app:
   - iOS: `npx react-native run-ios`
   - Android: `npx react-native run-android`

## Adding or updating questions
- Edit `data/questions.json`.
- Keep `id` values unique and stable.
- Provide `prompt`, `options`, and `answerIndex` for MCQ items.
- Include `explanation` whenever possible.

## Pull requests
- Keep PRs focused and small.
- Use clear commit messages.
- Describe what changed and why.
- Include screenshots for UI changes when possible.

## Code style
- Prefer existing patterns and components.
- Avoid large refactors without discussion.
- Keep new text in `localization/resources.ts` with translations.

## License
By contributing, you agree that your contributions will be licensed under the
project's license.
