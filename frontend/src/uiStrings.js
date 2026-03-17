export const uiStrings = {
  en: {
    appTitle: 'Toolkit for Disability Wellbeing',
    skipToMain: 'Skip to main content',
    accessibility: 'Accessibility',
    language: 'Language',
    nav: {
      about: 'About',
      resources: 'Resources',
      stories: 'Stories',
      map: 'Map',
      advocacy: 'Advocacy',
    },
    home: {
      title: 'Toolkit for Disability Wellbeing',
      cards: {
        resourcesTitle: 'Immediate Resources',
        resourcesBody: 'Find healthcare, legal, housing, and community support.',
        storiesTitle: 'Community Stories',
        storiesBody: 'Read lived experiences from disabled residents.',
        mapTitle: 'Accessibility Map',
        mapBody: 'Explore accessible and inaccessible spaces in Bethlehem.',
        policyTitle: 'Policy & Service Gaps',
        policyBody: 'Learn about local accessibility challenges and recommendations.',
        activismTitle: 'Disability Activism',
        activismBody: 'Explore movements and discussions around disability justice.',
        reportTitle: 'Report an Issue',
        reportBody: 'Share an accessibility barrier in the community.',
        submitTitle: 'Submit a Resource or Story',
        submitBody: 'Share a resource or community story for review.',
        aboutTitle: 'About the Toolkit',
        aboutBody: 'Learn about the project and collaborators.',
      },
      cta: {
        text: "Know something we don't? This toolkit grows through community contribution.",
        button: 'Contribute to the Toolkit',
      },
    },
    pages: {
      immediateResources: {
        title: 'Immediate Resources',
        subtitle: 'Healthcare, legal, and community support in Bethlehem.',
        backHome: '← Back to Home',
        loading: 'Loading resources...',
        searchLabel: 'Search resources',
        searchPlaceholder: 'Search by name, description, or category…',
        filterLegend: 'Filter by category',
        filterAll: 'All',
      },
      communityStories: {
        title: 'Community Stories',
        subtitle:
          'Lived experiences from disabled residents and their communities in Bethlehem.',
        backHome: '← Back to Home',
        loading: 'Loading stories...',
        empty: 'No stories have been added yet. Check back soon.',
        readFull: 'Read Full Story →',
      },
      policyGaps: {
        loading: 'Loading Policy & Service Gaps...',
        backHome: '← Back to Home',
      },
      disabilityActivism: {
        loading: 'Loading Disability Activism...',
        backHome: '← Back to Home',
        furtherReading: 'Further Reading',
        sources: 'Sources',
        returnTop: '↑ Return to Top',
      },
    },
  },
  es: {
    appTitle: 'Kit de herramientas para el bienestar de la discapacidad',
    skipToMain: 'Saltar al contenido principal',
    accessibility: 'Accesibilidad',
    language: 'Idioma',
    nav: {
      about: 'Acerca de',
      resources: 'Recursos',
      stories: 'Historias',
      map: 'Mapa',
      advocacy: 'Incidencia',
    },
    home: {
      title: 'Kit de herramientas para el bienestar de la discapacidad',
      cards: {
        resourcesTitle: 'Recursos inmediatos',
        resourcesBody:
          'Encuentra apoyo de salud, legal, vivienda y apoyo comunitario.',
        storiesTitle: 'Historias de la comunidad',
        storiesBody: 'Lee experiencias vividas de residentes con discapacidad.',
        mapTitle: 'Mapa de accesibilidad',
        mapBody: 'Explora espacios accesibles e inaccesibles en Bethlehem.',
        policyTitle: 'Brechas de políticas y servicios',
        policyBody:
          'Conoce desafíos locales de accesibilidad y recomendaciones.',
        activismTitle: 'Activismo por la discapacidad',
        activismBody:
          'Explora movimientos y conversaciones sobre justicia para la discapacidad.',
        reportTitle: 'Reportar un problema',
        reportBody: 'Comparte una barrera de accesibilidad en la comunidad.',
        submitTitle: 'Enviar un recurso o historia',
        submitBody: 'Comparte un recurso o una historia para revisión.',
        aboutTitle: 'Acerca del kit',
        aboutBody: 'Conoce el proyecto y sus colaboradores.',
      },
      cta: {
        text:
          '¿Sabes algo que nosotros no? Este kit crece con aportes de la comunidad.',
        button: 'Contribuir al kit',
      },
    },
    pages: {
      immediateResources: {
        title: 'Recursos inmediatos',
        subtitle: 'Apoyo de salud, legal y comunitario en Bethlehem.',
        backHome: '← Volver al inicio',
        loading: 'Cargando recursos...',
        searchLabel: 'Buscar recursos',
        searchPlaceholder: 'Buscar por nombre, descripción o categoría…',
        filterLegend: 'Filtrar por categoría',
        filterAll: 'Todos',
      },
      communityStories: {
        title: 'Historias de la comunidad',
        subtitle:
          'Experiencias vividas de residentes con discapacidad y sus comunidades en Bethlehem.',
        backHome: '← Volver al inicio',
        loading: 'Cargando historias...',
        empty: 'Aún no hay historias. Vuelve pronto.',
        readFull: 'Leer historia completa →',
      },
      policyGaps: {
        loading: 'Cargando brechas de políticas y servicios...',
        backHome: '← Volver al inicio',
      },
      disabilityActivism: {
        loading: 'Cargando activismo por la discapacidad...',
        backHome: '← Volver al inicio',
        furtherReading: 'Lecturas recomendadas',
        sources: 'Fuentes',
        returnTop: '↑ Volver arriba',
      },
    },
  },
}

export function t(lang, key) {
  const parts = key.split('.')
  const get = (obj) => parts.reduce((acc, p) => (acc ? acc[p] : undefined), obj)
  return get(uiStrings[lang]) ?? get(uiStrings.en) ?? key
}

