import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import supabase from './config/supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// Mongoose Models
import About from './models/About.js';
import Highlight from './models/Highlight.js';
import Skill from './models/Skill.js';
import Project from './models/Project.js';
import Education from './models/Education.js';
import Certification from './models/Certification.js';
import Platform from './models/Platform.js';
import Experience from './models/Experience.js';
import Blog from './models/Blog.js';
import Resume from './models/Resume.js';

export const migrateData = async () => {
  console.log('🚀 Starting Data Migration: MongoDB Atlas -> Supabase...\n');

  try {
    // 1. Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to live MongoDB Atlas database.\n');

    // 2. Fetch all live documents from MongoDB
    const [
      aboutDocs,
      highlightDocs,
      skillDocs,
      projectDocs,
      educationDocs,
      certDocs,
      platformDocs,
      experienceDocs,
      blogDocs,
      resumeDocs
    ] = await Promise.all([
      About.find().lean(),
      Highlight.find().lean(),
      Skill.find().lean(),
      Project.find().lean(),
      Education.find().lean(),
      Certification.find().lean(),
      Platform.find().lean(),
      Experience.find().lean(),
      Blog.find().lean(),
      Resume.find().lean()
    ]);

    console.log('📊 Records retrieved from MongoDB:');
    console.log(` - About: ${aboutDocs.length}`);
    console.log(` - Highlights: ${highlightDocs.length}`);
    console.log(` - Skills: ${skillDocs.length}`);
    console.log(` - Projects: ${projectDocs.length}`);
    console.log(` - Education: ${educationDocs.length}`);
    console.log(` - Experience: ${experienceDocs.length}`);
    console.log(` - Certifications: ${certDocs.length}`);
    console.log(` - Platforms: ${platformDocs.length}`);
    console.log(` - Blogs: ${blogDocs.length}`);
    console.log(` - Resumes: ${resumeDocs.length}\n`);

    // 3. Migrate About
    if (aboutDocs.length > 0) {
      const formattedAbout = aboutDocs.map(doc => ({
        name: doc.name || 'Balaganesh',
        highlightedname: doc.highlightedName || 'P',
        title: doc.title || '',
        summary: doc.summary || '',
        resumeurl: doc.resumeUrl || '',
        email: doc.email || '',
        phone: doc.phone || '',
        location: doc.location || '',
        abouttextdesktop: doc.aboutTextDesktop || [],
        abouttextmobile: doc.aboutTextMobile || [],
        quickinfo: doc.quickInfo || [],
        declarationtext: doc.declarationText || '',
        signaturename: doc.signatureName || '',
        signaturelocation: doc.signatureLocation || '',
        signatureavatar: doc.signatureAvatar || '',
        logourl: doc.logoUrl || null,
        profileimage: doc.profileImage || null
      }));
      await supabase.from('about').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      const { error } = await supabase.from('about').insert(formattedAbout);
      if (error) console.error('Error inserting about:', error);
      else console.log('✅ About migrated.');
    }

    // 4. Migrate Highlights
    if (highlightDocs.length > 0) {
      const formattedHighlights = highlightDocs.map((doc, idx) => ({
        value: doc.value || '',
        label: doc.label || '',
        iconname: doc.iconName || 'award',
        display_order: idx
      }));
      await supabase.from('highlights').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      const { error } = await supabase.from('highlights').insert(formattedHighlights);
      if (error) console.error('Error inserting highlights:', error);
      else console.log('✅ Highlights migrated.');
    }

    // 5. Migrate Skills
    if (skillDocs.length > 0) {
      const formattedSkills = skillDocs.map((doc, idx) => ({
        category: doc.category || '',
        tags: doc.tags || [],
        display_order: idx
      }));
      await supabase.from('skills').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      const { error } = await supabase.from('skills').insert(formattedSkills);
      if (error) console.error('Error inserting skills:', error);
      else console.log('✅ Skills migrated.');
    }

    // 6. Migrate Projects
    if (projectDocs.length > 0) {
      const formattedProjects = projectDocs.map((doc, idx) => ({
        title: doc.title || '',
        number: doc.number || `0${idx + 1}`,
        description: doc.description || '',
        githublink: doc.githubLink || '',
        livelink: doc.liveLink || '',
        tags: doc.tags || [],
        image: doc.image || null,
        featured: Boolean(doc.featured),
        display_order: idx
      }));
      await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      const { error } = await supabase.from('projects').insert(formattedProjects);
      if (error) console.error('Error inserting projects:', error);
      else console.log('✅ Projects migrated.');
    }

    // 7. Migrate Education
    if (educationDocs.length > 0) {
      const formattedEducation = educationDocs.map((doc, idx) => ({
        date: doc.date || '',
        degree: doc.degree || '',
        school: doc.institution || doc.school || '',
        location: doc.location || '',
        grade: doc.grade || '',
        description: doc.details || doc.description || '',
        display_order: idx
      }));
      await supabase.from('education').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      const { error } = await supabase.from('education').insert(formattedEducation);
      if (error) console.error('Error inserting education:', error);
      else console.log('✅ Education migrated.');
    }

    // 8. Migrate Experience
    if (experienceDocs.length > 0) {
      const formattedExperience = experienceDocs.map((doc, idx) => ({
        title: doc.role || doc.title || '',
        company: doc.company || '',
        period: doc.date || doc.period || '',
        description: doc.description || '',
        technologies: {
          role: doc.role || doc.title || '',
          startDate: doc.startDate || null,
          endDate: doc.endDate || null,
          certificateName: doc.certificateName || '',
          certificatePath: doc.certificatePath || ''
        },
        display_order: idx
      }));
      await supabase.from('experience').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      const { error } = await supabase.from('experience').insert(formattedExperience);
      if (error) console.error('Error inserting experience:', error);
      else console.log('✅ Experience migrated.');
    }

    // 9. Migrate Certifications
    if (certDocs.length > 0) {
      const formattedCerts = certDocs.map((doc, idx) => ({
        title: doc.title || '',
        provider: doc.provider || '',
        issuedate: doc.issueDate || '',
        credentialurl: doc.credentialUrl || '',
        image: doc.image || null,
        display_order: idx
      }));
      await supabase.from('certifications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      const { error } = await supabase.from('certifications').insert(formattedCerts);
      if (error) console.error('Error inserting certifications:', error);
      else console.log('✅ Certifications migrated.');
    }

    // 10. Migrate Platforms
    if (platformDocs.length > 0) {
      const formattedPlatforms = platformDocs.map((doc, idx) => ({
        name: doc.name || '',
        url: doc.url || '',
        username: doc.handle || doc.username || '',
        icon: doc.iconName || doc.icon || '',
        display_order: idx
      }));
      await supabase.from('platforms').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      const { error } = await supabase.from('platforms').insert(formattedPlatforms);
      if (error) console.error('Error inserting platforms:', error);
      else console.log('✅ Platforms migrated.');
    }

    // 11. Migrate Blogs
    if (blogDocs.length > 0) {
      const formattedBlogs = blogDocs.map(doc => ({
        title: doc.title || '',
        slug: doc.slug || doc.title.toLowerCase().replace(/\s+/g, '-'),
        excerpt: doc.excerpt || '',
        content: doc.content || '',
        coverimage: doc.coverImage || null,
        tags: doc.tags || [],
        published: Boolean(doc.published),
        views: doc.views || 0
      }));
      await supabase.from('blogs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      const { error } = await supabase.from('blogs').insert(formattedBlogs);
      if (error) console.error('Error inserting blogs:', error);
      else console.log('✅ Blogs migrated.');
    }

    // 12. Migrate Resumes
    if (resumeDocs.length > 0) {
      const formattedResumes = resumeDocs.map(doc => ({
        fileurl: doc.fileUrl || '',
        originalname: doc.originalName || 'resume.pdf',
        filesize: doc.fileSize || 0
      }));
      await supabase.from('resumes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      const { error } = await supabase.from('resumes').insert(formattedResumes);
      if (error) console.error('Error inserting resumes:', error);
      else console.log('✅ Resumes migrated.');
    }

    console.log('\n🎉 ALL DATA SUCCESSFULLY MIGRATED TO SUPABASE WITHOUT ANY LOSS!');
    process.exit(0);
  } catch (err) {
    console.error('Fatal Migration Error:', err);
    process.exit(1);
  }
};

migrateData();
