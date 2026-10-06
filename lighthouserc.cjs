module.exports = {
  ci: {
    collect: {
      staticDistDir: "./apps/site/dist",
      url: [
        "http://localhost/",
        "http://localhost/research/netbench/",
        "http://localhost/projects/kona-token-trade/",
        "http://localhost/cv/",
      ],
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.95 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "categories:seo": ["error", { minScore: 0.95 }],
      },
    },
  },
};
