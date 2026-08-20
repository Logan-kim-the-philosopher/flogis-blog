import { defineArrayMember, defineField, defineType } from 'sanity';

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Site title', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({ name: 'heroText', title: 'Hero text', type: 'text', rows: 3 }),
    defineField({
      name: 'nav',
      title: 'Main navigation',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'href', title: 'Href', type: 'string' })
          ]
        })
      ]
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'href', title: 'Href', type: 'url' })
          ]
        })
      ]
    }),
    defineField({
      name: 'seo',
      title: 'SEO defaults',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'SEO title', type: 'string' }),
        defineField({ name: 'description', title: 'SEO description', type: 'text', rows: 3 }),
        defineField({ name: 'image', title: 'SEO image', type: 'url' })
      ]
    })
  ]
});
