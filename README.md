# CSE Projects

A collection of computer science projects spanning reinforcement learning and full-stack web development. Each folder is self-contained, with its own README, code, and setup instructions.

## Projects

### SkillSetu

SkillSetu is an AI-powered learning platform that gives engineering students a structured path from learning to employability. It maps each target career to the skills it needs, breaks those skills into subskills, and attaches curated resources and practice tasks to each one.

The platform is built in layers:

1. **Career roadmaps:** Each engineering role has a roadmap of required skills, shown as an interactive dependency graph built with D3.
2. **Subskills and resources:** Skills break down into subskills, each with hand-picked resources tagged by difficulty.
3. **Practice:** Scenario-based multiple-choice tasks test each subskill. Every attempt is logged with its time and accuracy.
4. **Mastery tracking:** A mastery score combines difficulty, consistency, and accuracy. A decay engine lowers mastery over time following a forgetting curve, mastery = m × e^(−λt).
5. **Recommendations:** Daily practice is prioritised by decay risk, and extra resources are suggested when performance drops.
6. **Career readiness:** A career fit score estimates readiness for target roles, and internship eligibility updates as mastery grows. A proof vault collects achievements into a skill portfolio.

An AI layer built on Gemini provides mentor, tutor, and recruiter assistants. A dashboard shows activity heatmaps, a mastery radar, and weekly progress, with streaks and badges to keep students practising.

**Stack:** Next.js (React 19), Prisma with PostgreSQL, NextAuth.js, D3.js and Recharts, Tailwind CSS and Framer Motion, Gemini API.

---

### Lunar Lander: Centred Landings with PPO

This project trains a reinforcement learning agent to land a rocket in Gymnasium's continuous Lunar Lander environment. The goal is to touch down at the exact centre of the landing pad, not just anywhere between the flags. A reward-shaping wrapper guides the agent toward the centre during training, while all reported scores come from the unmodified environment, so they are comparable with standard benchmarks.

The workflow runs in stages:

1. **Environment:** Gymnasium's `LunarLander-v3` with continuous controls. The agent observes position, velocity, angle, and leg contact, and controls the main engine and side boosters.
2. **Reward shaping:** A training-only wrapper adds a per-step penalty for horizontal distance from the pad centre, refunds 80% of the fuel cost, and pays a touchdown bonus of up to 150 that is largest at the exact centre.
3. **Training:** PPO from Stable-Baselines3 with default hyperparameters, trained for 1M timesteps.
4. **Checkpoint selection:** Every 50k steps, the agent is evaluated on 20 episodes of the plain environment and the best checkpoint is saved. Early stopping was configured but did not trigger.
5. **Evaluation:** The best checkpoint and the final model are each tested on 200 fixed seeds, measuring reward, solve rate, pad and centre landings, and control effort.
6. **Robustness test:** The evaluation is repeated with wind at three strengths, none of which the agent saw during training.

#### Results (200 seeds, plain environment, no wind)

| Model | Mean reward | Solved (≥ 200) | On pad | On centre |
|---|---|---|---|---|
| Best checkpoint (750k steps) | 217.5 ± 75.7 | 84% | 99/200 | 18/200 |
| Final model (~1M steps) | 222.0 ± 69.5 | 85% | 88/200 | 20/200 |

"On pad" means the lander came to rest within the flags, and "on centre" within a quarter of that width. In strong wind (power 15), the best checkpoint still solves 65% of episodes and lands on the pad in 82 of 200. The final model manages 61% and 62 of 200.

## Repository Structure
```
CSE-Projects/
├── Lunar Lander/    # Notebook, trained PPO models, landing video
├── SkillSetu/       # Next.js web application
├── LICENSE
└── README.md
```

## Requirements

- **Lunar Lander:** Python 3 and SWIG. The Python packages (`gymnasium[box2d]`, `stable-baselines3`, `imageio`, `imageio-ffmpeg`) are installed in the notebook's first cell.
- **SkillSetu:** Node.js and npm, a PostgreSQL or SQLite database, and a Gemini API key in the environment file (`npm install`, then `npm run dev`).
