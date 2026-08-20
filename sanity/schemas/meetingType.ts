import { defineArrayMember, defineField, defineType } from 'sanity';

export const meetingType = defineType({
  name: 'meeting',
  title: 'Meeting',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (rule) => rule.required() }),
    defineField({ name: 'publishedAt', title: 'Published at', type: 'date', validation: (rule) => rule.required() }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'participants',
      title: 'Participants',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'person' }] })],
      validation: (rule) => rule.required().min(1)
    }),
    defineField({ name: 'tags', title: 'Tags', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
    defineField({
      name: 'body',
      title: 'Body (Markdown)',
      type: 'text',
      rows: 24,
      validation: (rule) => rule.required()
    })
  ]
});
