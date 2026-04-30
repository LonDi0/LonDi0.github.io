window.SITE_CONTENT = {
  siteMeta: {
    title: {
      zh: '个人主页（仅供娱乐）',
      en: 'Personal Homepage (For entertainment purposes only)'
    },
    description: {
      zh: '一个可逐步替换内容的个人主页静态模板。',
      en: 'A static homepage template with easily replaceable content.'
    }
  },
  i18n: {
    defaultLang: 'zh',
    supportedLangs: ['zh', 'en'],
    labels: {
      zh: '中文',
      en: 'EN'
    }
  },
  navigation: [
    { id: 'hero', label: { zh: '首页', en: 'Home' } },
    { id: 'about', label: { zh: '简介', en: 'About' } },
    { id: 'education', label: { zh: '教育', en: 'Education' } },
    { id: 'projects', label: { zh: '研究', en: 'Research' } },
    { id: 'publications', label: { zh: '论文', en: 'Publications' } },
    { id: 'contact', label: { zh: '联系', en: 'Contact' } }
  ],
  profile: {
    name: {
      zh: '杜宇龙',
      en: 'Long Dio'
    },
    role: {
      zh: '安全多方计算方向研究生、游戏爱好者',
      en: 'Graduate Student in Secure Multi-Party Computation and Gaming Enthusiast'
    },
    affiliation: {
      zh: '暨南大学网络空间安全学院',
      en: 'School of Cyberspace Security, Jinan University'
    },
    email: 'duyulong@stu2025.jnu.edu.cn',
    intro: [
      {
        zh: '欢迎通过邮箱与我进行学术交流或寻找游戏搭子。',
        en: 'Feel free to reach out by email for academic discussions or to team up in games.'
      },
      {
        zh: '兴趣：密码学、安全多方计算、无畏契约、王者荣耀、鸣潮。',
        en: 'Interests: cryptography, secure multi-party computation, VALORANT, Honor of Kings, and Wuthering Waves.'
      }
    ],
    avatar: 'assets/images/profile-placeholder.svg',
    avatarAlt: {
      zh: '个人头像占位图',
      en: 'Profile placeholder image'
    },
    socials: [
      { label: 'Google Scholar', url: 'https://scholar.google.com/', ariaLabel: 'Google Scholar' },
      { label: 'GitHub', url: 'https://github.com/', ariaLabel: 'GitHub' },
      { label: 'Bilibili', url: 'https://space.bilibili.com/57490945', ariaLabel: 'Bilibili' },
      { label: 'Zhihu', url: 'https://www.zhihu.com/people/ldio-79', ariaLabel: 'Zhihu' }
    ],
    cvLinks: [
      { label: { zh: 'CV (EN)', en: 'CV (EN)' }, url: '#' },
      { label: { zh: '简历 (中文)', en: 'CV (CN)' }, url: '#' }
    ]
  },
  sections: {
    about: {
      title: { zh: 'About Me', en: 'About Me' },
      subtitle: {
        zh: '我是杜宇龙，暨南大学网络空间安全学院网络与信息安全专业 25 级研究生，目前的研究方向是安全多方计算。同时我也是游戏爱好者，正在寻找无畏契约白银段位附近、王者荣耀王者段位附近的游戏搭子。',
        en: 'I am Long Dio, a first-year (Class of 2025) master\'s student in Network and Information Security at the School of Cyberspace Security, Jinan University. My current research focuses on secure multi-party computation. I am also a gaming enthusiast looking for teammates around Silver rank in VALORANT and King rank in Honor of Kings.'
      },
      paragraphs: [
        {
          zh: '我目前关注 LEGO 路线恶意模型下的两方安全计算，闲暇时间喜欢玩游戏。',
          en: 'I currently focus on two-party secure computation in the malicious model along the LEGO line of work, and I enjoy gaming in my spare time.'
        }
      ],
      highlights: [
        {
          zh: '研究方向：密码学、安全多方计算、无畏契约英雄阵容与地图理解。',
          en: 'Interests: cryptography, secure multi-party computation, and VALORANT team compositions with map strategy.'
        }
      ]
    },
    education: {
      title: { zh: 'Education', en: 'Education' },
      subtitle: {
        zh: '按时间线的教育经历',
        en: 'Education history in timeline order'
      },
      items: [
        {
          institution: {
            zh: '暨南大学 · 211',
            en: 'Jinan University'
          },
          emblem: 'assets/images/jnu-emblem-official-crop.png',
          emblemAlt: {
            zh: '暨南大学官方校徽',
            en: 'Official emblem of Jinan University'
          },
          wordmarkZh: 'assets/images/jnu-wordmark-official-zh.png?v=20260415m',
          wordmarkClass: 'school-wordmark-jnu',
          wordmarkAlt: {
            zh: '暨南大学官方校名字标',
            en: 'Official Chinese wordmark of Jinan University'
          },
          period: '2025.09 - Present',
          degree: {
            zh: '网络与信息安全 · 硕士研究生',
            en: 'M.Sc. in Network and Information Security'
          },
          details: [
            {
              zh: '院校信息：国家 211 工程高校、国家双一流建设高校。',
              en: 'Institution profile: a Project 211 university and part of China\'s Double First-Class initiative.'
            },
            {
              zh: '研究主题：两方安全计算与高性能实现。',
              en: 'Research topic: two-party secure computation and high-performance implementations.'
            }
          ]
        },
        {
          institution: {
            zh: '西南大学 · 211',
            en: 'Southwest University'
          },
          emblem: 'assets/images/swu-emblem-official-crop.png',
          emblemAlt: {
            zh: '西南大学官方校徽',
            en: 'Official emblem of Southwest University'
          },
          wordmarkZh: 'assets/images/swu-wordmark-official-zh.png?v=20260415m',
          wordmarkClass: 'school-wordmark-swu',
          wordmarkAlt: {
            zh: '西南大学官方校名字标',
            en: 'Official Chinese wordmark of Southwest University'
          },
          period: '2021.09 - 2025.07',
          degree: {
            zh: '信息安全 · 工学学士',
            en: 'B.Eng. in Information Security'
          },
          details: [
            {
              zh: '院校信息：国家 211 工程高校、国家双一流建设高校。',
              en: 'Institution profile: a Project 211 university and part of China\'s Double First-Class initiative.'
            },
            {
              zh: '毕业设计：基于级联混沌的数字图像加密算法研究。',
              en: 'Graduation project: research on a digital image encryption algorithm based on cascaded chaos.'
            },
            {
              zh: '校内经历：CTF 竞赛、学院足球队。',
              en: 'Campus activities: CTF competitions and the college soccer team.'
            }
          ]
        }
      ]
    },
    projects: {
      title: { zh: 'Research Projects', en: 'Research Projects' },
      subtitle: {
        zh: '目前正在进行的研究项目',
        en: 'Research projects currently in progress'
      },
      items: [
        {
          title: {
            zh: '基于无畏契约各英雄特性的地图通用阵容研究',
            en: 'A Study of Map-Agnostic Team Compositions Based on VALORANT Agent Traits'
          },
          period: '2025 - 2027',
          description: {
            zh: '目标是根据各英雄技能，寻找不同地图的最优阵容。',
            en: 'The goal is to identify optimal compositions for different maps based on each agent\'s abilities.'
          },
          tags: ['VALORANT', 'Hero Lineup']
        }
      ]
    },
    publications: {
      title: { zh: 'Selected Publications', en: 'Selected Publications' },
      subtitle: {
        zh: '首页展示精选条目；完整列表页已预留入口',
        en: 'Featured items on homepage; full list page is reserved'
      },
      searchPlaceholder: {
        zh: '按关键词、会议或作者筛选',
        en: 'Search by keyword, venue, or author'
      },
      filters: [
        { key: 'all', label: { zh: '全部', en: 'All' } },
        { key: 'conference', label: { zh: '会议', en: 'Conference' } },
        { key: 'journal', label: { zh: '期刊', en: 'Journal' } },
        { key: 'manuscript', label: { zh: '手稿', en: 'Manuscript' } }
      ],
      emptyText: {
        zh: '没有匹配项，请尝试其他关键词或筛选条件。',
        en: 'No results found. Try a different keyword or filter.'
      },
      fullListLabel: {
        zh: 'Full Publications List（预留）',
        en: 'Full Publications List (Reserved)'
      },
      items: [
        {
          year: 2026,
          type: 'manuscript',
          venue: 'Riot Games 2026',
          title: {
            zh: '基于三烟位的莲华古城转点策略',
            en: 'Rotation Strategies on Lotus Based on Triple-Smoke Setups'
          },
          authors: {
            zh: 'Long Dio, Shibo Lei, Jiming Li',
            en: 'Long Dio, Shibo Lei, Jiming Li'
          },
          tags: ['VALORANT', 'Hero Lineup'],
          links: [
            { label: 'PDF (EN)', url: 'assets/files/lotus-triple-smoke-asiacrypt-en.pdf?v=20260414l' },
            { label: 'PDF (中文)', url: 'assets/files/lotus-triple-smoke-asiacrypt-zh.pdf?v=20260414l' }
          ]
        },
        {
          year: 2025,
          type: 'manuscript',
          venue: 'Tecent Games 2025',
          title: {
            zh: '一种王者荣耀拆塔速推流的可行性分析与实现',
            en: 'Feasibility Analysis and Implementation of a Fast Push Turret-Demolition Strategy in Honor of Kings'
          },
          authors: {
            zh: 'Long Dio',
            en: 'Long Dio'
          },
          tags: ['Honor of Kings'],
          links: [
            { label: 'PDF (EN)', url: 'assets/files/hok-fast-push-asiacrypt-en.pdf?v=20260414b' },
            { label: 'PDF (中文)', url: 'assets/files/hok-fast-push-asiacrypt-zh.pdf?v=20260414b' }
          ]
        }
      ]
    },
    location: {
      title: { zh: 'Location', en: 'Location' },
      subtitle: {
        zh: '地址中英切换，已接入真实地图',
        en: 'Bilingual address with an embedded real map'
      },
      toggleLabel: {
        zh: '切换地址语言',
        en: 'Switch address language'
      },
      addressZh: [
        '广东省广州市番禺区兴业大道东855号',
        '暨南大学番禺校区知识产权楼 904'
      ],
      addressEn: [
        'Room 904, Intellectual Property Building',
        'Jinan University, Panyu Campus, 855 Xingye Avenue East, Panyu District, Guangzhou, China'
      ],
      mapMode: 'embed',
      amapTile: { lng: 113.412600, lat: 23.016720, zoom: 16 },
      mapEmbedUrl: {
        zh: 'https://api.map.baidu.com/marker?location=23.016720,113.412600&title=%E6%9A%A8%E5%8D%97%E5%A4%A7%E5%AD%A6%E7%95%AA%E7%A6%BA%E6%A0%A1%E5%8C%BA%E7%9F%A5%E8%AF%86%E4%BA%A7%E6%9D%83%E6%A5%BC&content=Room%2B904&output=html&coord_type=gcj02&zoom=16&src=webapp.personalhomepage.map',
        en: 'https://www.google.com/maps?hl=en&q=23.016720,113.412600&z=17&output=embed'
      },
      amapOpenUrl: '',
      amapOpenLabel: {
        zh: '在高德地图打开',
        en: 'Open in AMap'
      },
      mapImage: 'assets/images/map-placeholder.svg',
      mapAlt: {
        zh: '广州暨南大学番禺校区知识产权楼附近地图',
        en: 'Map near the Intellectual Property Building, Panyu Campus, Jinan University, Guangzhou'
      }
    },
    contact: {
      title: { zh: 'Contact', en: 'Contact' },
      subtitle: {
        zh: '保留最常用联系方式，便于合作联系',
        en: 'Core contact methods for collaboration and inquiries'
      },
      methods: [
        {
          label: { zh: '邮箱', en: 'Email' },
          value: 'duyulong@stu2025.jnu.edu.cn',
          href: 'mailto:duyulong@stu2025.jnu.edu.cn'
        },
        {
          label: { zh: 'GitHub', en: 'GitHub' },
          value: 'github.com/yourname',
          href: 'https://github.com/'
        },
        {
          label: { zh: 'Google Scholar', en: 'Google Scholar' },
          value: 'Scholar Profile Placeholder',
          href: 'https://scholar.google.com/'
        },
        {
          label: { zh: 'Bilibili', en: 'Bilibili' },
          value: 'bilibili.com',
          href: 'https://space.bilibili.com/57490945'
        }
      ]
    }
  },
  footer: {
    text: {
      zh: '© 2026 个人主页模板（占位版本）。内容与样式已分离，后续可仅改数据文件。',
      en: '© 2026 Personal Homepage Template (Placeholder). Content and layout are decoupled for easy replacement.'
    }
  }
};
