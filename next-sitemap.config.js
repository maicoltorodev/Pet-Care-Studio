/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://petcarestudio.vercel.app',
    generateRobotsTxt: true, // Generate robots.txt file
    sitemapSize: 7000,
    outDir: 'public',
    robotsTxtOptions: {
        additionalSitemaps: [
            `${process.env.SITE_URL || 'https://petcarestudio.vercel.app'}/sitemap.xml`, // <==== Add here
        ],
    },
}
