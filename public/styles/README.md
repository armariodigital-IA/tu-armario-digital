Add one image per style card in these folders:

- `public/styles/male/`
- `public/styles/female/`

Each filename is mapped in `lib/style-system.ts`.

Examples:

- `public/styles/male/streetwear.jpg`
- `public/styles/male/old-money.jpg`
- `public/styles/female/minimal-chic.jpg`
- `public/styles/female/coquette.jpg`

Recommended:

- Real outfit photography
- Vertical crop close to `4:5`
- Consistent lighting/style across each gender set

If you add a new style:

1. Drop the image in the matching folder.
2. Add the style entry in `lib/style-system.ts`.
3. If needed, add its palette/silhouette rules there too.
