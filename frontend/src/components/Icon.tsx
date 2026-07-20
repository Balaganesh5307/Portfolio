import React from 'react';
import { 
  Briefcase, 
  Award, 
  GraduationCap, 
  FileText, 
  Brain, 
  Terminal, 
  Monitor, 
  Code, 
  Server, 
  BarChart, 
  Cpu, 
  Database, 
  Layers, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

interface CustomIconProps {
  className?: string;
  size?: number;
}

export const Github: React.FC<CustomIconProps> = ({ className = '', size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export const Linkedin: React.FC<CustomIconProps> = ({ className = '', size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className = '', size = 20 }) => {
  switch (name.toLowerCase()) {
    case 'briefcase':
      return <Briefcase className={className} size={size} />;
    case 'award':
      return <Award className={className} size={size} />;
    case 'graduation-cap':
      return <GraduationCap className={className} size={size} />;
    case 'file-text':
      return <FileText className={className} size={size} />;
    case 'brain':
      return <Brain className={className} size={size} />;
    case 'terminal':
      return <Terminal className={className} size={size} />;
    case 'monitor':
      return <Monitor className={className} size={size} />;
    case 'code':
      return <Code className={className} size={size} />;
    case 'server':
      return <Server className={className} size={size} />;
    case 'bar-chart':
      return <BarChart className={className} size={size} />;
    case 'cpu':
      return <Cpu className={className} size={size} />;
    case 'database':
      return <Database className={className} size={size} />;
    case 'layers':
      return <Layers className={className} size={size} />;
    case 'github':
      return <Github className={className} size={size} />;
    case 'linkedin':
      return <Linkedin className={className} size={size} />;
    case 'mail':
      return <Mail className={className} size={size} />;
    case 'phone':
      return <Phone className={className} size={size} />;
    case 'map-pin':
      return <MapPin className={className} size={size} />;
    case 'external-link':
      return <ExternalLink className={className} size={size} />;
    case 'chevron-left':
      return <ChevronLeft className={className} size={size} />;
    case 'chevron-right':
      return <ChevronRight className={className} size={size} />;
    case 'x':
      return <X className={className} size={size} />;
    default:
      return <Code className={className} size={size} />;
  }
};
