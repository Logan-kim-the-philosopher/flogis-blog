import { defineArrayMember, defineField, defineType } from 'sanity';

export const personType = defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: '콘텐츠에 연결되는 표시 이름입니다.',
      validation: (rule) => rule.required().min(2).max(60)
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: '이름 기반으로 자동 생성됩니다.',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: '예: 작성자, 편집자, 참여자',
      validation: (rule) => rule.max(80)
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
      description: '짧은 소개입니다.',
      validation: (rule) => rule.max(280)
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required().max(40) }),
            defineField({ name: 'href', title: 'URL', type: 'url', validation: (rule) => rule.required() })
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'href'
            }
          }
        })
      ],
      validation: (rule) => rule.max(6)
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'avatar'
    }
  }
});
