import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const distRoot = join(projectRoot, 'dist');
const siteOrigin = 'https://www.syrm.ai';

const variants = {
  root: {
    output: 'index.html',
    path: '/',
    htmlLang: 'en',
    locale: 'en_US',
    title: 'SYRM | Real-World Demonstration Data for Physical AI',
    description:
      'SYRM captures real-world human demonstrations across physical tasks and environments, delivering structured multimodal datasets for robotics, embodied AI, and physical AI training pipelines.',
    ogDescription:
      'Human demonstrations from real environments, collected to spec and organized into structured datasets for robotics and embodied AI teams.',
  },
  en: {
    output: 'en/index.html',
    path: '/en/',
    htmlLang: 'en',
    locale: 'en_US',
    title: 'SYRM | Real-World Demonstration Data for Physical AI',
    description:
      'SYRM captures real-world human demonstrations across physical tasks and environments, delivering structured multimodal datasets for robotics, embodied AI, and physical AI training pipelines.',
    ogDescription:
      'Human demonstrations from real environments, collected to spec and organized into structured datasets for robotics and embodied AI teams.',
  },
  zh: {
    output: 'cn/index.html',
    path: '/cn/',
    htmlLang: 'zh-CN',
    locale: 'zh_CN',
    title: 'SYRM | 面向物理 AI 的真实世界示范数据',
    description:
      'SYRM 在真实任务与真实环境中采集人类示范，并为机器人、具身智能和物理 AI 训练流程交付结构化多模态数据集。',
    ogDescription:
      '按规格采集真实环境中的人类示范，并整理为面向机器人与具身智能团队的结构化数据集。',
  },
  ko: {
    output: 'ko/index.html',
    path: '/ko/',
    htmlLang: 'ko',
    locale: 'ko_KR',
    title: 'SYRM | 피지컬 AI를 위한 현실 세계 시연 데이터',
    description:
      'SYRM은 실제 작업과 환경에서 인간 시연을 수집하고 로보틱스, 임바디드 AI, 피지컬 AI 학습 파이프라인을 위한 구조화된 멀티모달 데이터셋을 제공합니다.',
    ogDescription:
      '실제 환경의 인간 시연을 요구 사양에 맞춰 수집하고 로보틱스 및 임바디드 AI 팀을 위한 구조화된 데이터셋으로 제공합니다.',
  },
};

function replaceTagAttribute(html, selector, attribute, value) {
  return html.replace(selector, (tag) => tag.replace(new RegExp(`${attribute}="[^"]*"`), `${attribute}="${value}"`));
}

function replaceMetaName(html, name, content) {
  return replaceTagAttribute(html, new RegExp(`<meta name="${name}"[^>]*>`), 'content', content);
}

function replaceMetaProperty(html, property, content) {
  return replaceTagAttribute(html, new RegExp(`<meta property="${property}"[^>]*>`), 'content', content);
}

function replaceOgLocaleAlternates(html, locale) {
  const alternates = Object.values(variants)
    .filter((variant) => variant.path !== '/' && variant.locale !== locale)
    .map((variant) => `    <meta property="og:locale:alternate" content="${variant.locale}" />`)
    .join('\n');

  return html.replace(/(?:\s*<meta property="og:locale:alternate" content="[^"]*" \/>\n?)+/, `\n${alternates}\n`);
}

function replaceJsonLd(html, schemaName, update) {
  return html.replace(
    new RegExp(`(<script type="application/ld\\+json" data-schema="${schemaName}">)([\\s\\S]*?)(\\s*</script>)`),
    (_, open, json, close) => {
      const schema = JSON.parse(json);
      update(schema);
      const serialized = JSON.stringify(schema, null, 8)
        .split('\n')
        .map((line) => `      ${line}`)
        .join('\n');

      return `${open}\n${serialized}${close}`;
    },
  );
}

function applyVariant(html, variant) {
  const canonical = `${siteOrigin}${variant.path}`;

  let next = html
    .replace(/<html lang="[^"]*">/, `<html lang="${variant.htmlLang}">`)
    .replace(/<title>.*?<\/title>/, `<title>${variant.title}</title>`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonical}" />`);

  next = replaceMetaName(next, 'description', variant.description);
  next = replaceMetaProperty(next, 'og:title', variant.title);
  next = replaceMetaProperty(next, 'og:description', variant.ogDescription);
  next = replaceMetaProperty(next, 'og:locale', variant.locale);
  next = replaceMetaName(next, 'twitter:title', variant.title);
  next = replaceMetaName(next, 'twitter:description', variant.description);
  next = replaceOgLocaleAlternates(next, variant.locale);

  next = replaceJsonLd(next, 'organization', (schema) => {
    schema.description = variant.description;
  });

  return replaceJsonLd(next, 'website', (schema) => {
    schema.inLanguage = variant.htmlLang;
    schema.description = variant.description;
  });
}

const baseHtml = await readFile(join(distRoot, 'index.html'), 'utf8');

await Promise.all(
  Object.values(variants).map(async (variant) => {
    const outputPath = join(distRoot, variant.output);
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, applyVariant(baseHtml, variant));
  }),
);
