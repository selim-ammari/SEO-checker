export const perfectHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Acme Analytics Platform for Modern Teams</title>
  <meta name="description" content="Acme helps product teams understand user behavior with privacy-first analytics, clear dashboards, and actionable insights every day." />
  <link rel="canonical" href="https://example.com/" />
  <meta property="og:title" content="Acme Analytics" />
  <meta property="og:description" content="Privacy-first product analytics for modern teams." />
  <meta property="og:image" content="https://example.com/og.png" />
</head>
<body>
  <h1>Product analytics that respect privacy</h1>
  <h2>Why teams choose Acme</h2>
  <h3>Clear insights</h3>
  <img src="/hero.png" alt="Dashboard overview" />
  <img src="/chart.png" alt="Conversion chart" />
</body>
</html>
`;

export const missingBasicsHtml = `
<!DOCTYPE html>
<html>
<head></head>
<body>
  <p>Hello world</p>
  <img src="/a.png" />
  <img src="/b.png" />
</body>
</html>
`;

export const messyHeadingsHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Short</title>
  <meta name="description" content="Too short" />
</head>
<body>
  <h3>Skipped levels</h3>
  <h3>Another h3</h3>
  <img src="/x.png" alt="" />
</body>
</html>
`;

export const multipleH1Html = `
<!DOCTYPE html>
<html>
<head>
  <title>A reasonably long page title for SEO tests</title>
  <meta name="description" content="This meta description is long enough to pass the length validation used by our checker tool." />
  <link rel="canonical" href="https://example.com/page" />
  <meta property="og:title" content="Title" />
  <meta property="og:description" content="Description" />
  <meta property="og:image" content="https://example.com/og.png" />
</head>
<body>
  <h1>First heading</h1>
  <h1>Second heading</h1>
  <h2>Section</h2>
</body>
</html>
`;
