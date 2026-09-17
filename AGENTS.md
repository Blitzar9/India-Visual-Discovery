# AI Development Rules

## Expo
- This project uses Expo SDK 57.
- Read the exact versioned Expo documentation at https://docs.expo.dev/versions/v57.0.0/ before writing or changing Expo-related code.
- Prefer official Expo documentation and APIs over blog posts or undocumented approaches.

## General
- Inspect existing code before modifying it.
- Make the smallest change that correctly solves the task.
- Do not rewrite working code without a clear reason.
- Keep the architecture simple and appropriate for an MVP.
- Do not introduce new dependencies unless they are necessary.
- Prefer stable, well-supported packages.
- Do not make architectural decisions silently. If a requirement is ambiguous, ask first.
- Do not introduce a media-storage or video-processing architecture without an explicit project decision.

## Security
- Never expose, print, hard-code, or commit secrets, API keys, tokens, passwords, or private credentials.
- Never commit `.env` or other local secret files.
- Never disable authentication, authorization, Row Level Security (RLS), validation, or other security controls to make something work.
- Never use production credentials during local development.
- Never perform destructive production actions.
- Treat user-generated content and external input as untrusted.

## Database
- Database schema changes must use version-controlled migrations.
- Do not make manual production database changes.
- Keep Row Level Security enabled where applicable.
- Do not use service-role credentials in client-side code.

## Git
- Work from the current branch and inspect `git status` before committing.
- Never force-push unless explicitly approved.
- Never rewrite shared history without explicit approval.
- Keep commits focused and descriptive.
- Do not commit generated secrets or local machine configuration.

## Dependencies
- Do not run `npm audit fix --force`.
- Before adding or upgrading a dependency, explain why it is needed and check compatibility with Expo SDK 57.
- Prefer the package manager and versions already defined by the project.

## Testing
- After meaningful code changes, run the relevant type checks, tests, or Expo validation available for the project.
- Do not claim something works unless it has been verified.
- Report what was changed and what validation was run.

## Scope
- This is an India-focused visual discovery social app.
- The initial goal is a focused MVP, not a full-featured social network.
- Do not add recommendation AI, payments, advertising systems, live streaming, chat, or other major infrastructure unless explicitly requested.

## Agent Safety
- Do not modify files outside the project unless explicitly requested.
- Do not install system-wide software without explicit approval.
- Do not change operating-system security settings.
- Do not delete files or data unless explicitly requested.
- Do not make external service changes without explicit approval.
