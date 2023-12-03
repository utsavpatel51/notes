# Notes

A connected workspace where better, faster work happens. From remote teams to hybrid workforces, Notes helps people communicate and collaborate more effectively.

### Features

- Rich text editor
- Publish page to web

### Roadmap

- [X] Real-time collaboration in notes.
  - [ ] Send Email on share notes
- [ ] More blocks in a rich text editor (e.x code block, video block)
- [ ] Integration of draw-pad in notes

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`CONVEX_DEPLOYMENT`
`NEXT_PUBLIC_CONVEX_URL`
`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
`CLERK_SECRET_KEY`
`EDGE_STORE_ACCESS_KEY`
`EDGE_STORE_SECRET_KEY`

### Run Locally

```bash
  https://github.com/utsavpatel51/notes
  cd my-project
  npm install
  npm run dev
```

## Tech Stack

**Client:** NextJS, TailwindCSS, Zustand

**Server:** Convex

## Related

The project is inspired by [Notion](https://notion.so). For initial development, I have followed [this](https://www.youtube.com/watch?v=0OaDyjB9Ib8) tutorial. For next steps, I'm planning to add more features and make it one for all solution for note-taking.
