import { defineConfig } from 'tinacms';

function formatDateYYYYMMDD(input?: string | Date): string {
  const date = input ? new Date(input) : new Date();
  if (Number.isNaN(date.getTime())) {
    const now = new Date();
    return formatDateYYYYMMDD(now);
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toSlug(text?: string): string {
  if (!text) return "sans-titre";
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // supprime les accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  'dev';

export default defineConfig({
  branch,
  // Get this from tina.io
  clientId: process.env.TINA_PUBLIC_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: 'admin',
    publicFolder: './',
  },
  // Uncomment to allow cross-origin requests from non-localhost origins
  // during local development (e.g. GitHub Codespaces, Gitpod, Docker).
  // Use 'private' to allow all private-network IPs (WSL2, Docker, etc.)
  // server: {
  //   allowedOrigins: ['https://your-codespace.github.dev'],
  // },
  media: {
    tina: {
      mediaRoot: '',
      publicFolder: './',
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/r/content-modelling-collections/
  schema: {
collections: [
    {
      name: 'post',
      label: 'Posts',
      path: '_posts',
      ui: {
          filename: {
            // Optionnel : passez à true pour empêcher la modification manuelle du nom de fichier
            readonly: false,
            slugify: (values) => {
              // Utilise `values?.date` si un champ date existe dans le formulaire, sinon la date du jour
              const datePrefix = formatDateYYYYMMDD(values?.date);
              const slug = toSlug(values?.title);
              return `${datePrefix}-${slug}`;
            },
          },
        },
      fields: [
        {
          type: 'string',
          name: 'title',
          label: 'Title',
          isTitle: true,
          required: true,
        },
        {
          type: 'datetime',
          name: 'date',
          label: 'Date',
          required: false,
        },
        {
          type: 'string',
          name: 'categories',
          label: 'Categories',
          list: true,
        },
        {
          type: 'rich-text',
          name: 'body',
          label: 'Body',
          isBody: true,
        },
      ],
    },
  ],
  },
});

