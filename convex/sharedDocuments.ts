import { mutation, query } from './_generated/server';
import { ConvexError, v } from 'convex/values';

export const getShareUsers = query({
  args: {
    documentId: v.id('documents'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new ConvexError('Please Login to continue!');

    const users = await ctx.db
      .query('sharedDocuments')
      .withIndex('by_user_document', (q) => q.eq('documentId', args.documentId))
      .collect();

    return users.map((user) => ({
      id: user._id,
      email: user.userEmail,
      accessLevel: user.accessLevel,
    }));
  },
});

export const getShareDocuments = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new ConvexError('Please Login to continue!');
    const userEmail = identity.email || '';

    const shareDocuments = await ctx.db
      .query('sharedDocuments')
      .withIndex('by_user_document')
      .filter((q) => q.eq(q.field('userEmail'), userEmail))
      .collect();

    const documents = await Promise.all(
      shareDocuments.map(async (doc) => {
        const document = await ctx.db.get(doc.documentId);
        return {
          id: document?._id,
          title: document?.title,
          icon: document?.icon,
        };
      }),
    );

    return documents;
  },
});

export const getShareDocumentById = query({
  args: {
    id: v.id('documents'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new ConvexError('Please Login to continue!');
    const userEmail = identity.email || '';

    const access = await ctx.db
      .query('sharedDocuments')
      .withIndex('by_user_document', (q) => q.eq('documentId', args.id).eq('userEmail', userEmail))
      .first();

    if (!access) throw new ConvexError('No document found for you');

    const existingDocument = await ctx.db.get(args.id);

    return {
      document: existingDocument,
      accessLevel: access?.accessLevel,
    };
  },
});

export const addDocumentAccess = mutation({
  args: {
    documentId: v.id('documents'),
    accessLevel: v.union(v.literal('read'), v.literal('write')),
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new ConvexError('Please Login to continue!');

    const existingDocument = await ctx.db.get(args.documentId);
    if (!existingDocument) throw new ConvexError('no document found');

    if (existingDocument.userId !== identity.subject)
      throw new ConvexError('Not allowed to access document');

    const existingShareDoc = await ctx.db
      .query('sharedDocuments')
      .withIndex('by_user_document', (q) =>
        q.eq('documentId', args.documentId).eq('userEmail', args.userEmail),
      )
      .first();
    if (existingShareDoc) return true;

    const document = await ctx.db.insert('sharedDocuments', {
      documentId: args.documentId,
      owner: identity.subject,
      userEmail: args.userEmail,
      accessLevel: args.accessLevel,
    });

    return document;
  },
});

export const updateDocumentAccess = mutation({
  args: {
    documentId: v.id('documents'),
    accessLevel: v.union(v.literal('read'), v.literal('write'), v.literal('remove')),
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new ConvexError('Please Login to continue!');

    const existingDocument = await ctx.db.get(args.documentId);
    if (!existingDocument) throw new ConvexError('no document found');

    if (existingDocument.userId !== identity.subject)
      throw new ConvexError('Not allowed to access document');

    const existingShareDoc = await ctx.db
      .query('sharedDocuments')
      .withIndex('by_user_document', (q) =>
        q.eq('documentId', args.documentId).eq('userEmail', args.userEmail),
      )
      .first();

    if (!existingShareDoc) throw new ConvexError('no document found');

    if (args.accessLevel === 'remove') return await ctx.db.delete(existingShareDoc._id);
    const document = await ctx.db.patch(existingShareDoc?._id, {
      accessLevel: args.accessLevel,
    });

    return document;
  },
});
