/**
 * Utility functions for generating and sharing email invitations for StudiRad Community Groups
 */

export interface GroupInviteParams {
    groupName: string;
    category: string;
    platform: 'whatsapp' | 'telegram' | 'slack' | string;
    platformLink: string;
    description: string;
    acceptedMembers?: 'students' | 'professionals' | 'all' | string;
    adminQualification?: string;
    adminEmail?: string;
  }
  
  export interface GroupInviteTemplate {
    subject: string;
    body: string;
    fullText: string;
  }
  
  const MEMBERS_LABEL: Record<string, string> = {
    students: 'Radiography Students Only',
    professionals: 'Licensed Radiographers & Clinical Professionals',
    all: 'Open to All (Students, Radiographers & Faculty)'
  };
  
  const PLATFORM_LABEL: Record<string, string> = {
    whatsapp: 'WhatsApp Group',
    telegram: 'Telegram Group/Channel',
    slack: 'Slack Workspace'
  };
  
  export const generateGroupInviteTemplate = (params: GroupInviteParams): GroupInviteTemplate => {
    const groupName = params.groupName.trim() || 'Our Radiography Group';
    const category = params.category || 'Radiography';
    const platformName = PLATFORM_LABEL[params.platform] || params.platform || 'Community Group';
    const platformLink = params.platformLink?.trim() || '[Group Invite Link]';
    const audience = MEMBERS_LABEL[params.acceptedMembers || 'all'] || 'Open to All Radiography Students & Professionals';
    const adminRole = params.adminQualification || 'Radiography Colleague';
    const description = params.description?.trim() || 'A focused community for Radiography study, collaboration, and professional exchange.';
  
    const subject = `Invitation to join "${groupName}" on StudiRad Community`;
  
    const body = `Dear Colleague / Student,
  
  You are invited to join "${groupName}", an academic and professional group focused on ${category} on StudiRad.
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  GROUP DETAILS
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • Group Name: ${groupName}
  • Focus Category: ${category}
  • Target Audience: ${audience}
  • Group Admin: ${adminRole}
  • Platform: ${platformName}
  
  ABOUT THIS GROUP:
  ${description}
  
  HOW TO JOIN:
  Click the link below to join our ${platformName}:
  👉 ${platformLink}
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ABOUT STUDIRAD:
  StudiRad is the digital ecosystem for Radiography students, educators, and clinicians worldwide. Discover more study groups, clinical case challenges, resources, and career updates at:
  🌐 https://studirad.org/community
  
  We look forward to collaborating with you!
  
  Warm regards,
  ${params.adminEmail ? params.adminEmail : 'Group Coordinator'}
  StudiRad Community`;
  
    const fullText = `Subject: ${subject}\n\n${body}`;
  
    return {
      subject,
      body,
      fullText
    };
  };
  
  /**
   * Parses a string of emails separated by commas, semicolons, spaces, or newlines
   */
  export const parseEmailList = (raw: string): string[] => {
    if (!raw) return [];
    const parts = raw.split(/[\s,;]+/);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return Array.from(
      new Set(
        parts
          .map(p => p.trim())
          .filter(p => emailRegex.test(p))
      )
    );
  };
  
  /**
   * Builds a standard mailto: URL with recipients, subject, and encoded body
   */
  export const buildMailtoUrl = (recipients: string[], subject: string, body: string): string => {
    const to = recipients.join(',');
    const params: string[] = [];
    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
    if (body) params.push(`body=${encodeURIComponent(body)}`);
    
    return `mailto:${to}${params.length > 0 ? '?' + params.join('&') : ''}`;
  };
  
  /**
   * Builds a direct Gmail web compose URL with recipients, subject, and encoded body
   */
  export const buildGmailWebUrl = (recipients: string[], subject: string, body: string): string => {
    const to = recipients.join(',');
    const su = encodeURIComponent(subject);
    const b = encodeURIComponent(body);
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${su}&body=${b}`;
  };
  