import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    userId: v.string(),
    isArchived: v.boolean(),
    isPublished: v.boolean(),
    parentDocument: v.optional(v.id('documents')),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
  })
    .index('by_user', ['userId'])
    .index('by_user_parent', ['userId', 'parentDocument']),

  sharedDocuments: defineTable({
    documentId: v.id('documents'),
    owner: v.string(),
    userEmail: v.string(),
    accessLevel: v.union(v.literal('read'), v.literal('write')),
  })
    .index('by_user', ['userEmail'])
    .index('by_user_document', ['documentId', 'userEmail']),
});
