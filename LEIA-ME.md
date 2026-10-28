# Site Moura Conquest · como publicar

Site estático (HTML, CSS e JS). Não precisa de build.

## Publicar na Vercel
1. vercel.com > Add New > Project.
2. Arraste a pasta `moura-site` (ou suba num repositório do GitHub e importe).
3. Framework Preset: **Other**. Build Command: vazio. Output Directory: `.` (raiz).
4. Deploy.

Pelo terminal: `npx vercel` dentro da pasta, depois `npx vercel --prod`.

## Depois de ter o domínio
Trocar `SEU-DOMINIO` em `robots.txt` e `sitemap.xml` pelo domínio real.
Adicionar no `<head>` do index.html: `<link rel="canonical" href="https://dominio/">` e a URL absoluta em `og:image`.

## Pendências do cliente (marcadas no site com etiqueta laranja tracejada)
- Endereço completo (também adicionar `streetAddress` e `postalCode` no schema LocalBusiness do index.html)
- Horário de atendimento
- Área atendida confirmada (o site diz "região metropolitana de Curitiba")
- Fotos de antes e depois de peças recuperadas
- Domínio e Perfil da Empresa no Google com o mesmo nome, endereço e telefone

## Trocar uma foto
Substitua o arquivo em `img/` mantendo o mesmo nome (WebP, até 1800 px no lado maior).
