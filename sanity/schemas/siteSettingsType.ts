import { defineArrayMember, defineField, defineType } from 'sanity';

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site title',
      type: 'string',
      description: '브라우저 제목과 전역 브랜드명에 사용됩니다.',
      validation: (rule) => rule.required().min(2).max(80)
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: '사이트 기본 설명입니다.',
      validation: (rule) => rule.required().min(10).max(180)
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: '홈 상단의 짧은 소개 문구입니다.',
      validation: (rule) => rule.required().min(6).max(120)
    }),
    defineField({
      name: 'heroText',
      title: 'Hero text',
      type: 'text',
      rows: 3,
      description: '홈 상단 메인 설명입니다.',
      validation: (rule) => rule.required().min(10).max(220)
    }),
    defineField({
      name: 'nav',
      title: 'Main navigation',
      type: 'array',
      description: '현재 프론트는 3개 내외의 간단한 상단 탭 구성을 전제로 합니다.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required().max(20) }),
            defineField({ name: 'href', title: 'Href', type: 'string', validation: (rule) => rule.required() })
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'href'
            }
          }
        })
      ],
      validation: (rule) => rule.required().min(1).max(5)
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required().max(30) }),
            defineField({ name: 'href', title: 'Href', type: 'url', validation: (rule) => rule.required() })
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'href'
            }
          }
        })
      ],
      validation: (rule) => rule.max(8)
    }),
    defineField({
      name: 'seo',
      title: 'SEO defaults',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'SEO title', type: 'string', validation: (rule) => rule.max(80) }),
        defineField({ name: 'description', title: 'SEO description', type: 'text', rows: 3, validation: (rule) => rule.max(180) }),
        defineField({ name: 'image', title: 'SEO image', type: 'url' })
      ]
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description'
    }
  }
});
