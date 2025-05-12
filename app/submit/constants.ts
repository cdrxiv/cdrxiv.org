export const PATHS = [
  { title: 'Submission', href: '/submit/overview', public: false },
  { title: 'Information', href: '/submit/info', public: false },
  { title: 'Authors', href: '/submit/authors', public: false },
  { title: 'Confirmation', href: '/submit/confirm', public: false },
  {
    title: 'Submission Successful',
    href: '/submit/success',
    public: false,
    hidden: true,
  },
]

export const LICENSE_MAPPING = {
  'cc-by-4.0': 1,
  'cc-by-nc-4.0': 4,
}

export const SUGGESTED_KEYWORD_MAPPING = {
  'Biological CDR': [
    'bioenergy with carbon capture and storage',
    'beccs',
    'biochar',
    'biomass burial',
    'forests',
    'soil',
    'ocean biomass',
  ],
  'Geochemical CDR': [
    'enhanced weathering',
    'erw',
    'ocean alkalinity enhancement',
    'oae',
    'mineralization',
  ],
  'Synthetic CDR': ['direct air capture', 'dac', 'direct ocean capture', 'doc'],
  Accounting: [
    'lifecycle assessment',
    'lca',
    'standards',
    'mrv',
    'carbon accounting',
  ],
  'Experiments and field trials': ['lab', 'pilot', 'mesocosm', 'field'],
  Modeling: [
    'physical modeling',
    'economic modeling',
    'system modeling',
    'climate modeling',
    'technoeconomic assessment',
    'tea',
    'geospatial analysis',
  ],
  'Qualitative research': [
    'ethnography',
    'interviews',
    'case studies',
    'stakeholder engagement',
    'surveys',
  ],
  'Storage process': ['temporary cdr', 'permanent cdr', 'geologic storage'],
  'Supporting infrastructure': ['energy', 'materials', 'sensors'],
}
