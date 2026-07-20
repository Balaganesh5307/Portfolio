import mongoose from 'mongoose';
import dotenv from 'dotenv';
import About from './models/About.js';
import Highlight from './models/Highlight.js';
import Skill from './models/Skill.js';
import Project from './models/Project.js';
import Education from './models/Education.js';
import Certification from './models/Certification.js';
import Platform from './models/Platform.js';
import Experience from './models/Experience.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio');
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await About.deleteMany();
    await Highlight.deleteMany();
    await Skill.deleteMany();
    await Project.deleteMany();
    await Education.deleteMany();
    await Certification.deleteMany();
    await Platform.deleteMany();
    await Experience.deleteMany();

    console.log('Existing data cleared.');

    // 1. Seed About
    const about = new About({
      name: 'Balaganesh',
      highlightedName: 'P',
      title: 'AI & Data Science Student',
      summary: 'Analytical B.Tech student in AI and Data Science with strong proficiency in data structures, C, C++, and Python. Skilled in web development, scripting, and competitive programming. Combining technical accuracy with creative problem-solving to build innovative solutions.',
      resumeUrl: 'https://drive.google.com/file/d/1gmEURISXkmvCWvJt0wTvrhdhffRY8hij/view?usp=sharing',
      email: 'bg6951872@gmail.com',
      phone: '+91 9095028208',
      location: 'Tirupur, Tamil Nadu, India',
      aboutTextDesktop: [
        'B.Tech student pursuing Artificial Intelligence and Data Science at Kalaignar Karunanidhi Institute of Technology, Coimbatore. Proficient in data structures, C, C++, Python, and web development using HTML, CSS, JavaScript, Django, and Flask.',
        'I build efficient, user-friendly applications including invoice management systems and e-commerce platforms. Passionate about machine learning, data analysis, and competitive programming — continuously learning through certifications and hands-on projects.'
      ],
      aboutTextMobile: [
        'B.Tech student in AI & Data Science at KIT, Coimbatore. Proficient in data structures, C, C++, Python, and Web Development, DataBase Management.',
        'Passionate about machine learning, data analysis, and competitive programming. Building innovative solutions through hands-on projects and continuous learning.'
      ],
      quickInfo: [
        { label: 'Full Name', value: 'Balaganesh P' },
        { label: 'Degree', value: 'B.Tech AI & DS' },
        { label: 'College', value: 'KIT, Coimbatore' },
        { label: 'Batch', value: '2024 - 2028' },
        { label: 'Location', value: 'Tamil Nadu, India' }
      ],
      declarationText: 'I hereby declare that the information provided in this portfolio is true and accurate to the best of my knowledge. All the details regarding my education, skills, projects, and certifications are genuine and can be verified upon request.',
      signatureName: 'Balaganesh P',
      signatureLocation: 'Tirupur, Tamil Nadu, India',
      signatureAvatar: 'BG'
    });
    await about.save();

    // 2. Seed Highlights
    const highlights = [
      { value: '6+', label: 'Projects', iconName: 'briefcase' },
      { value: '12+', label: 'Certifications', iconName: 'award' },
      { value: '84%', label: '12th Score', iconName: 'graduation-cap' },
      { value: '2028', label: 'Graduating', iconName: 'file-text' }
    ];
    await Highlight.insertMany(highlights);

    // 3. Seed Skills
    const skills = [
      {
        category: 'Languages',
        tags: ['C', 'C++', 'Python', 'Java', 'JavaScript', 'SQL']
      },
      {
        category: 'Web Development',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'Express', 'Django', 'Flask']
      },
      {
        category: 'Database & Tools',
        tags: ['MongoDB', 'MySQL', 'Git', 'GitHub']
      },
      {
        category: 'Core Skills',
        tags: ['Data Structures', 'Algorithms', 'Machine Learning', 'Data Analysis', 'Problem Solving']
      }
    ];
    await Skill.insertMany(skills);

    // 4. Seed Projects
    const projects = [
      {
        title: 'Billonix',
        number: '01',
        description: 'A comprehensive invoice generation and transaction tracking system designed for small businesses. Features automated billing workflows, expense tracking, and financial reporting capabilities.',
        githubLink: 'https://github.com/Balaganesh5307/Projects/tree/main/Billionix',
        liveLink: 'https://billonix.netlify.app/',
        tags: ['HTML', 'CSS', 'JavaScript', 'Python']
      },
      {
        title: 'Art Heaven',
        number: '02',
        description: 'A responsive e-commerce platform enabling artists to showcase and sell artwork securely. Includes user authentication, payment integration, and an intuitive gallery management system.',
        githubLink: 'https://github.com/Balaganesh5307/Projects/tree/main/ART%20HEAVEN%20-%20ECOMMERCE',
        liveLink: 'https://artheaven.netlify.app/',
        tags: ['HTML', 'CSS', 'JavaScript', 'Flask', 'SQL']
      },
      {
        title: 'Finance Tracker',
        number: '03',
        description: 'A full-stack personal finance management application built with the MERN stack. Track income, expenses, and budgets with real-time analytics, data visualization, and secure user authentication.',
        githubLink: 'https://github.com/Balaganesh5307/Projects/tree/main/Finance%20Tracker%20-%20MERN%20Stack',
        liveLink: 'https://fintrackhub-app.netlify.app/',
        tags: ['MongoDB', 'Express', 'React', 'Node.js']
      },
      {
        title: 'Currency Convertor',
        number: '04',
        description: 'A simple and efficient currency converter application that allows users to instantly convert amounts between different global currencies using real-time exchange rates.',
        githubLink: 'https://github.com/Balaganesh5307/Projects/tree/main/Currency%20Convertor',
        liveLink: 'https://cashdash-app.netlify.app/',
        tags: ['HTML', 'CSS', 'JavaScript']
      },
      {
        title: 'Up Skill',
        number: '05',
        description: 'An AI-powered application that analyzes resumes to provide feedback, ATS scores, GitHub analysis, and resume rewrites. It also suggests roadmaps, project ideas, and career paths using Gemini API integration.',
        githubLink: 'https://github.com/Balaganesh5307/Upskill',
        liveLink: 'https://upskill-enchancer.netlify.app/',
        tags: ['MongoDB', 'Express', 'React', 'Node.js', 'Gemini AI']
      },
      {
        title: 'RealCheck',
        number: '06',
        description: 'Detect AI-Generated Images Instantly — Upload any image and our forensic analysis engine will determine whether it\'s a real photograph or AI-generated content, complete with a visual heatmap.',
        githubLink: 'https://github.com/Balaganesh5307/RealCheck',
        liveLink: 'https://realcheck-1.onrender.com',
        tags: ['MongoDB', 'Express', 'React', 'Node.js', 'Python', 'OpenCV']
      }
    ];
    await Project.insertMany(projects);

    // 5. Seed Education
    const educations = [
      {
        date: '2024 - 2028',
        degree: 'B.Tech - Artificial Intelligence and Data Science',
        institution: 'Kalaignar Karunanidhi Institute of Technology, Coimbatore',
        details: 'Currently Pursuing | CGPA: 8.27 | Focus: AI, Machine Learning, Data Science'
      },
      {
        date: '2023 - 2024',
        degree: 'Higher Secondary Certificate (12th)',
        institution: 'Bharathi Matric Hr.Sec.School, Vijayamangalam, Erode',
        details: 'Total: 504 (84%)'
      },
      {
        date: '2022 - 2023',
        degree: 'Higher Secondary (11th)',
        institution: 'Bharathi Matric Hr.Sec.School, Vijayamangalam, Erode',
        details: 'Total: 447 (74.5%)'
      },
      {
        date: '2021 - 2022',
        degree: 'Secondary School (10th)',
        institution: 'SSM Matric Hr.Sec.School, Akkaraipatti, Dindigul',
        details: 'Total: 366 (73.2%)'
      }
    ];
    await Education.insertMany(educations);

    // Seed Experience
    const experiences = [
      {
        date: 'Jun 2024 - Present',
        role: 'Full Stack Web Developer Intern',
        company: 'Innovate Tech Labs',
        description: 'Developed and maintained responsive web applications using React, Node.js, and Express. Integrated Gemini AI services for natural language processing, optimized database queries in MongoDB to reduce load times by 20%, and worked in an agile team to ship high-quality features weekly.'
      },
      {
        date: 'Dec 2023 - May 2024',
        role: 'Frontend UI/UX Developer Intern',
        company: 'Spark Designs',
        description: 'Created premium responsive landing pages and interfaces using React and Tailwind CSS. Implemented smooth interactive animations with GSAP and ScrollTrigger, resulting in a 15% increase in user session durations. Collaborated with UI design leads to build consistent reusable components.'
      }
    ];
    await Experience.insertMany(experiences);

    // 6. Seed Certifications
    const certifications = [
      {
        title: 'Artificial Intelligence Essentials',
        provider: 'Coursera',
        image: '/Images/Artificial Intelligence Essentials.png',
        iconName: 'brain'
      },
      {
        title: 'Automation and Scripting with Python',
        provider: 'Coursera',
        image: '/Images/Automation and Scripting with Python.png',
        iconName: 'terminal'
      },
      {
        title: 'Responsive Website Basics',
        provider: 'Coursera',
        image: '/Images/Responsive Website Basics - Code with HTML, CSS, and JavaScript.png',
        iconName: 'monitor'
      },
      {
        title: 'Programming in Python',
        provider: 'Coursera',
        image: '/Images/Programming in Python.png',
        iconName: 'code'
      },
      {
        title: 'Introduction to Back-End Development',
        provider: 'Coursera',
        image: '/Images/Introduction to Back - End Development.png',
        iconName: 'server'
      },
      {
        title: 'Data Analysis and Visualization with Python',
        provider: 'Coursera',
        image: '/Images/Data Analysis and Visualization with Python.png',
        iconName: 'bar-chart'
      },
      {
        title: 'Python Programming Fundamentals',
        provider: 'Coursera',
        image: '/Images/Python Programming Fundamentals.png',
        iconName: 'code'
      },
      {
        title: 'Web Development in Python',
        provider: 'Coursera',
        image: '/Images/Web Development in Python.png',
        iconName: 'code'
      },
      {
        title: 'Advanced Diploma in Computer Application (ADCA)',
        provider: 'CSC',
        image: '/Images/Advanced Diploma in Computer Application (ADCA).jpg',
        iconName: 'graduation-cap'
      },
      {
        title: 'Master Generative AI & Generative AI Tools',
        provider: 'Infosys Springboard',
        image: '/Images/Master Generative AI & Tools.jpg',
        iconName: 'cpu'
      },
      {
        title: 'Introduction to MongoDB',
        provider: 'Coursera',
        image: '/Images/Introduction to Mongodb.png',
        iconName: 'database'
      },
      {
        title: 'Introduction to Data Engineering and BigData',
        provider: 'Coursera',
        image: '/Images/Introduction to Data Engineering and BigData.jpg',
        iconName: 'layers'
      }
    ];
    await Certification.insertMany(certifications);

    // 7. Seed Platforms
    const platforms = [
      {
        name: 'GitHub',
        url: 'https://github.com/Balaganesh5307/',
        handle: '@Balaganesh5307',
        iconName: 'github',
        stats: [
          { label: 'Status', value: 'Active' },
          { label: 'Projects', value: '4+' }
        ]
      },
      {
        name: 'Codolio',
        url: 'https://codolio.com/profile/Balaganesh.123',
        handle: '@Balaganesh123',
        iconName: 'code',
        stats: [
          { label: 'Status', value: 'Active' },
          { label: 'Focus', value: 'CP' }
        ]
      },
      {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/balaganesh-p-4b3057328/',
        handle: '@balaganesh',
        iconName: 'linkedin',
        stats: [
          { label: 'Networking', value: 'Active' },
          { label: 'Connections', value: '500+' }
        ]
      }
    ];
    await Platform.insertMany(platforms);

    console.log('Database successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedData();
