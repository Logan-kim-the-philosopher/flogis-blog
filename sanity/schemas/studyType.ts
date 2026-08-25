import { defineArrayMember, defineField, defineType } from 'sanity';

export const studyType = defineType({
  name: 'study',
  title: 'Study',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: '스터디 제목입니다. 홈 카드와 상세 페이지 제목에 그대로 노출됩니다.',
      validation: (rule) => rule.required().min(4).max(120)
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: '발행 후에는 가능하면 바꾸지 마세요. URL이 달라집니다.',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'date',
      description: '목록 정렬과 홈 노출 순서에 사용됩니다.',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      description: '관련 있는 썸네일이 있을 때만 사용합니다. 가로형 이미지를 권장합니다.',
      options: { hotspot: true }
    }),
    defineField({
      name: 'authors',
      title: 'Authors',
      type: 'array',
      description: '최소 1명의 작성자를 연결하세요.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'person' }] })],
      validation: (rule) => rule.required().min(1).max(5).unique()
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: '검색과 카드 메타에 사용됩니다. 너무 많지 않게 유지하세요.',
      of: [defineArrayMember({ type: 'string', validation: (rule) => rule.required().min(1).max(24) })],
      options: { layout: 'tags' },
      validation: (rule) => rule.max(8).unique()
    }),
    defineField({
      name: 'body',
      title: 'Body (Markdown)',
      type: 'text',
      description: 'Markdown 문법을 사용할 수 있습니다.',
      rows: 24,
      validation: (rule) => rule.required().min(20)
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publishedAt',
      media: 'coverImage'
    }
  }
});
