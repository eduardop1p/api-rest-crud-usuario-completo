{
  "version": 2,
  "name": "music-album",
  "builds": [
    { "src": "/dist/index.js",
    "use": "@vercel/node" }
  ],
  "routes": [
     { "src": "/(.*)", "dest": "/dist/index.js" }
  ]
}

