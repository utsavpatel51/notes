import { mutation, query } from './_generated/server';
import { ConvexError, v } from 'convex/values';
import { Doc, Id } from './_generated/dataModel';

/**
 * Get list of documents by logged-in user
 */
export const getUserDocuments = query({
  args: {
    parentDocument: v.optional(v.id('documents')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError('Please Login to continue!');

    const userId = identity.subject;

    return ctx.db
      .query('documents')
      .withIndex('by_user_parent', (q) =>
        q.eq('userId', userId).eq('parentDocument', args.parentDocument),
      )
      .filter((q) => q.eq(q.field('isArchived'), false))
      .collect();
  },
});

/**
 * Get list of archive documents by logged-in user
 */
export const getArchiveDocuments = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError('Please Login to continue!');

    const userId = identity.subject;

    return ctx.db
      .query('documents')
      .withIndex('by_user_parent', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('isArchived'), true))
      .order('desc')
      .collect();
  },
});

/**
 * Get list of all documents(without hierarchy) for user
 */
export const getSearchDocuments = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError('Please Login to continue!');

    const userId = identity.subject;

    return ctx.db
      .query('documents')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('isArchived'), false))
      .order('desc')
      .collect();
  },
});

/**
 * Get document by id
 */
export const getDocumentById = query({
  args: {
    id: v.id('documents'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) throw new ConvexError('no document found');

    if (existingDocument.isPublished && !existingDocument.isArchived) return existingDocument;

    if (!identity) throw new ConvexError('Please Login to continue!');
    const userId = identity.subject;

    if (existingDocument.userId !== userId) throw new ConvexError('Not allowed to view document');

    return existingDocument;
  },
});

/**
 * Create a new document for logged-in user
 */
export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id('documents')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError('Please Login to continue!');

    const userId = identity.subject;

    return ctx.db.insert('documents', {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    });
  },
});

/**
 * Archive a documents list
 */
export const archiveDocument = mutation({
  args: {
    id: v.id('documents'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError('Please Login to continue!');

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) throw new ConvexError('No document found for archive');

    if (existingDocument.userId !== userId)
      throw new ConvexError('Not allowed to archive document');

    const recursiveArchive = async (documentId: Id<'documents'>) => {
      const documents = await ctx.db
        .query('documents')
        .withIndex('by_user_parent', (q) => q.eq('userId', userId).eq('parentDocument', documentId))
        .collect();

      for (const document of documents) {
        await ctx.db.patch(document._id, {
          isArchived: true,
        });
        await recursiveArchive(document._id);
      }
    };

    const document = await ctx.db.patch(args.id, {
      isArchived: true,
    });

    await recursiveArchive(args.id);

    return document;
  },
});

/**
 * Restore archive documents
 */
export const restoreArchiveDocuments = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError('Please Login to continue!');

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) throw new ConvexError('No document found to restore');

    if (existingDocument.userId !== userId)
      throw new ConvexError('Not allowed to restore archive document');

    const recursiveRestore = async (documentId: Id<'documents'>) => {
      const children = await ctx.db
        .query('documents')
        .withIndex('by_user_parent', (q) => q.eq('userId', userId).eq('parentDocument', documentId))
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: false,
        });
        await recursiveRestore(child._id);
      }
    };

    const options: Partial<Doc<'documents'>> = {
      isArchived: false,
    };

    if (existingDocument.parentDocument) {
      const parentDoc = await ctx.db.get(existingDocument.parentDocument);
      if (parentDoc?.isArchived) {
        options.parentDocument = undefined;
      }
    }

    const document = await ctx.db.patch(args.id, options);
    await recursiveRestore(args.id);

    return document;
  },
});

/**
 * Delete the document permanently
 */
export const deleteDocuments = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError('Please Login to continue!');

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) throw new ConvexError('No document found to delete');

    if (existingDocument.userId !== userId) throw new ConvexError('Not allowed to delete document');

    return await ctx.db.delete(args.id);
  },
});

/**
 * Update the document
 */
export const updateDocument = mutation({
  args: {
    id: v.id('documents'),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError('Please Login to continue!');

    const userId = identity.subject;
    const { id, ...rest } = args;

    const existingDocument = await ctx.db.get(id);
    if (!existingDocument) throw new ConvexError('No document found to edit');

    if (existingDocument.userId !== userId) throw new ConvexError('Not allowed to edit document');

    return await ctx.db.patch(id, { ...rest });
  },
});
