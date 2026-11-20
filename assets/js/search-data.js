// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-research",
          title: "research",
          description: "Privacy-preserving machine learning, explainable AI, and medical imaging.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "Software, machine learning, algorithms, and open-source contributions by Sushmoy Nandi.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-repositories",
          title: "repositories",
          description: "My GitHub profile and selected repositories for software projects, algorithms, and machine learning.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "Education, technical skills, projects, research interests, and training.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "projects-khata-ai",
          title: 'Khata AI',
          description: "Bangla voice bookkeeping for small businesses.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/khata-ai/";
            },},{id: "projects-myshop-ai",
          title: 'myShop AI',
          description: "AI-assisted sales management and analytics.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/myshop-ai/";
            },},{id: "projects-thyroid-ultrasound-research",
          title: 'Thyroid Ultrasound Research',
          description: "Federated learning, feature selection, and explainable image classification.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/thyroid-ultrasound-research/";
            },},{id: "projects-campus-dining-niter",
          title: 'Campus Dining NITER',
          description: "Campus meal scheduling, wallets, and dining administration.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/campus-dining-niter/";
            },},{id: "projects-tax-management-system",
          title: 'Tax Management System',
          description: "Registration, login, and tax record management.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/tax-management-system/";
            },},{id: "projects-u-turn-accident-prevention-system",
          title: 'U-Turn Accident Prevention System',
          description: "An Arduino Uno-based IoT road-safety project.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/u-turn-accident-prevention/";
            },},{id: "projects-graph-coloring-visualizer",
          title: 'Graph Coloring Visualizer',
          description: "An interactive view of DFS backtracking and graph coloring.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/graph-coloring-visualizer/";
            },},{id: "projects-machine-learning-from-scratch",
          title: 'Machine Learning from Scratch',
          description: "Machine learning algorithms implemented in Python notebooks.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/machine-learning-from-scratch/";
            },},{id: "projects-leetpush-contribution",
          title: 'LeetPush Contribution',
          description: "A merged fix for username handling in API requests.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/leetpush-contribution/";
            },},{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/Sushmoy-Nandi", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/sushmoy-nandi-737b41307", "_blank");
        },
      },{
        id: 'social-leetcode',
        title: 'LeetCode',
        section: 'Socials',
        handler: () => {
          window.open("https://leetcode.com/u/learnsushmoysk1091/", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
