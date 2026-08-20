import { defineArrayMember, defineField, defineType } from 'sanity';

export const meetingType = defineType({
  name: 'meeting',
  title: 'Meeting',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: '회의/대화 기록 제목입니다. 카드와 상세 제목에 그대로 노출됩니다.',
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
      description: '카드와 상세 상단에 쓰입니다. 가로형 이미지를 권장합니다.',
      options: { hotspot: true },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'participants',
      title: 'Participants',
      type: 'array',
      description: '최소 1명의 참여자를 연결하세요.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'person' }] })],
      validation: (rule) => rule.required().min(1).max(8).unique()
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
