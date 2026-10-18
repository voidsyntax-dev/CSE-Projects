<div align="center">
  <h1>SkillSetu</h1>
  <p><b>Master Skills That Actually Get You Hired</b></p>
  <p><i>A premium, AI-powered career mastery platform mapping careers → skills → subskills → resources → tasks.</i></p>
</div>

<hr />

## 🎯 Vision
At **SkillSetu**, we provide engineering students with a professional, structured path from learning to employability. By integrating cognitive science (spaced repetition) and AI mentorship, we ensure that mastery isn't just achieved—it's maintained.

<hr />

## 📊 Feature Implementation Status
SkillSetu is currently in a highly advanced state with all core PRD requirements fully implemented.

<table width="100%">
  <thead>
    <tr style="background-color: #1a1a1a;">
      <th align="left">PRD Feature</th>
      <th align="center">Status</th>
      <th align="left">Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Career-First Learning</strong></td>
      <td align="center">✅ Done</td>
      <td>Dynamic roadmaps for specialized engineering roles</td>
    </tr>
    <tr>
      <td><strong>Skill Graph (D3)</strong></td>
      <td align="center">✅ Done</td>
      <td>Interactive, dependency-aware directed graphs</td>
    </tr>
    <tr>
      <td><strong>Subskill Layer</strong></td>
      <td align="center">✅ Done</td>
      <td>Atomic units of learning with curated resources</td>
    </tr>
    <tr>
      <td><strong>Resource Layer</strong></td>
      <td align="center">✅ Done</td>
      <td>Hand-picked deep-dive resources with difficulty metadata</td>
    </tr>
    <tr>
      <td><strong>Task / Question System</strong></td>
      <td align="center">✅ Done</td>
      <td>Scenario-based MCQ practice with adaptive engines</td>
    </tr>
    <tr>
      <td><strong>Task Attempt Tracking</strong></td>
      <td align="center">✅ Done</td>
      <td>Persistent logging via Prisma; tracks time and accuracy</td>
    </tr>
    <tr>
      <td><strong>Mastery Score System</strong></td>
      <td align="center">✅ Done</td>
      <td>Weighted algorithm (Difficulty × Consistency × Accuracy)</td>
    </tr>
    <tr>
      <td><strong>Skill Decay Engine</strong></td>
      <td align="center">✅ Done</td>
      <td>Scientific forgetting curve: <code>mastery = m × e^(−λt)</code></td>
    </tr>
    <tr>
      <td><strong>Daily Task Recommendation</strong></td>
      <td align="center">✅ Done</td>
      <td>Priority-driven practice based on decay risk</td>
    </tr>
    <tr>
      <td><strong>Resource Recommendation</strong></td>
      <td align="center">✅ Done</td>
      <td>Personalized suggestions triggered on performance gaps</td>
    </tr>
    <tr>
      <td><strong>Proof Vault</strong></td>
      <td align="center">✅ Done</td>
      <td>Verifiable skill portfolio of mastery achievements</td>
    </tr>
    <tr>
      <td><strong>Career Fit Score</strong></td>
      <td align="center">✅ Done</td>
      <td>Real-time readiness calculation for target job roles</td>
    </tr>
    <tr>
      <td><strong>Dashboard - Visuals</strong></td>
      <td align="center">✅ Done</td>
      <td>Heatmaps, Mastery Radar, and Weekly Progress charts</td>
    </tr>
    <tr>
      <td><strong>Gamification</strong></td>
      <td align="center">✅ Done</td>
      <td>Daily streaks, milestone badges, and celebration UI</td>
    </tr>
    <tr>
      <td><strong>Authentication</strong></td>
      <td align="center">✅ Done</td>
      <td>Secure session management via NextAuth.js</td>
    </tr>
    <tr>
      <td><strong>Database</strong></td>
      <td align="center">✅ Done</td>
      <td>Prisma ORM with PostgreSQL/SQLite persistence</td>
    </tr>
    <tr>
      <td><strong>AI Layer</strong></td>
      <td align="center">✅ Done</td>
      <td>Gemini 1.5 Flash integrated (Mentors, Tutors, Recruiter)</td>
    </tr>
    <tr>
      <td><strong>Internship Mapping</strong></td>
      <td align="center">✅ Done</td>
      <td>Real-time eligibility tracking based on mastery levels</td>
    </tr>
  </tbody>
</table>

<hr />

## 🛠️ Tech Stack
Modern, high-performance tools powering the platform:

- **Framework**: [Next.js](https://nextjs.org/) (React 19)
- **AI**: [Google Gemini 1.5 Flash](https://deepmind.google/technologies/gemini/)
- **Visuals**: [D3.js](https://d3js.org/) & [Recharts](https://recharts.org/)
- **Database**: [Prisma](https://www.prisma.io/) & [PostgreSQL](https://www.postgresql.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)

<hr />

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/your-repo/skillsetu.git

# Navigate to the project directory
cd skillsetu/skillsetu

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

