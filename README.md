# code-editor-analyzer

# Code Editor & LLM Prompt Generator

A web application to edit code and generate LLM prompts based on code diffs for AI analysis.

---

## Features

- Edit code samples in multiple languages (JavaScript, Python, Java, C#)
- Commit code changes and view commit history
- Generate AI analysis prompts from code diffs
- View AI analysis in a formatted, scrollable panel
- Syntax highlighting with CodeMirror
- Diff view for committed changes

---

## Frontend

- Built with **React**
- Uses **CodeMirror** for the code editor
- Supports language snippets and autocompletion
- Scrollable commit history and AI analysis panel

---

## Backend

- Built with **ASP.NET Core**
- Provides `/report` endpoint
- Uses **Google Gemini LLM API**
- Generates formatted prompts from code diffs

---

## Setup & Run

### Backend

1. Add your secrets using **dotnet user-secrets** 

```bash
dotnet user-secrets set "GEMINI_API_KEY" "<your-api-key>"
dotnet user-secrets set "GOOGLE_COMPATIBILITY_ENDPOINT" "<endpoint-url>"
