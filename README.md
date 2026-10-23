# Sean Benson — Portfolio

Static portfolio built with HTML, CSS, and JavaScript. No package installation or build step is required.

## Deploy to Vercel

### Connect the Git repository

1. Import this repository in Vercel.
2. Set the project **Root Directory** to `portfolio-site`.
3. Select **Other** as the framework preset. The included `vercel.json` disables the build step and publishes the folder directly.
4. Deploy. The root URL serves `main.html`; the CSS and JavaScript are served from the same directory.

### Deploy with the CLI

From the repository root, run:

```sh
cd portfolio-site
vercel
```

To deploy to production:

```sh
vercel --prod
```
