# ATLAS Frontend

> A fully functional frontend mockup with mock data, built for demonstration and stakeholder presentation purposes.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)](https://tailwindcss.com/)

## Project Status

**Current Phase**: Initial Development / Mockup Phase  
**Goal**: Functional frontend demo for General Assembly presentation  
**Deadline**: March 11, 2026  
**Backend**: Not integrated yet (using mock data)

## Overview

This frontend implementation provides:
## Features

### Admin (`/admin`)

- **Student Management** - Approve/reject membership registrations, view member directory
- **Event Management** - Create events, track attendance 
- **Fines Management** - Issue and track fines (with auto-generation from attendance)
- **Membership Fees** - Monitor fee collection and payment status
- **Payment Review** - Approve/decline student payment submissions with receipt verification
- **Clearance Management** - Generate and manage student clearances
- **Financial Analytics** - Visual analytics and financial summaries // do not prioritize

### Student Portal (`/portal`)

- **Dashboard** - Personal overview with quick stats
- **Events** - View upcoming events and personal attendance history
- **Fines** - View fines and submit GCash payments
- **Membership Fees** - View fees and submit GCash payments
- **Clearance** - Check clearance status and requirements

#  Submitting Feedbacks 

This section will help you understand how to effectively communicate with the front-end team.

 Since this is the starting phase:
- Questions are encouraged
- Suggestions are valued
- Constructive criticism helps us improve
---


### Option 1: Open a Discussion (Recommended for ideas/questions)

1. Go to **GitHub Discussions** tab
2. Click **New Discussion**
3. Choose category:
   - **Ideas** - Component suggestions, UX improvements
   - **Q&A** - Questions about code or implementation
   - **Show and Tell** - Share your improvements
   - **General** - Anything else

**When to use:** General feedback, brainstorming, asking questions

### Option 2: Create an Issue (For specific actionable items)

1. Go to **Issues** tab
2. Click **New Issue**
3. Submit Observations/suggestions. Make sure to make it comprehensive.

**When to use:** Concrete feature requests, issues for the UI/UX logic and flow 

### Option 3 (during PRs): Quick Feedback in Code Review

If you're reviewing a PR and have broader feedback beyond that specific change, leave a comment and optionally create an issue for tracking.

---

## Pull Request Process

### Before You Start

1. **Check existing issues/PRs** - Don't duplicate work
2. **Discuss major changes** - Create an issue first for big suggestions
3. **Pull latest changes** - Always start from up-to-date `dev`

### Creating a Pull Request

1. **Create a feature branch from `dev` branch** 
   ```bash
   git checkout -b feature/your-feature-name