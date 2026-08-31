export interface TeamMember {
    id: string;
    name: string;
    role: string;
    type: 'Founder' | 'member' | 'volunteer' | 'Contributor';
    image?: string;
    bio?: string;
    department?: string;
  }
  
  export const TEAM_MEMBERS: TeamMember[] = [
    {
      id: 'tm-1',
      name: 'Rad Wisdom Warrie',
      role: 'Founder and Educator',
      type: 'member',
      image: 'Warrie.jpeg',
    },
    {
      id: 'tm-2',
      name: 'Rad Cletus Ogbu',
      role: 'Educator & Community Lead ',

      type: 'member',
      image: 'Cranium.jpg',
    },
    {
      id: 'tm-3',
      name: 'Academic Coordinator',
      role: 'Curriculum & Course Creator',
      type: 'member',
      image: 'Cletus.jpeg',
    },
    {
      id: 'tm-4',
      name: 'Hannah Ekanem',
      role: 'Community Educator',
      type: 'member',
      image: '/team/team-4.jpg',
    },
    {
        id: 'tm-4',
        name: 'Peter Emieje',
        role: 'Community Educator',
        type: 'member',
        image: 'Peter.jpg',
      }
  ];
  
  export const VOLUNTEERS: TeamMember[] = [
    {
      id: 'vol-1',
      name: 'Akanji Oluwaseun',
      role: 'Course Creation Assistant',
      type: 'Contributor',
      image: 'Akanji.jpeg',
    },
    {
      id: 'vol-2',
      name: 'Mrs Rachel Okorie',
      role: 'Social Media Manager',
      type: 'Contributor',
      image: 'Rachel.jpeg',
    },
    {
      id: 'vol-3',
      name: 'Henry ',
      role: 'Chief Graphic Designer',
      type: 'volunteer',
      image: 'henri.jpeg',
    },
    {
      id: 'vol-4',
      name: 'Wofai Ibor',
      role: 'Virtual Assistant',
      type: 'volunteer',
      image: 'Wofai.jpeg',
    },
    {
      id: 'vol-5',
      name: 'Raymond Blessing',
      role: 'Course Content Creator',
      type: 'volunteer',
      image: 'Raymond.jpeg',
    },
    {
      id: 'vol-6',
      name: 'Obiazikwor Rejoice',
      role: 'Creative content Assistant',
      type: 'volunteer',
      image: 'Rejoice.jpeg',
    },
    {
        id: 'vol-7',
        name: 'Igbiriki Perfect',
        role: 'Content Editor',
        type: 'volunteer',
        image: 'Igbiriki.jpeg',
      },
      {
        id: 'vol-8',
        name: 'Nwankwo Chukwuemeka',
        role: 'Graphic Designer',
        type: 'volunteer',
        image: 'Nwankwo.PNG',
      },
      {
        id: 'vol-9',
        name: 'Fortune Emmanuel',
        role: 'Editor & Event planner',
        type: 'volunteer',
        image: 'Fortune.jpeg',
      },
      {
        id: 'vol-10',
        name: 'Grace Ijeh',
        role: 'Course Content creator',
        type: 'volunteer',
        image: 'GraceIjeh.jpeg',
      },
      {
        id: 'vol-11',
        name: 'Etan Mark',
        role: 'Opportunity Sourcing',
        type: 'volunteer',
        image: 'EtanMark.png',
      },
      {
        id: 'vol-11',
        name: 'Okoro Magdalene',
        role: 'Content Creator & Writer ',
        type: 'volunteer',
        image: 'okoro.jpeg',
      }
  ];
  