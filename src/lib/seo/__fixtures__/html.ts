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

export const nextJsHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Next App Demo Page for Framework Detection</title>
  <meta name="description" content="A representative Next.js HTML document used to verify conservative framework detection in our SEO checker." />
  <meta name="generator" content="Next.js 15.0" />
  <link rel="canonical" href="https://example.com/" />
  <meta property="og:title" content="Next App" />
  <meta property="og:description" content="Demo" />
  <meta property="og:image" content="https://example.com/og.png" />
  <script src="/_next/static/chunks/main.js"></script>
</head>
<body>
  <div id="__next">
    <h1>Welcome</h1>
    <script id="__NEXT_DATA__" type="application/json">{"props":{"pageProps":{}}}</script>
  </div>
</body>
</html>
`;

export const nuxtHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Nuxt App Demo Page for Framework Detection</title>
  <script src="/_nuxt/entry.js"></script>
</head>
<body>
  <div id="__nuxt"></div>
  <script>window.__NUXT__={};</script>
</body>
</html>
`;
