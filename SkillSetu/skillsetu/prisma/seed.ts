import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing old data...');
  // Delete in reverse order of dependencies
  await prisma.taskAttempt.deleteMany();
  await prisma.userSkillState.deleteMany();
  await prisma.task.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.subskillNode.deleteMany();
  await prisma.skillDependency.deleteMany();
  await prisma.jobProfileSkill.deleteMany();
  await (prisma as any).internship.deleteMany();
  await prisma.skillNode.deleteMany();
  await prisma.jobProfile.deleteMany();
  await prisma.user.deleteMany();
  await (prisma as any).proof.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.dailyActivity.deleteMany();

  console.log('Loading JSON data...');
  const dataDir = path.join(process.cwd(), 'src', 'data');
  const careers = JSON.parse(fs.readFileSync(path.join(dataDir, 'careers.json'), 'utf-8'));
  const skills = JSON.parse(fs.readFileSync(path.join(dataDir, 'skills.json'), 'utf-8'));
  const questions = JSON.parse(fs.readFileSync(path.join(dataDir, 'questions.json'), 'utf-8'));

  console.log('Seeding Skills and Subskills...');
  for (const skill of skills) {
    await prisma.skillNode.create({
      data: {
        id: skill.id,
        name: skill.name,
        description: skill.description,
      }
    });

    for (const subskill of skill.subskills) {
      await prisma.subskillNode.create({
        data: {
          id: subskill.id, // e.g. "thermodynamics:first_law" doesn't strictly match length? Subskill ID is short, let's use it as is
          skillId: skill.id,
          name: subskill.name,
        }
      });

      for (const res of subskill.resources) {
        await prisma.resource.create({
          data: {
            subskillId: subskill.id,
            type: res.type,
            title: res.title,
            url: res.url,
            duration: res.duration || null,
          }
        });
      }
    }
  }

  // Handle skill dependencies now that skills exist
  for (const skill of skills) {
    if (skill.dependsOn && skill.dependsOn.length > 0) {
      for (const reqId of skill.dependsOn) {
        await prisma.skillDependency.create({
          data: {
            skillId: skill.id,
            dependsOnId: reqId
          }
        });
      }
    }
  }

  console.log('Seeding Job Profiles (Careers)...');
  for (const career of careers) {
    await prisma.jobProfile.create({
      data: {
        id: career.id,
        name: career.name,
        description: career.description,
        difficulty: career.difficulty,
        avgSalary: career.avgSalary,
        learningTime: career.learningTime,
      }
    });

    for (const skillId of career.skills) {
      // make sure skill exists to avoid foreign key errors from broken references in JSON
      const exists = await prisma.skillNode.findUnique({ where: { id: skillId } });
      if (exists) {
        await prisma.jobProfileSkill.create({
          data: {
            jobProfileId: career.id,
            skillId: skillId
          }
        });
      }
    }
  }

  console.log('Seeding Questions...');
  for (const q of questions) {
    // Make sure subskill exists
    const subskillExists = await prisma.subskillNode.findUnique({ where: { id: q.subskill }});
    if (!subskillExists) {
        console.warn(`Skipping question ${q.id} because subskill ${q.subskill} doesn't exist`);
        continue;
    }
    
    await prisma.task.create({
      data: {
        skillId: q.skill,
        subskillId: q.subskill,
        question: q.question,
        options: JSON.stringify(q.options),
        answer: q.answer,
        explanation: q.explanation,
        difficulty: q.difficulty,
      }
    });
  }

  // Create a default test user
  console.log('Creating default test user...');
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test Student',
      passwordHash: 'dummy', // Not using it securely yet, just placeholder
    }
  });

  console.log('Seeding Internships...');
  const internships = [
    {
      company: "TechFlow Solutions",
      title: "Frontend Engineering Intern",
      description: "Work on cutting-edge React applications and build responsive, accessible UIs for global clients.",
      location: "San Francisco, CA (Remote)",
      stipend: "$3,000/month",
      skills: ["web_development", "programming_fundamentals"]
    },
    {
      company: "DataViz Corp",
      title: "Data Analyst Intern",
      description: "Analyze large datasets to extract meaningful insights and create impactful visualizations for business stakeholders.",
      location: "New York, NY",
      stipend: "$3,500/month",
      skills: ["data_visualization", "sql_mastery", "statistics"]
    },
    {
      company: "ProductMind",
      title: "Associate Product Manager Intern",
      description: "Collaborate with engineering and design teams to prioritize features and define product roadmaps.",
      location: "Austin, TX (Remote)",
      stipend: "$4,000/month",
      skills: ["product_strategy", "agile_methodologies"]
    }
  ];

  for (const intern of internships) {
    await (prisma as any).internship.create({
      data: {
        company: intern.company,
        title: intern.title,
        description: intern.description,
        location: intern.location,
        stipend: intern.stipend,
        requiredSkills: {
          connect: intern.skills.map(id => ({ id }))
        }
      }
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
