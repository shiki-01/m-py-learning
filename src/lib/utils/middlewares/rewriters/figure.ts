import { load } from "cheerio";

export function processFigure(html: string): string {
    const $ = load(html);
    const $img = $("img");

    $img.each((_, elem) => {
        const $elem = $(elem);
        const img = $elem.attr("src");
        const alt = $elem.attr("alt");
        const width = $elem.attr("width");
        const height = $elem.attr("height");

        $elem.replaceWith(
            `<figure>
                <img src="${img}" alt="${alt}" width="${width}" height="${height}">
                <figcaption>${alt}</figcaption>
            </figure>`,
        );
    });

    return $.html();
}