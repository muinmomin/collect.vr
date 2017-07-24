# collect.vr

## To sideload extension:
  - Go to [about:flags](about:flags) in Edge
  - Check "Enable extension developer features"
  - Go to Extensions pane
  - Click "Load extension" and select "collect.vr" folder

## 2D APP
### Prerequisite
  - [NodeJS v6.11.1](https://nodejs.org/en/)
  - npm 3.10.10: This will be automatically installed if you installed nodejs through the above link.

### Development
  - Go to collect.vr/collect.vr (the root path would change later)
  - 'npm run dev'
  - This will generate bundle.js in collect.vr/public, and update whenever there is change on jsx or scss files
  - Open index.html

### Packaging
  - Go to collect.vr/collect.vr (the root path would change later)
  - 'npm run build'
  - This will generate bundle.js in collect.vr/public, and update whenever there is change on jsx or scss files
