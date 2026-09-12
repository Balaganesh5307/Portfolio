import supabase from '../config/supabase.js';

// Helper: Normalize Supabase row to include camelCase and _id
export const normalizeRow = (row) => {
  if (!row) return null;
  const copy = { ...row, _id: row.id };

  // Common camelCase mappings
  if (row.highlightedname !== undefined) copy.highlightedName = row.highlightedname;
  if (row.resumeurl !== undefined) copy.resumeUrl = row.resumeurl;
  if (row.abouttextdesktop !== undefined) copy.aboutTextDesktop = row.abouttextdesktop;
  if (row.abouttextmobile !== undefined) copy.aboutTextMobile = row.abouttextmobile;
  if (row.quickinfo !== undefined) copy.quickInfo = row.quickinfo;
  if (row.declarationtext !== undefined) copy.declarationText = row.declarationtext;
  if (row.signaturename !== undefined) copy.signatureName = row.signaturename;
  if (row.signaturelocation !== undefined) copy.signatureLocation = row.signaturelocation;
  if (row.signatureavatar !== undefined) copy.signatureAvatar = row.signatureavatar;
  if (row.logourl !== undefined) copy.logoUrl = row.logourl;
  if (row.profileimage !== undefined) copy.profileImage = row.profileimage;

  if (row.iconname !== undefined) copy.iconName = row.iconname;
  if (row.githublink !== undefined) copy.githubLink = row.githublink;
  if (row.livelink !== undefined) copy.liveLink = row.livelink;
  if (row.issuedate !== undefined) copy.issueDate = row.issuedate;
  if (row.credentialurl !== undefined) copy.credentialUrl = row.credentialurl;
  if (row.fileurl !== undefined) copy.fileUrl = row.fileurl;
  if (row.originalname !== undefined) copy.originalName = row.originalname;
  if (row.filesize !== undefined) copy.fileSize = row.filesize;
  if (row.coverimage !== undefined) copy.coverImage = row.coverimage;

  // Resume normalization
  if (copy.fileUrl || copy.fileurl) {
    copy.filePath = copy.filePath || copy.fileUrl || copy.fileurl;
    copy.fileUrl = copy.fileUrl || copy.filePath || copy.fileurl;
  }
  if (copy.originalName || copy.originalname) {
    const rawName = copy.originalName || copy.originalname;
    if (rawName.includes(' — ')) {
      const parts = rawName.split(' — ');
      copy.version = copy.version || parts[0];
      copy.fileName = copy.fileName || parts.slice(1).join(' — ');
    } else if (rawName.includes(' - ')) {
      const parts = rawName.split(' - ');
      copy.version = copy.version || parts[0];
      copy.fileName = copy.fileName || parts.slice(1).join(' - ');
    } else {
      copy.fileName = copy.fileName || rawName;
      copy.version = copy.version || 'v1.0';
    }
    copy.originalName = copy.originalName || rawName;
  }
  copy.createdAt = copy.createdAt || row.created_at || row.uploadedat || row.uploadedAt || new Date().toISOString();

  // Education normalization (support both schema formats)
  if (row.school !== undefined && copy.institution === undefined) copy.institution = row.school;
  if (row.institution !== undefined && copy.school === undefined) copy.school = row.institution;
  if (row.description !== undefined && copy.details === undefined) copy.details = row.description;
  if (row.details !== undefined && copy.description === undefined) copy.description = row.details;

  // Experience normalization
  if (row.title !== undefined && copy.role === undefined) copy.role = row.title;
  if (row.period !== undefined && copy.date === undefined) copy.date = row.period;
  if (row.technologies && typeof row.technologies === 'object' && !Array.isArray(row.technologies)) {
    if (row.technologies.startDate !== undefined) copy.startDate = row.technologies.startDate;
    if (row.technologies.endDate !== undefined) copy.endDate = row.technologies.endDate;
    if (row.technologies.certificateName !== undefined) copy.certificateName = row.technologies.certificateName;
    if (row.technologies.certificatePath !== undefined) copy.certificatePath = row.technologies.certificatePath;
  }

  // Platforms normalization
  if (row.username !== undefined && copy.handle === undefined) copy.handle = row.username;
  if (row.icon !== undefined && copy.iconName === undefined) copy.iconName = row.icon;
  if (!copy.stats || copy.stats.length === 0) {
    if (row.name?.toLowerCase().includes('github')) {
      copy.stats = [{ label: 'Status', value: 'Active' }, { label: 'Projects', value: '4+' }];
    } else if (row.name?.toLowerCase().includes('codolio')) {
      copy.stats = [{ label: 'Status', value: 'Active' }, { label: 'Focus', value: 'CP' }];
    } else if (row.name?.toLowerCase().includes('linkedin')) {
      copy.stats = [{ label: 'Networking', value: 'Active' }, { label: 'Connections', value: '500+' }];
    }
  }

  return copy;
};

// ==================== ABOUT ====================
export const getAbout = async () => {
  const { data, error } = await supabase.from('about').select('*').limit(1).maybeSingle();
  if (error) throw error;
  return normalizeRow(data);
};

export const updateAbout = async (payload) => {
  const existing = await getAbout();
  const dbData = {
    name: payload.name,
    highlightedname: payload.highlightedName !== undefined ? payload.highlightedName : payload.highlightedname,
    title: payload.title,
    summary: payload.summary,
    resumeurl: payload.resumeUrl !== undefined ? payload.resumeUrl : payload.resumeurl,
    email: payload.email,
    phone: payload.phone,
    location: payload.location,
    abouttextdesktop: payload.aboutTextDesktop !== undefined ? payload.aboutTextDesktop : payload.abouttextdesktop,
    abouttextmobile: payload.aboutTextMobile !== undefined ? payload.aboutTextMobile : payload.abouttextmobile,
    quickinfo: payload.quickInfo !== undefined ? payload.quickInfo : payload.quickinfo,
    declarationtext: payload.declarationText !== undefined ? payload.declarationText : payload.declarationtext,
    signaturename: payload.signatureName !== undefined ? payload.signatureName : payload.signaturename,
    signaturelocation: payload.signatureLocation !== undefined ? payload.signatureLocation : payload.signaturelocation,
    signatureavatar: payload.signatureAvatar !== undefined ? payload.signatureAvatar : payload.signatureavatar,
    logourl: payload.logoUrl !== undefined ? payload.logoUrl : payload.logourl,
    profileimage: payload.profileImage !== undefined ? payload.profileImage : payload.profileimage,
    updated_at: new Date().toISOString()
  };

  // Clean undefined values
  Object.keys(dbData).forEach(k => dbData[k] === undefined && delete dbData[k]);

  let result;
  if (existing && existing.id) {
    const { data, error } = await supabase.from('about').update(dbData).eq('id', existing.id).select().single();
    if (error) throw error;
    result = data;
  } else {
    const { data, error } = await supabase.from('about').insert(dbData).select().single();
    if (error) throw error;
    result = data;
  }
  return normalizeRow(result);
};

// ==================== HIGHLIGHTS ====================
export const getHighlights = async () => {
  const { data, error } = await supabase.from('highlights').select('*').order('display_order', { ascending: true });
  if (error) throw error;

  // Dynamically compute exact projects and certifications count from the database
  let projectCount = null;
  let certCount = null;
  try {
    const [{ count: pCount }, { count: cCount }] = await Promise.all([
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('certifications').select('*', { count: 'exact', head: true })
    ]);
    projectCount = pCount;
    certCount = cCount;
  } catch (e) {
    console.error('Error fetching counts for highlights:', e);
  }

  return (data || []).map(row => {
    const norm = normalizeRow(row);
    const label = (norm.label || '').toLowerCase();
    if (label.includes('project') && projectCount !== null && projectCount !== undefined) {
      norm.value = `${projectCount}+`;
    }
    if (label.includes('certificat') && certCount !== null && certCount !== undefined) {
      norm.value = `${certCount}+`;
    }
    return norm;
  });
};

export const createHighlight = async (payload) => {
  const dbData = {
    value: payload.value,
    label: payload.label,
    iconname: payload.iconName || payload.iconname || 'award',
    display_order: payload.display_order || 0
  };
  const { data, error } = await supabase.from('highlights').insert(dbData).select().single();
  if (error) throw error;
  return normalizeRow(data);
};

export const updateHighlight = async (id, payload) => {
  const dbData = {};
  if (payload.value !== undefined) dbData.value = payload.value;
  if (payload.label !== undefined) dbData.label = payload.label;
  if (payload.iconName !== undefined || payload.iconname !== undefined) {
    dbData.iconname = payload.iconName || payload.iconname;
  }
  if (payload.display_order !== undefined) dbData.display_order = payload.display_order;

  const { data, error } = await supabase.from('highlights').update(dbData).eq('id', id).select().single();
  if (error) throw error;
  return normalizeRow(data);
};

export const deleteHighlight = async (id) => {
  const { error } = await supabase.from('highlights').delete().eq('id', id);
  if (error) throw error;
  return { success: true };
};

// ==================== SKILLS ====================
export const getSkills = async () => {
  const { data, error } = await supabase.from('skills').select('*').order('display_order', { ascending: true });
  if (error) throw error;
  return (data || []).map(normalizeRow);
};

export const createSkill = async (payload) => {
  const dbData = {
    category: payload.category,
    tags: payload.tags || [],
    display_order: payload.display_order || 0
  };
  const { data, error } = await supabase.from('skills').insert(dbData).select().single();
  if (error) throw error;
  return normalizeRow(data);
};

export const updateSkill = async (id, payload) => {
  const dbData = {};
  if (payload.category !== undefined) dbData.category = payload.category;
  if (payload.tags !== undefined) dbData.tags = payload.tags;
  if (payload.display_order !== undefined) dbData.display_order = payload.display_order;

  const { data, error } = await supabase.from('skills').update(dbData).eq('id', id).select().single();
  if (error) throw error;
  return normalizeRow(data);
};

export const deleteSkill = async (id) => {
  const { error } = await supabase.from('skills').delete().eq('id', id);
  if (error) throw error;
  return { success: true };
};

// ==================== PROJECTS ====================
export const getProjects = async () => {
  const { data, error } = await supabase.from('projects').select('*').order('number', { ascending: true });
  if (error) throw error;
  return (data || []).map(normalizeRow);
};

export const createProject = async (payload) => {
  const dbData = {
    title: payload.title,
    number: payload.number || '01',
    description: payload.description,
    githublink: payload.githubLink || payload.githublink || '',
    livelink: payload.liveLink || payload.livelink || '',
    tags: payload.tags || [],
    image: payload.image || null,
    featured: Boolean(payload.featured),
    display_order: payload.display_order || 0
  };
  const { data, error } = await supabase.from('projects').insert(dbData).select().single();
  if (error) throw error;
  return normalizeRow(data);
};

export const updateProject = async (id, payload) => {
  const dbData = {};
  if (payload.title !== undefined) dbData.title = payload.title;
  if (payload.number !== undefined) dbData.number = payload.number;
  if (payload.description !== undefined) dbData.description = payload.description;
  if (payload.githubLink !== undefined || payload.githublink !== undefined) {
    dbData.githublink = payload.githubLink || payload.githublink;
  }
  if (payload.liveLink !== undefined || payload.livelink !== undefined) {
    dbData.livelink = payload.liveLink || payload.livelink;
  }
  if (payload.tags !== undefined) dbData.tags = payload.tags;
  if (payload.image !== undefined) dbData.image = payload.image;
  if (payload.featured !== undefined) dbData.featured = Boolean(payload.featured);
  if (payload.display_order !== undefined) dbData.display_order = payload.display_order;

  const { data, error } = await supabase.from('projects').update(dbData).eq('id', id).select().single();
  if (error) throw error;
  return normalizeRow(data);
};

export const deleteProject = async (id) => {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
  return { success: true };
};

// ==================== EDUCATION ====================
export const getEducation = async () => {
  const { data, error } = await supabase.from('education').select('*').order('display_order', { ascending: true });
  if (error) throw error;
  return (data || []).map(normalizeRow);
};

export const createEducation = async (payload) => {
  const dbData = {
    date: payload.date || '',
    degree: payload.degree || '',
    school: payload.institution !== undefined ? payload.institution : (payload.school || ''),
    location: payload.location || '',
    grade: payload.grade || '',
    description: payload.details !== undefined ? payload.details : (payload.description || ''),
    display_order: payload.display_order || 0
  };
  const { data, error } = await supabase.from('education').insert(dbData).select().single();
  if (error) throw error;
  return normalizeRow(data);
};

export const updateEducation = async (id, payload) => {
  const dbData = {};
  if (payload.date !== undefined) dbData.date = payload.date;
  if (payload.degree !== undefined) dbData.degree = payload.degree;
  if (payload.institution !== undefined || payload.school !== undefined) {
    dbData.school = payload.institution !== undefined ? payload.institution : payload.school;
  }
  if (payload.details !== undefined || payload.description !== undefined) {
    dbData.description = payload.details !== undefined ? payload.details : payload.description;
  }
  if (payload.location !== undefined) dbData.location = payload.location;
  if (payload.grade !== undefined) dbData.grade = payload.grade;
  if (payload.display_order !== undefined) dbData.display_order = payload.display_order;

  const { data, error } = await supabase.from('education').update(dbData).eq('id', id).select().single();
  if (error) throw error;
  return normalizeRow(data);
};

export const deleteEducation = async (id) => {
  const { error } = await supabase.from('education').delete().eq('id', id);
  if (error) throw error;
  return { success: true };
};

// ==================== EXPERIENCE ====================
export const getExperience = async () => {
  const { data, error } = await supabase.from('experience').select('*').order('display_order', { ascending: true });
  if (error) throw error;
  return (data || []).map(normalizeRow);
};

export const createExperience = async (payload) => {
  const dbData = {
    title: payload.role !== undefined ? payload.role : (payload.title || ''),
    company: payload.company || '',
    period: payload.date !== undefined ? payload.date : (payload.period || ''),
    description: payload.description || '',
    technologies: {
      role: payload.role || payload.title || '',
      startDate: payload.startDate || null,
      endDate: payload.endDate || null,
      certificateName: payload.certificateName || '',
      certificatePath: payload.certificatePath || ''
    },
    display_order: payload.display_order || 0
  };
  const { data, error } = await supabase.from('experience').insert(dbData).select().single();
  if (error) throw error;
  return normalizeRow(data);
};

export const updateExperience = async (id, payload) => {
  const dbData = {};
  if (payload.role !== undefined || payload.title !== undefined) {
    dbData.title = payload.role !== undefined ? payload.role : payload.title;
  }
  if (payload.company !== undefined) dbData.company = payload.company;
  if (payload.date !== undefined || payload.period !== undefined) {
    dbData.period = payload.date !== undefined ? payload.date : payload.period;
  }
  if (payload.description !== undefined) dbData.description = payload.description;
  if (payload.startDate !== undefined || payload.endDate !== undefined || payload.certificateName !== undefined || payload.certificatePath !== undefined) {
    dbData.technologies = {
      role: payload.role || payload.title || '',
      startDate: payload.startDate || null,
      endDate: payload.endDate || null,
      certificateName: payload.certificateName || '',
      certificatePath: payload.certificatePath || ''
    };
  }
  if (payload.display_order !== undefined) dbData.display_order = payload.display_order;

  const { data, error } = await supabase.from('experience').update(dbData).eq('id', id).select().single();
  if (error) throw error;
  return normalizeRow(data);
};

export const deleteExperience = async (id) => {
  const { error } = await supabase.from('experience').delete().eq('id', id);
  if (error) throw error;
  return { success: true };
};

// ==================== CERTIFICATIONS ====================
export const getCertifications = async () => {
  const { data, error } = await supabase.from('certifications').select('*').order('display_order', { ascending: true });
  if (error) throw error;
  return (data || []).map(normalizeRow);
};

export const createCertification = async (payload) => {
  const dbData = {
    title: payload.title,
    provider: payload.provider,
    issuedate: payload.issueDate || payload.issuedate || '',
    credentialurl: payload.credentialUrl || payload.credentialurl || '',
    image: payload.image || null,
    display_order: payload.display_order || 0
  };
  const { data, error } = await supabase.from('certifications').insert(dbData).select().single();
  if (error) throw error;
  return normalizeRow(data);
};

export const updateCertification = async (id, payload) => {
  const dbData = {};
  if (payload.title !== undefined) dbData.title = payload.title;
  if (payload.provider !== undefined) dbData.provider = payload.provider;
  if (payload.issueDate !== undefined || payload.issuedate !== undefined) {
    dbData.issuedate = payload.issueDate || payload.issuedate;
  }
  if (payload.credentialUrl !== undefined || payload.credentialurl !== undefined) {
    dbData.credentialurl = payload.credentialUrl || payload.credentialurl;
  }
  if (payload.image !== undefined) dbData.image = payload.image;
  if (payload.display_order !== undefined) dbData.display_order = payload.display_order;

  const { data, error } = await supabase.from('certifications').update(dbData).eq('id', id).select().single();
  if (error) throw error;
  return normalizeRow(data);
};

export const deleteCertification = async (id) => {
  const { error } = await supabase.from('certifications').delete().eq('id', id);
  if (error) throw error;
  return { success: true };
};

// ==================== PLATFORMS ====================
export const getPlatforms = async () => {
  const { data, error } = await supabase.from('platforms').select('*').order('display_order', { ascending: true });
  if (error) throw error;
  return (data || []).map(normalizeRow);
};

export const createPlatform = async (payload) => {
  const dbData = {
    name: payload.name,
    url: payload.url,
    username: payload.handle !== undefined ? payload.handle : (payload.username || ''),
    icon: payload.iconName !== undefined ? payload.iconName : (payload.icon || ''),
    display_order: payload.display_order || 0
  };
  const { data, error } = await supabase.from('platforms').insert(dbData).select().single();
  if (error) throw error;
  return normalizeRow(data);
};

export const updatePlatform = async (id, payload) => {
  const dbData = {};
  if (payload.name !== undefined) dbData.name = payload.name;
  if (payload.url !== undefined) dbData.url = payload.url;
  if (payload.handle !== undefined || payload.username !== undefined) {
    dbData.username = payload.handle !== undefined ? payload.handle : payload.username;
  }
  if (payload.iconName !== undefined || payload.icon !== undefined) {
    dbData.icon = payload.iconName !== undefined ? payload.iconName : payload.icon;
  }
  if (payload.display_order !== undefined) dbData.display_order = payload.display_order;

  const { data, error } = await supabase.from('platforms').update(dbData).eq('id', id).select().single();
  if (error) throw error;
  return normalizeRow(data);
};

export const deletePlatform = async (id) => {
  const { error } = await supabase.from('platforms').delete().eq('id', id);
  if (error) throw error;
  return { success: true };
};

// ==================== RESUMES ====================
export const getResumes = async () => {
  const { data, error } = await supabase.from('resumes').select('*').order('uploadedat', { ascending: false });
  if (error) throw error;

  const about = await getAbout();
  const activeUrl = about?.resumeUrl || about?.resumeurl;

  const normalized = (data || []).map(normalizeRow);

  let foundActive = false;
  normalized.forEach(r => {
    if (activeUrl && (r.fileUrl === activeUrl || r.filePath === activeUrl)) {
      r.isActive = true;
      foundActive = true;
    } else {
      r.isActive = false;
    }
  });

  if (!foundActive && normalized.length > 0) {
    normalized[0].isActive = true;
  }

  return normalized;
};

export const createResume = async (payload) => {
  const version = payload.version ? payload.version.trim() : '';
  const rawFileName = payload.originalName || payload.originalname || payload.fileName || payload.filename || 'resume.pdf';
  let combinedOriginalName = rawFileName;
  if (version && !rawFileName.startsWith(version)) {
    combinedOriginalName = `${version} - ${rawFileName}`;
  }

  const fileUrl = payload.fileUrl || payload.fileurl || payload.filePath || payload.filepath;

  const dbData = {
    fileurl: fileUrl,
    originalname: combinedOriginalName,
    filesize: payload.fileSize || payload.filesize || 0
  };

  const { data, error } = await supabase.from('resumes').insert(dbData).select().single();
  if (error) throw error;

  // Set the new resume as active in About profile
  if (fileUrl) {
    await updateAbout({ resumeUrl: fileUrl });
  }

  return normalizeRow(data);
};

export const activateResume = async (id) => {
  const { data: resume, error } = await supabase.from('resumes').select('*').eq('id', id).single();
  if (error) throw error;

  const norm = normalizeRow(resume);
  const fileUrl = norm.fileUrl || norm.filePath;

  if (fileUrl) {
    await updateAbout({ resumeUrl: fileUrl });
  }

  return norm;
};

export const deleteResume = async (id) => {
  const { error } = await supabase.from('resumes').delete().eq('id', id);
  if (error) throw error;
  return { success: true };
};

// ==================== BLOGS ====================
export const getBlogs = async (onlyPublished = true) => {
  let query = supabase.from('blogs').select('*').order('created_at', { ascending: false });
  if (onlyPublished) query = query.eq('published', true);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(normalizeRow);
};

export const getBlogBySlug = async (slug) => {
  const { data, error } = await supabase.from('blogs').select('*').eq('slug', slug).single();
  if (error) throw error;
  return normalizeRow(data);
};

export const createBlog = async (payload) => {
  const dbData = {
    title: payload.title,
    slug: payload.slug || payload.title.toLowerCase().replace(/\s+/g, '-'),
    excerpt: payload.excerpt,
    content: payload.content,
    coverimage: payload.coverImage || payload.coverimage,
    tags: payload.tags || [],
    published: Boolean(payload.published),
    views: 0
  };
  const { data, error } = await supabase.from('blogs').insert(dbData).select().single();
  if (error) throw error;
  return normalizeRow(data);
};

export const updateBlog = async (id, payload) => {
  const dbData = {};
  if (payload.title !== undefined) dbData.title = payload.title;
  if (payload.slug !== undefined) dbData.slug = payload.slug;
  if (payload.excerpt !== undefined) dbData.excerpt = payload.excerpt;
  if (payload.content !== undefined) dbData.content = payload.content;
  if (payload.coverImage !== undefined || payload.coverimage !== undefined) {
    dbData.coverimage = payload.coverImage || payload.coverimage;
  }
  if (payload.tags !== undefined) dbData.tags = payload.tags;
  if (payload.published !== undefined) dbData.published = Boolean(payload.published);
  if (payload.views !== undefined) dbData.views = payload.views;
  dbData.updated_at = new Date().toISOString();

  const { data, error } = await supabase.from('blogs').update(dbData).eq('id', id).select().single();
  if (error) throw error;
  return normalizeRow(data);
};

export const deleteBlog = async (id) => {
  const { error } = await supabase.from('blogs').delete().eq('id', id);
  if (error) throw error;
  return { success: true };
};
